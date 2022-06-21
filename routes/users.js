const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  getGroup,
  changeGroups,
  secret,
  getGroups,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/me", protect, getMe);
router.get("/group", protect, getGroup);
router.get("/groups", getGroups);
// router.get("/secretRoute", secret);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/changeGroups", changeGroups);

module.exports = router;
