const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { refreshAll } = require("../config/socketio");

const registerUser = asyncHandler(async (req, res) => {
  const { leerlingnummer, password, group, group2, tto } = req.body;

  if (!leerlingnummer || !password || !group || !group2) {
    throw new Error("Please add all fields");
  }

  const userExists = await User.findOne({ leerlingnummer });

  // Check if user exists
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    leerlingnummer,
    group,
    tto,
    password: hashedPassword,
  });

  if (user) {
    const group = await Group.findOne({ groupNumber: user.group });

    const dbGroup2 = await Group.findOne({ groupNumber: group2 });

    if (!group) {
      await Group.create({
        groupNumber: user.group,
        members: [user.leerlingnummer],
      });
    } else {
      await Group.updateOne(
        { groupNumber: user.group },
        { $push: { members: user.leerlingnummer } }
      );
    }

    if (!dbGroup2) {
      await Group.create({
        groupNumber: group2,
        members: [user.leerlingnummer],
      });
    } else {
      await Group.updateOne(
        { groupNumber: group2 },
        { $push: { members: user.leerlingnummer } }
      );
    }

    res.status(201).json({
      _id: user.id,
      leerlingnummer: user.leerlingnummer,
      group: user.group,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { leerlingnummer, password } = req.body;

  if (leerlingnummer.trim() === "" || password.trim() === "") {
    res.status(400);
    throw new Error("Vul aub alle velden in");
  }

  if (isNaN(leerlingnummer)) {
    res.status(400);
    throw new Error("Leerlingnummer is geen getal");
  }

  const user = await User.findOne({ leerlingnummer });

  if (user && password && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      leerlingnummer: user.leerlingnummer,
      group: user.group,
      tto: user.tto,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Inloggegevens komen niet overeen");
  }
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const getGroup = asyncHandler(async (req, res) => {
  const group = await Group.findOne({ groupNumber: req.user.group });

  res.status(200).json(group);
});

const changeGroups = asyncHandler(async (req, res) => {
  if (!req.body.password || req.body.password !== "wiskundespel123") {
    res.status(401);
    throw new Error("Wrong password");
  }

  const groups = await Group.find({ groupNumber: { $gte: 299 } });

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];

    const users = await User.find({ leerlingnummer: { $in: group.members } });

    for (let j = 0; j < users.length; j++) {
      const user = users[j];

      await User.updateOne(
        { _id: user._id },
        { $set: { group: group.groupNumber } }
      );
    }
  }
  refreshAll();
  res.status(200).json({ message: "Groepjes veranderd" });
});

const secret = asyncHandler(async (req, res) => {
  const groups = await Group.find();

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];

    const number = group.groupNumber + 100;

    await Group.create({
      groupNumber: number,
      members: group.members,
    });
  }

  res.status(200).json({ message: "OK" });
});

const getGroups = asyncHandler(async (req, res) => {
  if (!req.body.password || req.body.password !== "wiskundespel123") {
    res.status(401);
    throw new Error("Wrong password");
  }

  const groups = await Group.find();

  let groupObject = {};

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    groupObject[group.groupNumber] = group;
  }

  res.status(200).json(groupObject);
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getGroup,
  changeGroups,
  secret,
  getGroups,
};
