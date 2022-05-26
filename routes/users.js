const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  getGroup,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/me", protect, getMe);
router.get("/group", protect, getGroup);

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
