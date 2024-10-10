// Mongodb database client
const { MongoClient, ServerApiVersion } = require("mongodb");

// Using MongoDB Atlas cloud storage
const uri = 'mongodb+srv://vcanokwuru:Phillipians419@cluster0.0sscg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

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
      // Uncomment the next line if you have a users collection
      // this.users = this.db.collection("users");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
