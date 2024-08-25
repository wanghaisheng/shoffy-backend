const { MongoClient } = require('mongodb');
const { secret } = require("./secret");

let client;

const connectDB = async () => {
  console.log('Attempting to connect to MongoDB...');
  console.log('Connection string:', secret.db_url.replace(/\/\/.*@/, '//<credentials>@'));

  try {
    client = new MongoClient(secret.db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      keepAlive: true,
      keepAliveInitialDelay: 300000
    });

    console.log('MongoClient created, attempting to connect...');
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db();
    console.log(`Database Name: ${db.databaseName}`);

    // Test the connection by running a simple command
    const result = await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Server selection error details:', JSON.stringify(error.reason, null, 2));
    }
    throw error;
  }
};

const getDB = () => {
  if (!client) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return client.db();
};

module.exports = { connectDB, getDB };