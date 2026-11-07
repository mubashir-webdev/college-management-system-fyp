
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;
const requiredEnvironmentVariables = ["MONGO_URI", "JWT_SECRET"];

const validateEnvironment = () => {
  const missingVariables = requiredEnvironmentVariables.filter(
    (name) => !process.env[name] || !process.env[name].trim()
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`
    );
  }
};

const startServer = async () => {
  try {
    validateEnvironment();
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("HTTP server failed to start:", error.code || error.name);
      process.exitCode = 1;
      mongoose.disconnect().catch((disconnectError) => {
        console.error(
          "MongoDB shutdown failed:",
          disconnectError.name || "Error"
        );
      });
    });

    let isShuttingDown = false;
    const shutdown = (signal) => {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;
      console.log(`${signal} received; shutting down`);

      server.close(async (error) => {
        if (error) {
          console.error("HTTP server shutdown failed:", error.name);
          process.exitCode = 1;
        }

        try {
          await mongoose.disconnect();
        } catch (disconnectError) {
          console.error(
            "MongoDB shutdown failed:",
            disconnectError.name || "Error"
          );
          process.exitCode = 1;
        }
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exitCode = 1;
  }
};

startServer();
