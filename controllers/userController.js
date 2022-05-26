const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
  const { leerlingnummer, password, group } = req.body;

  if (!leerlingnummer || !password || !group) {
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
    password: hashedPassword,
  });

  if (user) {
    const group = await Group.findOne({ groupNumber: user.group });

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

  const user = await User.findOne({ leerlingnummer });

  if (user && password && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      leerlingnummer: user.leerlingnummer,
      token: generateToken(user._id),
    });
  }
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const getGroup = asyncHandler(async (req, res) => {
  const group = await Group.findOne({ groupNumber: req.user.group });

  res.status(200).json(group);
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
};
