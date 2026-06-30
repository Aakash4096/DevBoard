const Project = require("../models/Project");
const Organization = require("../models/Organization");
const ApiError = require("../utils/ApiError");

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { orgId } = req.params;

    if (!name) {
      throw new ApiError(400, "Project name is required");
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      throw new ApiError(404, "Organization not found");
    }

    const isMember = org.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );
    if (!isMember && org.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized");
    }

    const project = await Project.create({
      name,
      description,
      organization: orgId,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const { orgId } = req.params;

    const projects = await Project.find({ organization: orgId });

    res
      .status(200)
      .json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    if (project.organization.toString() !== req.params.orgId) {
      throw new ApiError(404, "Project not found in this organization");
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProject, getProjects, getProjectById };
