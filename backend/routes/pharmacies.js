// routes/pharmacies.js
import express from "express";
import Pharmacy from "../models/Pharmacy.js";

const router = express.Router();

// POST /api/pharmacies - Create a pharmacy record (for admin or seed use)
router.post("/", async (req, res) => {
  try {
    const { name, city, state, address, contactNumber, rating, availableMedicines } = req.body;
    const pharmacy = new Pharmacy({
      name,
      city,
      state,
      address,
      contactNumber,
      rating: rating || 0,
      availableMedicines: availableMedicines || []
    });
    await pharmacy.save();
    res.status(201).json(pharmacy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/pharmacies/search - Search pharmacies
router.get("/search", async (req, res) => {
  try {
    const { q, city, medicine } = req.query;
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

    if (medicine) {
      filter["availableMedicines.name"] = new RegExp(medicine, "i");
    }

    const pharmacies = await Pharmacy.find(filter)
      .sort({ rating: -1 })
      .limit(50);

    res.status(200).json(pharmacies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/pharmacies - Get all pharmacies (with pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pharmacies = await Pharmacy.find()
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1 });

    const total = await Pharmacy.countDocuments();

    res.status(200).json({
      pharmacies,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: pharmacies.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/pharmacies/:id - Get pharmacy details
router.get("/:id", async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    res.status(200).json(pharmacy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/pharmacies/medicine/:name - Search pharmacies by medicine name
router.get("/medicine/:name", async (req, res) => {
  try {
    const medicineName = req.params.name;

    const pharmacies = await Pharmacy.find({
      "availableMedicines.name": new RegExp(medicineName, "i"),
      "availableMedicines.inStock": true
    });

    res.status(200).json(pharmacies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
