
const Student = require("../models/Student");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Create a new student
const createStudent = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "A student object is required",
      });
    }

    const allowedFields = new Set([
      "studentId",
      "name",
      "email",
      "phone",
      "department",
      "semester",
      "status",
    ]);
    const unknownFields = Object.keys(req.body).filter(
      (field) => !allowedFields.has(field)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Unknown student field: ${unknownFields[0]}`,
      });
    }

    const {
      studentId,
      name,
      email,
      phone,
      department,
      semester,
      status,
    } = req.body;
    const parsedSemester =
      typeof semester === "number" || typeof semester === "string"
        ? Number(semester)
        : Number.NaN;

    if (
      typeof studentId !== "string" ||
      !studentId.trim() ||
      typeof name !== "string" ||
      !name.trim() ||
      typeof department !== "string" ||
      !department.trim() ||
      semester === undefined ||
      semester === null ||
      semester === "" ||
      !Number.isInteger(parsedSemester) ||
      parsedSemester < 1 ||
      parsedSemester > 12 ||
      (email !== undefined &&
        email !== null &&
        (typeof email !== "string" ||
          (email.trim() !== "" && !emailPattern.test(email.trim()))))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student ID, name, department, and semester are required",
      });
    }

    if (
      status !== undefined &&
      !["active", "inactive", "graduated"].includes(status)
    ) {
      return res.status(400).json({
          success: false,
          message: "Student status must be active, inactive, or graduated",
      });
    }

    const normalizedStudentId = studentId.trim();
    const existingStudent = await Student.findOne({
      studentId: normalizedStudentId,
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "A student with this ID already exists",
      });
    }

    const student = await Student.create({
      studentId: normalizedStudentId,
      name,
      email,
      phone,
      department,
      semester: parsedSemester,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A student with this ID already exists",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Student data contains an invalid value",
      });
    }

    console.error("Create student failed:", error.name || "Error");
    return res.status(500).json({
      success: false,
      message: "Server error while creating student",
    });
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get students error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching students",
    });
  }
};

// Get one student by student ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      studentId: req.params.studentId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get student error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching student",
    });
  }
};


const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "A student update object is required",
      });
    }

    // Only allow these fields to be updated
    const allowedFields = [
      "name",
      "email",
      "phone",
      "department",
      "semester",
      "status",
    ];
    const unknownFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Unknown student field: ${unknownFields[0]}`,
      });
    }

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    if (updates.semester !== undefined) {
      const semester =
        typeof updates.semester === "number" ||
        typeof updates.semester === "string"
          ? Number(updates.semester)
          : Number.NaN;

      if (!Number.isInteger(semester) || semester < 1 || semester > 12) {
        return res.status(400).json({
          success: false,
          message: "Student semester must be an integer from 1 to 12",
        });
      }

      updates.semester = semester;
    }

    if (
      updates.status !== undefined &&
      !["active", "inactive", "graduated"].includes(updates.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Student status must be active, inactive, or graduated",
      });
    }

    if (
      updates.email !== undefined &&
      updates.email !== null &&
      (typeof updates.email !== "string" ||
        (updates.email.trim() !== "" &&
          !emailPattern.test(updates.email.trim())))
    ) {
      return res.status(400).json({
        success: false,
        message: "Student email address is invalid",
      });
    }

    const student = await Student.findOneAndUpdate(
      { studentId },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Student update conflicts with an existing record",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Student update contains an invalid value",
      });
    }

    console.error("Update student failed:", error.name || "Error");
    return res.status(500).json({
      success: false,
      message: "Server error while updating student",
    });
  }
  
};


/**
 * Delete a student using their studentId
 */
const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOneAndDelete({ studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      student,
    });
  } catch (error) {
    console.error("Delete student error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting student",
    });
  }
};


module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};