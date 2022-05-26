const asyncHandler = require("express-async-handler");
const Lesson = require("../models/lessonModel");
const mongoose = require("mongoose");
const Group = require("../models/groupModel");

const getAll = asyncHandler(async (req, res) => {
  const group = await Group.findOne({ groupNumber: req.user.group });

  const assignments = await Lesson.find()
    .where("required")
    .in(group.completedAssignments)
    .where("title")
    .nin(group.completedAssignments)
    .where("dateStart")
    .lte(Date.now())
    .where("dateEnd")
    .gte(Date.now());

  res.json(assignments);
});

const getAssignment = asyncHandler(async (req, res) => {
  const group = await Group.findOne({ groupNumber: req.user.group });

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("ID not valid");
  }

  const assignment = await Lesson.findById(req.params.id);

  if (!assignment) {
    res.status(400);
    throw new Error("Assignment doesn't exist");
  }

  const unixStart = new Date(assignment.dateStart).getTime();
  const unixEnd = new Date(assignment.dateEnd).getTime();

  if (
    unixStart <= Date.now() &&
    unixEnd >= Date.now() &&
    group.completedAssignments.includes(assignment.required) &&
    !group.completedAssignments.includes(assignment.title)
  ) {
    res.status(200).json(assignment);
  } else {
    res.status(400);
    throw new Error("You don't have access to this assignment");
  }
});

const create = asyncHandler(async (req, res) => {
  const { title, required, maxpoints, dateStart, dateEnd, pass } = req.body;

  if (pass !== "wiskundespel") {
    res.status(400);
    throw new Error("Password not valid");
  }

  const assignment = await Lesson.create({
    title,
    answers: [],
    required,
    maxpoints,
    imgurls: [],
    dateStart,
    dateEnd,
  });

  if (assignment) {
    res.status(201).json(assignment);
  } else {
    res.status(400);
    throw new Error("Invalid assignment data");
  }
});

module.exports = {
  getAll,
  getAssignment,
  create,
};
