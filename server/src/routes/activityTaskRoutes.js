const express = require("express");
const router = express.Router({ mergeParams: true });
const Activity = require("../models/Activity");
const protect = require("../middleware/auth");

router.use(protect);
router.get("/", async (req, res, next) => {
  try {
    const activities = await Activity.find({ task: req.params.taskId })
      .populate("user", "name email")
      .sort("-createdAt");
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
