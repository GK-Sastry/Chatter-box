const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.route("/").get(protect, allUsers); // Get all users (protected route)
router.route("/").post(registerUser); // Register user or handle Google registration
router.post("/login", authUser); // Login user or handle Google login

module.exports = router;
