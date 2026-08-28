const express = require("express");

const protect =
  require("../middleware/authMiddleware");

const {
  getExams,
  createExam,
  updateExam,
  deleteExam,
  updateExamStatus,
} = require("../controllers/examController");

const router = express.Router();

router.use(protect);

router.get("/", getExams);

router.post("/", createExam);

router.put("/:id", updateExam);

router.delete("/:id", deleteExam);

router.patch(
  "/:id/status",
  updateExamStatus
);

module.exports = router;