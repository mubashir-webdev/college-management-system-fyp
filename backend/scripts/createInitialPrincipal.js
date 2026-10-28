
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../src/config/db");
const User = require("../src/models/user");
const Role = require("../src/models/role");

const createInitialPrincipal = async () => {
  try {
    const {
      INITIAL_ADMIN_NAME,
      INITIAL_ADMIN_EMAIL,
      INITIAL_ADMIN_PASSWORD,
    } = process.env;

    if (
      !INITIAL_ADMIN_NAME ||
      !INITIAL_ADMIN_EMAIL ||
      !INITIAL_ADMIN_PASSWORD
    ) {
      throw new Error("Initial admin environment variables are missing.");
    }

    if (INITIAL_ADMIN_PASSWORD.length < 12) {
      throw new Error("Use an initial admin password of at least 12 characters.");
    }

    await connectDB();

    const principalRole = await Role.findOne({
      name: "principal",
      status: "active",
    });

    if (!principalRole) {
      throw new Error("Active principal role was not found in the database.");
    }

    const existingPrincipal = await User.findOne({
      role: "principal",
    });

    if (existingPrincipal) {
      console.log("A Principal account already exists. No changes made.");
      return;
    }

    const email = INITIAL_ADMIN_EMAIL.trim().toLowerCase();

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      throw new Error("This email is already being used by another account.");
    }

    const hashedPassword = await bcrypt.hash(
      INITIAL_ADMIN_PASSWORD,
      12
    );

    await User.create({
      name: INITIAL_ADMIN_NAME.trim(),
      email,
      password: hashedPassword,
      role: "principal",
      status: "active",
    });

    console.log("Initial Principal account created successfully.");
    console.log(`Principal email: ${email}`);
  } catch (error) {
    console.error("Principal setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

createInitialPrincipal();
