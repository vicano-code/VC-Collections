const dbClient = require('../utils/db');
const sha1 = require('sha1');

class UsersController {
  // Put registered user in database
  static async addNewUser(req, res) {
    try {
      const { name, email, password } = req.body;
      // Validate user input
      if (!name) res.status(400).send('missing name');
      if (!email) res.status(400).send('missing email');
      if(!password) res.status(400).send('missing password');

      // Check if existing user in DB
      const existingUser = await dbClient.users.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Already exist' });

      // Hash password using SHA1
      const hashedPassword = sha1(password);

      // Create new user
      const newUser = { name, email, password: hashedPassword };
      const result = await dbClient.users.insertOne(newUser);
      return res.status(201).send({ message: 'User data saved successfully!', result });

    } catch(error) {
      console.error(error.message);
      res.status(500).send('Error creating user')
    }
  }
}

module.exports = UsersController;
