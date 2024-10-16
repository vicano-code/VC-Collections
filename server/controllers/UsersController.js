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
      const now = new Date();
      const dateStr = now.toISOString(); // e.g., "2024-10-16T10:30:00.000Z"
      const newUser = { name, email, password: hashedPassword, created: dateStr };
      const doc = await dbClient.users.insertOne(newUser);
      if (!doc.acknowledged) {
        return res.status(400).send({ error: 'User insert operation was not successful.' });
      } 

      // Omit the hashed password in the response for security
      const { password: _, ...userWithoutPassword } = newUser; // Destructure to omit password
      return res.status(201).send({ message: 'User data saved successfully!', user: userWithoutPassword });

    } catch(error) {
      console.error('Error creating user:', error.message);
      res.status(500).send('Error creating user');
    }
  }

  static async loginUser(req, res) {
    // Check if email exists in DB
    const { email, password } = req.body;
    try {
      const user = await dbClient.users.findOne({ email });
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      // Check if the provided password matches the hashed password in the database
      const hashedPassword = sha1(password);
      if (user.password !== hashedPassword) {
        return res.status(401).send({ error: 'Invalid password' });
      }

      // Successfully authenticated
      // const { password: _, ...userWithoutPassword } = user; // Omit password from response
      //console.log(userWithoutPassword);
      return res.status(200).send({ message: 'Login successful', user });

    } catch (error) {
      console.error('Error during login:', error.message);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UsersController;
