const express = require("express");
const router = express.Router();
const {
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const protect = require("../middleware/auth");

router.use(protect);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
