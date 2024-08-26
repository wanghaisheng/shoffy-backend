console.log('Application starting...');

const { connectDB, getDB } = require('./config/db');
const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const { secret } = require("./config/secret");
const PORT = process.env.PORT || 7000;
const morgan = require('morgan')
const Brand = require('./model/Brand');
const seedData = require('./seed'); // Import the seed data function
// error handler
const globalErrorHandler = require(".s/middleware/global-error-handler");
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
connectDB()
  .then(async (db) => {
    console.log('Database connected successfully');
    try {
      await seedData();
      console.log('Data seeded successfully');
    } catch (error) {
      console.error('Error seeding data:', error);
      // Decide if you want to continue starting the server or exit
    }
    startServer();
  })
  .catch(error => {
    console.error('Failed to start server:', error);
  });

function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (error) => {
    console.error('Server error:', error);
  });
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