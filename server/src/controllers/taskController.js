const Task = require("../models/Task");
const Project = require("../models/Project");
const Organization = require("../models/Organization");
const ApiError = require("../utils/ApiError");
const Activity = require("../models/Activity");

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, assignedTo } = req.body;
    const { projectId } = req.params;

    if (!title) throw new ApiError(400, "Task title is required");

    const project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignedTo,
      project: projectId,
      createdBy: req.user._id,
    });
    await Activity.create({
      task: task._id,
      user: req.user._id,
      action: "created",
      details: `Task "${task.title}" created`,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, priority } = req.query;

    const filter = { project: projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort("-createdAt");

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name");

    if (!task) throw new ApiError(404, "Task not found");

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, assignedTo } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) throw new ApiError(404, "Task not found");

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await task.save();
    await Activity.create({
      task: task._id,
      user: req.user._id,
      action: "updated",
      details: `Task updated`,
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) throw new ApiError(404, "Task not found");
    await Activity.create({
      task: task._id,
      user: req.user._id,
      action: "deleted",
      details: `Task "${task.title}" deleted`,
    });
    await task.deleteOne();

    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
