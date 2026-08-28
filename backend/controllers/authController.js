const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create JWT token
const createToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Only return safe user information to frontend
const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profileImage: user.profileImage || ""
});


// =============================
// REGISTER
// =============================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      return res.status(400).json({
        message: "Name cannot be empty"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    // Check whether email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in MongoDB
    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword
    });

    // Create JWT
    const token = createToken(user._id);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: userResponse(user)
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// =============================
// LOGIN
// =============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user in MongoDB
    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT
    const token = createToken(user._id);

    return res.json({
      message: "Login successful",
      token,
      user: userResponse(user)
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// =============================
// GET LOGGED-IN USER PROFILE
// =============================
const getProfile = async (req, res) => {
  try {
    // req.user comes from the verified JWT
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.json({
      user: userResponse(user)
    });

  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!trimmedName || !normalizedEmail) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    if (password && password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailOwner = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user }
    });

    if (emailOwner) {
      return res.status(400).json({ message: "That email is already in use" });
    }

    const updates = {
      name: trimmedName,
      email: normalizedEmail,
      profileImage: typeof profileImage === "string" ? profileImage : ""
    };

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.user,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile updated successfully",
      user: userResponse(user)
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
};