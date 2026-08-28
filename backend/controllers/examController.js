const mongoose = require("mongoose");
const Exam = require("../models/Exam");

const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const validStatuses = [
  "Not Started",
  "In Progress",
  "Ready",
];

const validateExam = ({ title, subject, date }) => {
  if (!title?.trim() || !subject?.trim() || !date) {
    return "Title, subject and date are required.";
  }

  return null;
};


// ===============================
// GET ALL EXAMS
// ===============================

const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({
      user: req.user,
    }).sort({
      date: 1,
      time: 1,
      createdAt: -1,
    });

    res.json({
      exams,
    });

  } catch (error) {

    console.error("Get exams error:", error);

    res.status(500).json({
      message: "Unable to load exams.",
    });
  }
};


// ===============================
// CREATE EXAM
// ===============================

const createExam = async (req, res) => {
  try {

    const {
      title,
      subject,
      date,
      time,
      location,
      status,
      notes,
    } = req.body;

    const validationError = validateExam({
      title,
      subject,
      date,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const exam = await Exam.create({
      user: req.user,

      title: title.trim(),

      subject: subject.trim(),

      date,

      time: time || "00:00",

      location: location?.trim() || "",

      status: validStatuses.includes(status)
        ? status
        : "Not Started",

      notes: notes?.trim() || "",
    });

    res.status(201).json({
      message: "Exam created successfully.",
      exam,
    });

  } catch (error) {

    console.error("Create exam error:", error);

    res.status(500).json({
      message: "Unable to create exam.",
    });
  }
};


// ===============================
// UPDATE EXAM
// ===============================

const updateExam = async (req, res) => {
  try {

    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid exam ID.",
      });
    }

    const {
      title,
      subject,
      date,
      time,
      location,
      status,
      notes,
    } = req.body;

    const validationError = validateExam({
      title,
      subject,
      date,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const exam = await Exam.findOne({
      _id: id,
      user: req.user,
    });

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found.",
      });
    }

    exam.title = title.trim();

    exam.subject = subject.trim();

    exam.date = date;

    exam.time = time || "00:00";

    exam.location =
      location?.trim() || "";

    exam.status =
      validStatuses.includes(status)
        ? status
        : "Not Started";

    exam.notes =
      notes?.trim() || "";

    await exam.save();

    res.json({
      message: "Exam updated successfully.",
      exam,
    });

  } catch (error) {

    console.error("Update exam error:", error);

    res.status(500).json({
      message: "Unable to update exam.",
    });
  }
};


// ===============================
// DELETE EXAM
// ===============================

const deleteExam = async (req, res) => {
  try {

    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid exam ID.",
      });
    }

    const exam =
      await Exam.findOneAndDelete({
        _id: id,
        user: req.user,
      });

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found.",
      });
    }

    res.json({
      message: "Exam deleted successfully.",
    });

  } catch (error) {

    console.error("Delete exam error:", error);

    res.status(500).json({
      message: "Unable to delete exam.",
    });
  }
};


// ===============================
// UPDATE STATUS
// ===============================

const updateExamStatus = async (req, res) => {
  try {

    const { id } = req.params;

    const { status } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid exam ID.",
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid exam status.",
      });
    }

    const exam =
      await Exam.findOneAndUpdate(
        {
          _id: id,
          user: req.user,
        },

        {
          status,
        },

        {
          new: true,
          runValidators: true,
        }
      );

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found.",
      });
    }

    res.json({
      message: "Exam status updated successfully.",
      exam,
    });

  } catch (error) {

    console.error(
      "Update exam status error:",
      error
    );

    res.status(500).json({
      message: "Unable to update exam status.",
    });
  }
};


module.exports = {
  getExams,
  createExam,
  updateExam,
  deleteExam,
  updateExamStatus,
};