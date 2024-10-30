// Mongodb database client
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Using MongoDB Atlas cloud storage
const uri = process.env.MONGODB_URI || 'undefined';

class DBClient {
  constructor() {
    if (!uri) {
      console.error("MongoDB URI is not defined. Please set DB_URI in environment variables.");
      return;
    }

    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    this.connectDB();
  }

  async connectDB() {
    try {
      await this.client.connect();
      console.log("Connected successfully to MongoDB Atlas");
      this.db = this.client.db("vc_collections");
      this.products = this.db.collection("products");
      this.users = this.db.collection("users");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
