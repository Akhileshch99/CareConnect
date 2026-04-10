// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secretKey";

// Register
router.post("/register", async (req, res) => {
  try {
    const { role, name, email, password, confirmPassword, phone } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      role,
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      isActive: true
    });
    await newUser.save();

    // If registering as doctor, create doctor profile (verified by default for onboarding)
    if (role === "doctor") {
      const doctorProfile = new Doctor({
        userId: newUser._id,
        specialization: "General Medicine",
        experienceYears: 1,
        qualifications: [],
        licenseNumber: "TEMP-" + Date.now(),
        hospital: "",
        consultationFees: 300,
        bio: "New doctor profile. Please update your details.",
        languages: ["English"],
        isVerified: true // allow immediate visibility
      });
      await doctorProfile.save();
    }

    // Generate token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      role: newUser.role.toLowerCase(),
      userId: newUser._id,
      message: "Registration successful"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password with hashed password
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token + role back
    res.status(200).json({
      token,
      role: user.role.toLowerCase(),
      userId: user._id,
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let additionalData = {};
    if (user.role === "doctor") {
      additionalData = await Doctor.findOne({ userId: req.userId });
    }

    res.status(200).json({
      user,
      doctorProfile: additionalData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, phone, address, city, state, zipCode, dateOfBirth, gender, profileImage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        name,
        phone,
        address,
        city,
        state,
        zipCode,
        dateOfBirth,
        gender,
        profileImage,
        updatedAt: Date.now()
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;