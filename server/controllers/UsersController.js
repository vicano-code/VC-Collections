const dbClient = require("../utils/db");
const sha1 = require("sha1");
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

class UsersController {
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

  // Get all users
  static async getAllUsers(request, response) {
    try {
      const data = await dbClient.users.find().toArray();
      response.status(200).send(data);
    } catch (error) {
      response.status(500).send(`Error retrieving products: ${error.message}`);
    }
  }

  static async loginAdmin(req, res) {
    const { username, password } = req.body;
    try {
      const user = await dbClient.user.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials or not an admin' });
      }

      if (sha1(password) !== user.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate a redis token
      if (!redisClient.isAlive()) {
        console.log("Redis client is not connected. Attempting to reconnect...");
        await redisClient.client.connect();
      }
      const token = uuidv4();
      const tokenKey = `auth_${token}`;
      await redisClient.set(tokenKey, user._id.toString(), 3600); // Store token for 1 hour
      console.log('Redis storage successful');
      res.status(200).json({ token });
    } catch(error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UsersController;
