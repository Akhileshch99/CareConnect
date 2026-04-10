// routes/emergency.js
import express from "express";
import EmergencyService from "../models/EmergencyService.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/emergency - Create an emergency service (for admin or seed use)
router.post("/", async (req, res) => {
  try {
    const { name, type, city, contactNumber, isPrimary, responseTime, isAvailable } = req.body;
    const service = new EmergencyService({
      name,
      type,
      city,
      contactNumber,
      isPrimary: isPrimary || false,
      responseTime: responseTime || 0,
      isAvailable: isAvailable !== undefined ? isAvailable : true
    });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/emergency/search - Search emergency services
router.get("/search", async (req, res) => {
  try {
    const { q, city, type } = req.query;
    let filter = { isAvailable: true };

    if (q) {
      filter.$or = [
        { name: new RegExp(q, "i") },
        { city: new RegExp(q, "i") }
      ];
    }

    if (city) {
      filter.city = new RegExp(city, "i");
    }

    if (type) {
      filter.type = type;
    }

    const services = await EmergencyService.find(filter)
      .sort({ isPrimary: -1 });

    res.status(200).json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/emergency - Get all emergency services
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const services = await EmergencyService.find()
      .skip(skip)
      .limit(limit)
      .sort({ isPrimary: -1 });

    const total = await EmergencyService.countDocuments();

    res.status(200).json({
      services,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: services.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/emergency/:id - Get emergency service details
router.get("/:id", async (req, res) => {
  try {
    const service = await EmergencyService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/emergency/type/:type - Get all services by type
router.get("/type/:type", async (req, res) => {
  try {
    const services = await EmergencyService.find({
      type: req.params.type,
      isAvailable: true
    }).sort({ isPrimary: -1 });

    res.status(200).json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
