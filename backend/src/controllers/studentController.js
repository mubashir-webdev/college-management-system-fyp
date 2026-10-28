
const Student = require("../models/Student");

// Create a new student
const createStudent = async (req, res) => {
  try {
    const {
      studentId,
      name,
      email,
      phone,
      department,
      semester,
      status,
    } = req.body;

    if (
      !studentId ||
      !name ||
      !department ||
      semester === undefined ||
      semester === null ||
      semester === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student ID, name, department, and semester are required",
      });
    }

    const existingStudent = await Student.findOne({ studentId });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "A student with this ID already exists",
      });
    }

    const student = await Student.create({
      studentId,
      name,
      email,
      phone,
      department,
      semester,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    console.error("Create student error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A student with this ID or email already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

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

    // Only allow these fields to be updated
    const allowedFields = [
      "name",
      "email",
      "phone",
      "department",
      "semester",
      "status",
    ];

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
        message: "A student with this unique value already exists",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating student",
    });
  }
  
};


module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
};