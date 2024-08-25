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

// Explicitly log the imported routes
console.log('Imported routes:', {
  userRoutes: !!userRoutes,
  categoryRoutes: !!categoryRoutes,
  brandRoutes: !!brandRoutes,
  userOrderRoutes: !!userOrderRoutes,
  productRoutes: !!productRoutes,
  orderRoutes: !!orderRoutes,
  couponRoutes: !!couponRoutes,
  reviewRoutes: !!reviewRoutes,
  adminRoutes: !!adminRoutes,
  cloudinaryRoutes: !!cloudinaryRoutes
});

// connect database
connectDB()
  .then(async () => {
    console.log('Database connected successfully');
    try {
      await seedIfEmpty();
    } catch (error) {
      console.error('Error during seeding process:', error);
    }
    startServer();
  })
  .catch(error => {
    console.error('Failed to start server:', error);
  });

function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Database status:', mongoose.connection.readyState);
  });

  server.on('error', (error) => {
    console.error('Server error:', error);
  });
}

async function seedIfEmpty() {
  console.log('Checking if database needs seeding...');
  const brandCount = await Brand.countDocuments();
  console.log(`Current brand count: ${brandCount}`);
  
  // Force seeding for testing
  console.log('Forcing seeding process for testing...');
  await seedData();
  console.log('Seeding process completed successfully.');
}

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
  res.send("App is working successfully");
});

// Add a catch-all route for debugging
app.use('*', (req, res) => {
  console.log(`Accessed undefined route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'API Not Found',
    requestedUrl: req.originalUrl
  });
});

// global error handler
app.use(globalErrorHandler);

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;