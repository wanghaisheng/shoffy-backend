console.log('Application starting...');

require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const connectDB = require("./config/db");
const { secret } = require("./config/secret");
const PORT = secret.port || 7000;
const morgan = require('morgan')
const mongoose = require('mongoose');
const Brand = require('./model/Brand');
const seedData = require('./seed'); // Import the seed data function
// error handler
const globalErrorHandler = require("./middleware/global-error-handler");
// routes
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const userOrderRoutes = require("./routes/user.order.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const couponRoutes = require("./routes/coupon.routes");
const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");
const cloudinaryRoutes = require("./routes/cloudinary.routes");

console.log('Imports completed. Connecting to database...');

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// connect database
connectDB();

console.log('Database connection initiated.');

// Check if the database is empty and seed if necessary
const seedIfEmpty = async () => {
  try {
    console.log('Waiting for database connection...');
    
    // Wait for the database to connect
    if (mongoose.connection.readyState !== 1) {
      await new Promise(resolve => mongoose.connection.once('connected', resolve));
    }
    
    console.log('Database connected. Connection state:', mongoose.connection.readyState);
    
    const brandCount = await Brand.countDocuments();
    console.log(`Current brand count: ${brandCount}`);
    
    if (brandCount === 0) {
      console.log('Database is empty. Starting seeding process...');
      await seedData();
      console.log('Seeding process completed successfully.');
    } else {
      console.log('Database is not empty. Skipping seed process.');
    }
  } catch (error) {
    console.error('Error during database check/seed process:', error);
  }
};

// Run the seed check before starting the server
seedIfEmpty().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Database status:', mongoose.connection.readyState);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
});

app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/user-order", userOrderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/admin", adminRoutes);

// root route
app.get("/", (req, res) => {
  console.log('Root route accessed');
  res.send("Apps worked successfully");
});

// global error handler
app.use(globalErrorHandler);
//* handle not found
app.use((req, res, next) => {
  console.log('Not found route accessed:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;