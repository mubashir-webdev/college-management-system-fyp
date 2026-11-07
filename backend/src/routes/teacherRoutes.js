const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");
const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deactivateTeacher,
} = require("../controllers/teacherController");

const router = express.Router();

router.get("/", authMiddleware, requirePermission("teachers.view"), getTeachers);

router.get(
  "/:teacherId",
  authMiddleware,
  requirePermission("teachers.view"),
  getTeacherById
);

router.post(
  "/",
  authMiddleware,
  requirePermission("teachers.create"),
  createTeacher
);

router.patch(
  "/:teacherId",
  authMiddleware,
  requirePermission("teachers.update"),
  updateTeacher
);

router.delete(
  "/:teacherId",
  authMiddleware,
  requirePermission("teachers.delete"),
  deactivateTeacher
);

module.exports = router;
