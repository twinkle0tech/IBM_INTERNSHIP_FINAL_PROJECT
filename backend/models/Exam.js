const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      default: "00:00",
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Ready"],
      default: "Not Started",
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam", examSchema);