const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");
const {
  createSubject,
  getSubjects,
  getSubjectByCode,
  updateSubject,
  deactivateSubject,
} = require("../controllers/subjectController");

const router = express.Router();

router.get("/", authMiddleware, requirePermission("subjects.view"), getSubjects);

router.get(
  "/:subjectCode",
  authMiddleware,
  requirePermission("subjects.view"),
  getSubjectByCode
);

router.post(
  "/",
  authMiddleware,
  requirePermission("subjects.create"),
  createSubject
);

router.patch(
  "/:subjectCode",
  authMiddleware,
  requirePermission("subjects.update"),
  updateSubject
);

router.delete(
  "/:subjectCode",
  authMiddleware,
  requirePermission("subjects.delete"),
  deactivateSubject
);

module.exports = router;
