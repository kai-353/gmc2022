const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  answers: {
    type: [String],
    required: true,
  },
  required: {
    type: String,
    default: "start",
  },
  maxpoints: {
    type: Number,
    required: true,
  },
  imgurls: {
    type: [String],
    required: true,
  },
  tto: {
    type: Boolean,
    required: true,
  },
  dateStart: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
});

const Lesson = mongoose.model("Lesson", LessonSchema);

module.exports = Lesson;
