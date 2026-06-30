const express = require("express");
const router = express.Router();
const {
  createOrg,
  getMyOrgs,
  getOrgById,
} = require("../controllers/orgController");
const protect = require("../middleware/auth");

// All routes require login
router.use(protect);

// POST /api/orgs - Create organization
router.post("/", createOrg);

// GET /api/orgs - Get all my organizations
router.get("/", getMyOrgs);

// GET /api/orgs/:id - Get single organization
router.get("/:id", getOrgById);

module.exports = router;
