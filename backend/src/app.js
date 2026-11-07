
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const createAuthRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const {
  createLoginRateLimiter,
  parseCorsOrigins,
} = require("./config/security");

const createApp = ({
  allowedOrigins = parseCorsOrigins(),
  loginRateLimitOptions = {},
} = {}) => {
  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        callback(null, !origin || allowedOrigins.includes(origin));
      },
    })
  );
  app.use(express.json({ limit: "100kb" }));

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "College Management System API is running",
    });
  });

  app.get("/health/live", (req, res) => {
    res.status(200).json({
      success: true,
      status: "live",
    });
  });

  app.get("/health/ready", (req, res) => {
    const isDatabaseReady = mongoose.connection.readyState === 1;

    res.status(isDatabaseReady ? 200 : 503).json({
      success: isDatabaseReady,
      status: isDatabaseReady ? "ready" : "not_ready",
      database: isDatabaseReady ? "connected" : "disconnected",
    });
  });

  app.use(
    "/api/auth",
    createAuthRoutes(createLoginRateLimiter(loginRateLimitOptions))
  );

  app.use("/api/test", testRoutes);

  app.use("/api/students", studentRoutes);

  app.use("/api/teachers", teacherRoutes);

  app.use("/api/subjects", subjectRoutes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });

  app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }

    const status =
      Number.isInteger(error.status) &&
      error.status >= 400 &&
      error.status < 500
        ? error.status
        : 500;

    if (status === 500) {
      console.error("Unhandled request error:", error.name || "Error");
    }

    const message =
      status === 400
        ? "Invalid JSON request body"
        : status === 413
          ? "Request body is too large"
          : status === 500
            ? "Internal server error"
            : "Request could not be processed";

    return res.status(status).json({
      success: false,
      message,
    });
  });

  return app;
};

const app = createApp();
app.createApp = createApp;

module.exports = app;
