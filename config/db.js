const { MongoClient } = require('mongodb');
const { secret } = require('./secret');

let client;

const connectDB = async () => {
  console.log('Attempting to connect to MongoDB...');
  // const uri = secret.db_url;
  const uri = "mongodb+srv://admin:teblU23jwfhlMaTX@shofy.cgnql.mongodb.net/?retryWrites=true&w=majority";

  console.log('Connection URI:', uri.replace(/\/\/.*@/, '//<credentials>@'));

  try {
    client = new MongoClient(uri);

    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db("test"); // Make sure this matches your database name
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
  return client.db("test"); // Make sure this matches your database name
};

const closeDB = async () => {
  if (client) {
    console.log('Closing MongoDB connection...');
    await client.close();
    console.log('MongoDB connection closed.');
  }
};

module.exports = { connectDB, getDB, closeDB };