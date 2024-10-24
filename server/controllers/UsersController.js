const dbClient = require("../utils/db");
const sha1 = require("sha1");
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

class UsersController {
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
        token,
        user: userWithoutPassword // Exclude password from response
      });
    } catch (error) {
      console.error("Error during login:", error.message);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }

  // Retrieve the user from redis based on the token
  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokenKey = `auth_${token}`;

    try {
      const userId = await redisClient.get(tokenKey);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userObj = { _id: new ObjectId(userId) };
      const projection = { projection: { email: 1 } };
      const user = await dbClient.users.findOne(userObj, projection);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return res.status(200).json({ id: user._id, email: user.email });
    } catch (err) {
      console.error('Error retrieving user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Sign-out the user and delete the token
  static async logoutUser(req, res) {
    // Retrieve the user from the token
    const token = req.headers['x-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Delete the token in Redis
    await redisClient.del(tokenKey);

    return res.status(204).send();
  }

  /* Update user data
  static async addOrder(req, res) {
    const email = req.body.userData.email;
    const orderData = req.body.orderData;

    try {
      // Fetch current user data to get the existing order history
      const user = await dbClient.users.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedOrderHistory = [...(user.orders || []), ...orderData];
      const update = { $set: { orderHistory: updatedOrderHistory } };

      const result = await dbClient.users.updateOne({ email }, update);

      if (result.modifiedCount > 0) {
        console.log("Document updated successfully");
        return res.status(200).json({ message: "Order added successfully" });
      } else {
        console.log("No documents matched the filter. No updates were made.");
        return res.status(304).json({ message: "No changes made" });
      }
    } catch {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "An error occurred while updating the order" });
    }
  } */

  // Delete user from database
  static async deleteUser(req, res) {
    const userEmail = req.params.email;
    try {
      await dbClient.products.findOneAndDelete({ email: userEmail });
      res.status(200).send("User deleted successfully");
    } catch (error) {
      res.status(500).send(`Error deleting user: ${error.message}`);
    }
  }
}

module.exports = UsersController;
