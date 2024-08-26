const mongoose = require('mongoose');
const { secret } = require('./secret');

mongoose.set('strictQuery', false);

// mongodb url
const MONGO_URI = secret.db_url;

const connectDB = async () => {
  try { 
    await mongoose.connect(MONGO_URI);
    console.log('mongodb connection success!');
    return mongoose.connection;
  } catch (err) {
    console.log('mongodb connection failed!', err.message);
    throw err;
  }
};

module.exports = { connectDB, getDB: () => mongoose.connection };