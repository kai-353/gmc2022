const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  leerlingnummer: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  group: {
    type: Number,
    required: true,
  },
  tto: {
    type: Boolean,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
