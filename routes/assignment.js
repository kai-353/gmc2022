const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  getAll,
  getAssignment,
  create,
  submit,
  getResults,
} = require("../controllers/assignmentController");

router.get("/all", protect, getAll);
router.get("/results", getResults);
router.get("/:id", protect, getAssignment);

router.post("/create", create);
// router.post("/secret", secret);
router.post("/submit/:id", protect, submit);

module.exports = router;
