const express = require("express");
const { sendMessage } = require("../config/socketio");
const router = express.Router();

router.get("/", (req, res) => {
  sendMessage("dit is weer een test bericht");
  res.send("test");
});

module.exports = router;
