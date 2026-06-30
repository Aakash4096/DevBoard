const Organization = require("../models/Organization");
const ApiError = require("../utils/ApiError");

const createOrg = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      throw new ApiError(400, "Organization name is required");
    }

    const org = await Organization.create({
      name,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "admin" }],
    });

    res.status(201).json({ success: true, data: org });
  } catch (error) {
    next(error);
  }
};

const getMyOrgs = async (req, res, next) => {
  try {
    const orgs = await Organization.find({
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    });

    res.status(200).json({ success: true, count: orgs.length, data: orgs });
  } catch (error) {
    next(error);
  }
};

const getOrgById = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.id);

    if (!org) {
      throw new ApiError(404, "Organization not found");
    }

    const isMember = org.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );
    const isOwner = org.owner.toString() === req.user._id.toString();

    if (!isMember && !isOwner) {
      throw new ApiError(403, "Not authorized to access this organization");
    }

    res.status(200).json({ success: true, data: org });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrg, getMyOrgs, getOrgById };
