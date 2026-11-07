const Teacher = require("../models/Teacher");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const createFields = new Set([
  "teacherId",
  "name",
  "email",
  "phone",
  "department",
]);
const updateFields = new Set(["name", "email", "phone", "department"]);

const getUnknownField = (body, allowedFields) =>
  Object.keys(body).find((field) => !allowedFields.has(field));

const normalizeOptionalEmail = (email) => {
  if (email === undefined || email === null || email.trim() === "") {
    return undefined;
  }

  return email.trim().toLowerCase();
};

const validateEmail = (email) =>
  email === undefined ||
  email === null ||
  (typeof email === "string" &&
    (email.trim() === "" || emailPattern.test(email.trim())));

const isValidProfileString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const createTeacher = async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "A teacher profile object is required",
      });
    }

    const unknownField = getUnknownField(body, createFields);
    if (unknownField) {
      return res.status(400).json({
        success: false,
        message: `Unknown teacher field: ${unknownField}`,
      });
    }

    if (
      !isValidProfileString(body.teacherId) ||
      !isValidProfileString(body.name) ||
      !isValidProfileString(body.department) ||
      !validateEmail(body.email) ||
      (body.phone !== undefined && typeof body.phone !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Teacher ID, name, and department are required; contact fields must be valid",
      });
    }

    const teacherId = body.teacherId.trim();
    const email = normalizeOptionalEmail(body.email);
    const duplicateConditions = [{ teacherId }];
    if (email) {
      duplicateConditions.push({ email });
    }

    const existingTeacher = await Teacher.findOne({
      $or: duplicateConditions,
    });
    if (existingTeacher) {
      return res.status(409).json({
        success: false,
        message: "A teacher with this ID or email already exists",
      });
    }

    const teacher = await Teacher.create({
      teacherId,
      name: body.name.trim(),
      ...(email ? { email } : {}),
      ...(body.phone !== undefined ? { phone: body.phone.trim() } : {}),
      department: body.department.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacher,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A teacher with this ID or email already exists",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Teacher profile contains an invalid value",
      });
    }

    console.error("Create teacher failed:", error.name || "Error");
    return res.status(500).json({
      success: false,
      message: "Server error while creating teacher",
    });
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    console.error("Get teachers failed:", error.name || "Error");
    return res.status(500).json({
      success: false,
      message: "Server error while fetching teachers",
    });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      teacherId: req.params.teacherId,
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error("Get teacher failed:", error.name || "Error");
    return res.status(500).json({
      success: false,
      message: "Server error while fetching teacher",
    });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "A teacher update object is required",
      });
    }

    const unknownField = getUnknownField(body, updateFields);
    if (unknownField) {
      return res.status(400).json({
        success: false,
        message: `Unknown teacher field: ${unknownField}`,
      });
    }

    const fields = Object.keys(body);
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    if (
      (body.name !== undefined && !isValidProfileString(body.name)) ||
      (body.department !== undefined &&
        !isValidProfileString(body.department)) ||
      !validateEmail(body.email) ||
      (body.phone !== undefined && typeof body.phone !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Teacher update contains an invalid value",
      });
    }

    const updates = {};
    if (body.name !== undefined) {
      updates.name = body.name.trim();
    }
    if (body.department !== undefined) {
      updates.department = body.department.trim();
    }
    if (body.phone !== undefined) {
      updates.phone = body.phone.trim();
    }

    const normalizedEmail =
      body.email !== undefined ? normalizeOptionalEmail(body.email) : undefined;
    if (body.email !== undefined && normalizedEmail) {
      updates.email = normalizedEmail;
    }

    if (normalizedEmail) {
      const emailOwner = await Teacher.findOne({
        email: normalizedEmail,
        teacherId: { $ne: req.params.teacherId },
      });
      if (emailOwner) {
        return res.status(409).json({
          success: false,
          message: "A teacher with this email already exists",
        });
      }
    }

    const updateOperation = {};
    if (Object.keys(updates).length > 0) {
      updateOperation.$set = updates;
    }
    if (body.email !== undefined && !normalizedEmail) {
      updateOperation.$unset = { email: 1 };
    }

    const teacher = await Teacher.findOneAndUpdate(
      { teacherId: req.params.teacherId },
      updateOperation,
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      teacher,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A teacher with this ID or email already exists",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Teacher update contains an invalid value",
      });
    }

    console.error("Update teacher failed:", error.name || "Error");
    return res.status(500).json({
      success: false,
      message: "Server error while updating teacher",
    });
  }
};

const deactivateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { teacherId: req.params.teacherId },
      { $set: { status: "inactive" } },
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teacher deactivated successfully",
      teacher,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Teacher could not be deactivated",
      });
    }

    console.error("Deactivate teacher failed:", error.name || "Error");
    return res.status(500).json({
      success: false,
      message: "Server error while deactivating teacher",
    });
  }
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deactivateTeacher,
};
