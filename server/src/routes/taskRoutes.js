const express = require("express");
const router = express.Router({ mergeParams: true });
const Activity = require("../models/Activity");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const protect = require("../middleware/auth");

router.use(protect);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id/activity", protect, async (req, res, next) => {
  try {
    const activities = await Activity.find({ task: req.params.id })
      .populate("user", "name email")
      .sort("-createdAt");
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
});
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
