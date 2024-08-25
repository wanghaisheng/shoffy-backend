const mongoose = require('mongoose');
const { secret } = require('./secret');

mongoose.set('strictQuery', false);

// local url 
const DB_URL = 'mongodb://0.0.0.0:27017/shofy'; 
// mongodb url
const MONGO_URI = secret.db_url;

const connectDB = () => {
  const dbName = 'test';
  return mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: dbName
    })
    .then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      console.log(`Database Name: ${dbName}`);
      return conn;
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
};

module.exports = connectDB;