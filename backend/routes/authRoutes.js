const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);


// Protected route
// The JWT middleware identifies the logged-in user.
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);


module.exports = router;