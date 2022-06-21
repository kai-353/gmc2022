const asyncHandler = require("express-async-handler");
const Lesson = require("../models/lessonModel");
const mongoose = require("mongoose");
const Group = require("../models/groupModel");
const { socketEmit } = require("../config/socketio");

const getAll = asyncHandler(async (req, res) => {
  const group = await Group.findOne({ groupNumber: req.user.group });

  const completedTitles = group.completedAssignments.map(
    (element) => element.title
  );

  const assignments = await Lesson.find()
    .where("required")
    .in(completedTitles)
    .where("title")
    .nin(completedTitles)
    .where("dateStart")
    .lte(Date.now())
    .where("dateEnd")
    .gte(Date.now())
    .where("tto")
    .equals(req.user.tto)
    .sort("title");

  res.json(assignments);
});

const getAssignment = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("ID not valid");
  }

  const group = await Group.findOne({ groupNumber: req.user.group });

  const completedTitles = group.completedAssignments.map(
    (element) => element.title
  );

  const assignment = await Lesson.findOne()
    .where("_id")
    .equals(req.params.id)
    .where("required")
    .in(completedTitles)
    .where("title")
    .nin(completedTitles)
    .where("dateStart")
    .lte(Date.now())
    .where("dateEnd")
    .gte(Date.now())
    .where("tto")
    .equals(req.user.tto);

  if (!assignment) {
    res.status(400);
    throw new Error("Assignment doesn't exist or you don't have access to it");
  }

  const idTriesMap = group.tries.map((element) => element.id);

  if (!idTriesMap.includes(assignment._id.toString())) {
    await Group.updateOne(
      { _id: group._id },
      { $push: { tries: { id: assignment._id.toString(), wrong_tries: 0 } } }
    );
    res.status(200).json({
      title: assignment.title,
      imgurls: assignment.imgurls,
      tries: 5,
    });
    return;
  }
  const tries =
    5 -
    group.tries.filter((element) => element.id === assignment._id.toString())[0]
      .wrong_tries;

  if (tries <= 0) {
    res.status(400);
    throw new Error("You don't have access to this assignment");
  }

  res.status(200).json({
    title: assignment.title,
    imgurls: assignment.imgurls,
    tries,
  });
});

const create = asyncHandler(async (req, res) => {
  const { title, required, maxpoints, tto, dateStart, dateEnd, pass } =
    req.body;

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
    tto,
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

const submit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("ID not valid");
  }

  if (!answer || answer.trim() === "") {
    throw new Error("No answer provided");
  }

  const group = await Group.findOne({ groupNumber: req.user.group });

  const assignment = await Lesson.findById(id);

  if (!assignment) {
    res.status(400);
    throw new Error("Assignment doesn't exist");
  }

  const unixStart = new Date(assignment.dateStart).getTime();
  const unixEnd = new Date(assignment.dateEnd).getTime();

  const completedTitles = new Array();

  var i = 0;

  group.completedAssignments.map((el) => {
    completedTitles[i] = el.title;
    i++;
  });

  const hasAccess =
    unixStart <= Date.now() &&
    unixEnd >= Date.now() &&
    completedTitles.includes(assignment.required) &&
    !completedTitles.includes(assignment.title) &&
    req.user.tto == assignment.tto;

  if (!hasAccess) {
    res.status(400);
    throw new Error("You don't have access to this assignment");
  }

  const triesObject = group.tries.find(
    (element) => element.id === assignment._id.toString()
  );

  if (!triesObject) {
    res.status(400);
    throw new Error("You have not opened this assignment yet");
  }

  if (assignment.answers.includes(answer)) {
    await Group.updateOne(
      { _id: group._id },
      {
        $push: {
          completedAssignments: {
            title: assignment.title,
            id: assignment._id.toString(),
          },
        },
      }
    );
    // WS stuff
    socketEmit(`${group.groupNumber}:${id}`, "home");
    socketEmit(`${group.groupNumber}:dash`, "refresh");

    res.status(200).json({
      correct: true,
    });
  } else {
    await Group.updateOne(
      { _id: group._id, "tries.id": id },
      {
        $inc: { "tries.$.wrong_tries": 1 },
      }
    );

    if (triesObject.wrong_tries === 4) {
      await Group.updateOne(
        { _id: group._id },
        {
          $push: {
            completedAssignments: {
              title: assignment.title,
              id: assignment._id.toString(),
            },
          },
        }
      );
      socketEmit(`${group.groupNumber}:dash`, "refresh");
      socketEmit(`${group.groupNumber}:${id}`, "home");
    } else {
      socketEmit(`${group.groupNumber}:${id}`, "refresh");
    }

    res.status(200).json({
      correct: false,
    });
  }
});

const getResults = asyncHandler(async (req, res) => {
  if (!req.body.password || req.body.password !== "wiskundespel123") {
    res.status(401);
    throw new Error("Wrong password");
  }

  const groups = await Group.find();
  const assignments = await Lesson.find();

  let resultObject = {};

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    let pointObject = {};

    for (let j = 0; j < group.tries.length; j++) {
      const tryObject = group.tries[j];

      const assignment = assignments.find(
        (element) => element._id.toString() === tryObject.id
      );

      let pts = assignment.maxpoints * (5 - tryObject.wrong_tries);
      if (pts !== 0) {
        pointObject[assignment.title] = pts / 5;
      } else {
        pointObject[assignment.title] = 0;
      }
      // console.log(assignment);
    }

    resultObject[group.groupNumber] = pointObject;
  }

  // console.log(groups.map((group) => group.tries));
  // console.log("====================================");
  // console.log(assignments);

  res.status(200).json(resultObject);
});

module.exports = {
  getAll,
  getAssignment,
  create,
  submit,
  getResults,
};
