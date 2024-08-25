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
      console.log(`Database Name: ${conn.connection.name}`);
      return conn;
    })
    .catch((error) => {
      console.error(`Error connecting to MongoDB:`, error);
      throw error;
    });
};

module.exports = connectDB;