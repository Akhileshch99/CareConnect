// routes/doctor.js
import express from "express";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import { verifyToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/doctors/search - Search doctors by specialty, city, name
router.get("/search", async (req, res) => {
  try {
    const { q, specialization, city, minFees, maxFees, includeUnverified, limit } = req.query;
    let matchConditions = {};
    if (!includeUnverified || includeUnverified === "false") {
      matchConditions.isVerified = true;
    }

    if (specialization) {
      matchConditions.specialization = new RegExp(specialization, "i");
    }

    if (minFees || maxFees) {
      matchConditions.consultationFees = {};
      if (minFees) matchConditions.consultationFees.$gte = parseInt(minFees);
      if (maxFees) matchConditions.consultationFees.$lte = parseInt(maxFees);
    }

    let pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $match: matchConditions
      }
    ];

    // Add search conditions
    if (q) {
      pipeline.push({
        $match: {
          $or: [
            { 'user.name': new RegExp(q, "i") },
            { specialization: new RegExp(q, "i") }
          ]
        }
      });
    }

    if (city) {
      pipeline.push({
        $match: {
          'user.city': new RegExp(city, "i")
        }
      });
    }

    pipeline.push(
      {
        $sort: { rating: -1 }
      }
    );

    if (limit) {
      pipeline.push({ $limit: parseInt(limit) });
    }

    pipeline.push(
      {
        $project: {
          _id: 1,
          specialization: 1,
          experienceYears: 1,
          qualifications: 1,
          hospital: 1,
          consultationFees: 1,
          bio: 1,
          languages: 1,
          rating: 1,
          totalReviews: 1,
          availability: 1,
          isVerified: 1,
          user: {
            name: 1,
            email: 1,
            phone: 1,
            city: 1,
            profileImage: 1
          }
        }
      }
    );

    const doctors = await Doctor.aggregate(pipeline);

    res.status(200).json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/doctors/:id - Get doctor details
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', '-password');

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/doctors - Get all doctors (with pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const doctors = await Doctor.find({ isVerified: true })
      .populate('userId', 'name email phone city profileImage')
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1 });

    const total = await Doctor.countDocuments({ isVerified: true });

    res.status(200).json({
      doctors,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: doctors.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/doctors/profile - Update doctor profile (requires auth)
router.put("/profile", verifyToken, authorizeRole("doctor"), async (req, res) => {
  try {
    const { specialization, experienceYears, qualifications, hospital, consultationFees, bio, languages } = req.body;

    const doctor = await Doctor.findOne({ userId: req.userId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    doctor.specialization = specialization || doctor.specialization;
    doctor.experienceYears = experienceYears || doctor.experienceYears;
    doctor.qualifications = qualifications || doctor.qualifications;
    doctor.hospital = hospital || doctor.hospital;
    doctor.consultationFees = consultationFees || doctor.consultationFees;
    doctor.bio = bio || doctor.bio;
    doctor.languages = languages || doctor.languages;
    doctor.updatedAt = Date.now();

    await doctor.save();

    res.status(200).json({
      message: "Doctor profile updated successfully",
      doctor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/doctors/my/profile - Get logged-in doctor's profile
router.get("/my/profile", verifyToken, authorizeRole("doctor"), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId })
      .populate('userId', '-password');

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.status(200).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/doctors/availability - Set doctor availability
router.put("/availability", verifyToken, authorizeRole("doctor"), async (req, res) => {
  try {
    const { availability } = req.body;

    const doctor = await Doctor.findOne({ userId: req.userId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    doctor.availability = availability;
    doctor.updatedAt = Date.now();
    await doctor.save();

    res.status(200).json({
      message: "Availability updated successfully",
      doctor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;