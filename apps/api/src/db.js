require('dotenv').config(); 
const { MongoClient } = require('mongodb');

class Database {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      if (this.isConnected) {
        return this.db;
      }

      const uri = process.env.MONGODB_URI;
      const dbName = process.env.DB_NAME;

      if (!uri) {
        throw new Error('MONGODB_URI environment variable is required');
      }

      this.client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await this.client.connect();
      this.db = this.client.db(dbName);
      this.isConnected = true;

      console.log('Connected to MongoDB Atlas');
      
      const collections = await this.db.listCollections().toArray();
      console.log(` Available collections: ${collections.map(c => c.name).join(', ')}`);

      return this.db;
    } catch (error) {
      console.error(' MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }

  getCollection(collectionName) {
    if (!this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db.collection(collectionName);
  }


  async healthCheck() {
    try {
      await this.db.command({ ping: 1 });
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
  }
}


const database = new Database();

module.exports = database;