const Subject = require("../models/Subject");

const createSubject = async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "A subject object is required",
      });
    }

    const unknownField = Object.keys(body).find(
      (field) => !["subjectCode", "name"].includes(field)
    );
    if (unknownField) {
      return res.status(400).json({
        success: false,
        message: `Unknown subject field: ${unknownField}`,
      });
    }

    if (
      typeof body.subjectCode !== "string" ||
      !body.subjectCode.trim() ||
      typeof body.name !== "string" ||
      !body.name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject code and name are required",
      });
    }

    const subjectCode = body.subjectCode.trim();
    const existingSubject = await Subject.findOne({ subjectCode });
    if (existingSubject) {
      return res.status(409).json({
        success: false,
        message: "A subject with this code already exists",
      });
    }

    const subject = await Subject.create({
      subjectCode,
      name: body.name.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A subject with this code already exists",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Subject contains an invalid value",
      });
    }

    console.error("Create subject failed:", error.name || "Error");
    return res.status(500).json({
      success: false,
      message: "Server error while creating subject",
    });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    console.error("Get subjects failed:", error.name || "Error");
    return res.status(500).json({
      success: false,
      message: "Server error while fetching subjects",
    });
  }
};

const getSubjectByCode = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      subjectCode: req.params.subjectCode,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      subject,
    });
  } catch (error) {
    console.error("Get subject failed:", error.name || "Error");
    return res.status(500).json({
      success: false,
      message: "Server error while fetching subject",
    });
  }
};

const updateSubject = async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "A subject update object is required",
      });
    }

    const unknownField = Object.keys(body).find((field) => field !== "name");
    if (unknownField) {
      return res.status(400).json({
        success: false,
        message: `Unknown subject field: ${unknownField}`,
      });
    }

    if (Object.keys(body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a name to update",
      });
    }

    if (typeof body.name !== "string" || !body.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject name must be a non-empty string",
      });
    }

    const subject = await Subject.findOneAndUpdate(
      { subjectCode: req.params.subjectCode },
      { $set: { name: body.name.trim() } },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A subject with this code already exists",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Subject update contains an invalid value",
      });
    }

    console.error("Update subject failed:", error.name || "Error");
    return res.status(500).json({
      success: false,
      message: "Server error while updating subject",
    });
  }
};

const deactivateSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { subjectCode: req.params.subjectCode },
      { $set: { status: "inactive" } },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject deactivated successfully",
      subject,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Subject could not be deactivated",
      });
    }

    console.error("Deactivate subject failed:", error.name || "Error");
    return res.status(500).json({
      success: false,
      message: "Server error while deactivating subject",
    });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectByCode,
  updateSubject,
  deactivateSubject,
};
