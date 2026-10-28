
const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");

const { getProtectedData } = require("../controllers/testController");

const router = express.Router();

router.get(
  "/protected",
  authMiddleware,
  requirePermission("own_profile.view"),
  getProtectedData
);

module.exports = router;
