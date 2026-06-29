const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

console.log("authRoutes loaded");
console.log("registerUser type:", typeof registerUser);
console.log("loginUser type:", typeof loginUser);

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
