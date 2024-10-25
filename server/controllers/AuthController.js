const dbClient = require("../utils/db");
const sha1 = require("sha1");
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

class AuthController {
  // Add registered user in database
  static async addNewUser(req, res) {
    try {
      const { name, email, password } = req.body;
      
      // Validate user input
      if (!name) return res.status(400).send({ error: "Missing name" });
      if (!email) return res.status(400).send({ error: "Missing email" });
      if (!password) return res.status(400).send({ error: "Missing password" });

      // Check if existing user in DB
      const existingUser = await dbClient.users.findOne({ email });
      if (existingUser)
        return res.status(400).send({ error: "User already exists" });

      // Hash password using SHA1
      const hashedPassword = sha1(password);

      // Create new user
      const now = new Date();
      const dateStr = now.toISOString(); // e.g., "2024-10-16T10:30:00.000Z"
      const newUser = {
        name,
        email,
        password: hashedPassword,
        created: dateStr,
        loginHistory: [],
        orderHistory: [],
      };
      const doc = await dbClient.users.insertOne(newUser);
      if (!doc.acknowledged) {
        return res
          .status(400)
          .send({ error: "User insert operation was not successful." });
      }

      // Omit the hashed password in the response for security
      const { password: _, ...userWithoutPassword } = newUser; // Destructure to omit password
      return res
        .status(201)
        .send({
          message: "User data saved successfully!",
          user: userWithoutPassword,
        });
    } catch (error) {
      console.error("Error creating user:", error.message);
      res.status(500).send("Error creating user");
    }
  }

  // user login
  static async loginUser(req, res) {
    // Decode the email and password from the Authorization header
    const authHeader = req.header('Authorization') || '';
    const base64Credentials = authHeader.split(' ')[1]; // Get the encoded part
    if (!base64Credentials) return res.status(401).send({ error: 'Unauthorized' });

    const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = decodedCredentials.split(':');

    // Check if email exists in DB
    try {
       // Authenticate the user using the decoded email and password
      const user = await dbClient.users.findOne({ email, password: sha1(password) });
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      // Successfully authenticated
      const { password: _, ...userWithoutPassword } = user; // Omit password from response

      // Update login history
      const currentDate = new Date(Date.now()).toUTCString();
      await dbClient.users.updateOne({ email }, { $push: { loginHistory: currentDate } });

      // Generate a token and store it in Redis
        if (!redisClient.isAlive()) {
          console.log("Redis client is not connected. Attempting to reconnect...");
          await redisClient.client.connect();
        }
        const token = uuidv4();
        const tokenKey = `auth_${token}`;
        await redisClient.set(tokenKey, user._id.toString(), 24 * 60 * 60); // Store token for 24 hours
        console.log('Redis storage successful');

      // Return the token and user to the client
      return res.status(200).send({
        message: 'Login successful',
        tokenKey,
        user: userWithoutPassword // Exclude password from response
      });
    } catch (error) {
      console.error("Error during login:", error.message);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
}

module.exports = AuthController;