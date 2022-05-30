const express = require("express");
const { sendMessage } = require("../config/socketio");
const router = express.Router();

router.get("/", (req, res) => {
  sendMessage("dit is weer een test bericht");
  res.send("test");
});

router.post("/", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
