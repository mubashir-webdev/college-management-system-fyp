
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main API Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "College Management System API is running",
  });
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// Protected Test Routes
app.use("/api/test", testRoutes);

app.use("/api/students", studentRoutes);

module.exports = app;
