const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  getAll,
  getAssignment,
  create,
  submit,
} = require("../controllers/assignmentController");

router.get("/all", protect, getAll);
router.get("/:id", protect, getAssignment);

router.post("/create", protect, create);
router.post("/submit/:id", protect, submit);

module.exports = router;
