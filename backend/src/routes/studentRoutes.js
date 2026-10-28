const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
} = require("../controllers/studentController");

const router = express.Router();

// Get all students
router.get(
  "/",
  authMiddleware,
  requirePermission("students.view"),
  getStudents
);

// Get one student by student ID
router.get(
  "/:studentId",
  authMiddleware,
  requirePermission("students.view"),
  getStudentById
);

// Create a new student
router.post(
  "/",
  authMiddleware,
  requirePermission("students.create"),
  createStudent
);

// Update a student
router.patch(
  "/:studentId",
  authMiddleware,
  requirePermission("students.update"),
  updateStudent
);

module.exports = router;








