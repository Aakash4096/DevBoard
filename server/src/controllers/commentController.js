const Comment = require("../models/Comment");
const Task = require("../models/Task");
const Activity = require("../models/Activity");
const ApiError = require("../utils/ApiError");

const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { taskId } = req.params;

    if (!content) throw new ApiError(400, "Comment content is required");

    const task = await Task.findById(taskId);
    if (!task) throw new ApiError(404, "Task not found");

    const comment = await Comment.create({
      content,
      task: taskId,
      author: req.user._id,
    });

    await Activity.create({
      task: taskId,
      user: req.user._id,
      action: "commented",
      details: "Comment added",
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({ task: taskId })
      .populate("author", "name email")
      .sort("-createdAt");

    res
      .status(200)
      .json({ success: true, count: comments.length, data: comments });
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getComments };
