const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI || !process.env.MONGO_URI.trim()) {
    throw new Error("MONGO_URI is required to connect to MongoDB");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.name || "Error");
    throw new Error("MongoDB connection failed");
  }
};

module.exports = connectDB;