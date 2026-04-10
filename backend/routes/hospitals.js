// routes/hospitals.js
import express from "express";
import Hospital from "../models/Hospital.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/hospitals - Create a hospital record (for admin or seed use)
router.post("/", async (req, res) => {
  try {
    const { name, city, state, address, departments, rating, totalBeds, availableBeds, isEmergency, contactNumber, location } = req.body;
    const hospital = new Hospital({
      name,
      city,
      state,
      address,
      departments,
      rating: rating || 0,
      totalBeds: totalBeds || 0,
      availableBeds: availableBeds || 0,
      isEmergency: isEmergency || false,
      contactNumber,
      location
    });
    await hospital.save();
    res.status(201).json(hospital);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/hospitals/search - Search hospitals
router.get("/search", async (req, res) => {
  try {
    const { q, city, department } = req.query;
    let filter = {};

    if (q) {
      filter.$or = [
        { name: new RegExp(q, "i") },
        { city: new RegExp(q, "i") }
      ];
    }

    if (city) {
      filter.city = new RegExp(city, "i");
    }

    if (department) {
      filter.departments = { $in: [new RegExp(department, "i")] };
    }

    const hospitals = await Hospital.find(filter)
      .sort({ rating: -1 })
      .limit(50);

    res.status(200).json(hospitals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/hospitals - Get all hospitals (with pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const hospitals = await Hospital.find()
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1 });

    const total = await Hospital.countDocuments();

    res.status(200).json({
      hospitals,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: hospitals.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/hospitals/:id - Get hospital details
router.get("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json(hospital);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/hospitals/nearby/location - Find nearby hospitals
router.get("/nearby/location", async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude required" });
    }

    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    });

    res.status(200).json(hospitals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
