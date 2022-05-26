const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  getAll,
  getAssignment,
  create,
} = require("../controllers/assignmentController");

router.get("/all", protect, getAll);
router.get("/:id", protect, getAssignment);

router.post("/create", protect, create);

module.exports = router;
