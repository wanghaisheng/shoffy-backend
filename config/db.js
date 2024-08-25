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
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db();
    console.log(`Database Name: ${db.databaseName}`);

    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
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