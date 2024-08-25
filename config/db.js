const { MongoClient } = require('mongodb');
const { secret } = require('./secret');

let client;

const connectDB = async () => {
  console.log('Attempting to connect to MongoDB...');
  const uri = secret.db_url;

  console.log('Connection URI:', uri.replace(/\/\/.*@/, '//<credentials>@'));

  try {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000
    });

    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db();
    console.log(`Database Name: ${db.databaseName}`);

    const result = await db.command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');

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

const closeDB = async () => {
  if (client) {
    console.log('Closing MongoDB connection...');
    await client.close();
    console.log('MongoDB connection closed.');
  }
};

process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = { connectDB, getDB, closeDB };