const mongoose = require("mongoose");
const { secret } = require("./secret");

const connectDB = () => {
  console.log('Attempting to connect to MongoDB...');
  console.log('Connection string:', secret.db_url.replace(/\/\/.*@/, '//<credentials>@'));
  return mongoose
    .connect(secret.db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      console.log('Connection object:', JSON.stringify(conn.connection, null, 2));
      
      // Try to get the database name from different properties
      const dbName = conn.connection.name || conn.connection.db?.databaseName || 'Unknown';
      console.log(`Database Name: ${dbName}`);
      
      // Log more details about the connection
      console.log('Mongoose readyState:', conn.connection.readyState);
      console.log('Mongoose models:', Object.keys(conn.models));
      
      return conn;
    })
    .catch((error) => {
      console.error(`Error connecting to MongoDB:`, error);
      throw error;
    });
};

module.exports = connectDB;