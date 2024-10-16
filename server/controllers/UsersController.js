const dbClient = require('../utils/db');
const sha1 = require('sha1');

class UsersController {
  // Put registered user in database
  static async addNewUser(req, res) {
    try {
      const { name, email, password } = req.body;
      // Validate user input
      if (!name) return res.status(400).send({ error: 'Missing name' });
      if (!email) return res.status(400).send({ error: 'Missing email' });
      if(!password) return res.status(400).send({ error: 'Missing password' });

      // Check if existing user in DB
      const existingUser = await dbClient.users.findOne({ email });
      if (existingUser) return res.status(400).send({ error: 'User already exists' });

      // Hash password using SHA1
      const hashedPassword = sha1(password);

      // Create new user
      const newUser = { name, email, password: hashedPassword };
      const result = await dbClient.users.insertOne(newUser);
      return res.status(201).send({ message: 'User data saved successfully!', result });

    } catch(error) {
      console.error('Error creating user:', error.message);
      res.status(500).send('Error creating user')
    }
  }
}

module.exports = UsersController;
