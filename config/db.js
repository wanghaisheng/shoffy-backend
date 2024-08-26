const { MongoClient } = require('mongodb');

let client;

const connectDB = async () => {
  console.log('Attempting to connect to MongoDB...');
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  console.log('Connection URI:', uri.replace(/\/\/.*@/, '//<credentials>@'));

  try {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,
    });

    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db();
    console.log(`Database Name: ${db.databaseName}`);

    // Test the connection by inserting a document
    const collection = db.collection("testCollection");
    const testDoc = { name: "Vercel Test", timestamp: new Date() };
    const result = await collection.insertOne(testDoc);
    console.log(`Test document inserted with _id: ${result.insertedId}`);

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

const closeDB = async () => {
  if (client) {
    console.log('Closing MongoDB connection...');
    await client.close();
    console.log('MongoDB connection closed.');
  }
};

module.exports = { connectDB, getDB, closeDB };