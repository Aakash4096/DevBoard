const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createProject,
  getProjects,
  getProjectById,
} = require("../controllers/projectController");
const protect = require("../middleware/auth");

router.use(protect);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);

module.exports = router;
