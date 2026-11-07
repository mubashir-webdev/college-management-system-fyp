
const express = require("express");
const { login } = require("../controllers/authController");
const { createLoginRateLimiter } = require("../config/security");

const createAuthRoutes = (loginRateLimiter = createLoginRateLimiter()) => {
  const router = express.Router();

  router.post("/login", loginRateLimiter, login);

  return router;
};

module.exports = createAuthRoutes;
