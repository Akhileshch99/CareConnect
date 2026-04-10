// routes/prescription.js
import express from "express";
import Prescription from "../models/Prescription.js";
import Appointment from "../models/Appointment.js";
import { verifyToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// POST /api/prescription - Upload prescription (doctor only)
router.post("/", verifyToken, authorizeRole("doctor"), async (req, res) => {
  try {
    const { appointmentId, medicines, advice, testRecommendations, followUpDate } = req.body;

    // Verify appointment exists and belongs to this doctor
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const prescription = new Prescription({
      appointmentId,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      medicines,
      advice,
      testRecommendations: testRecommendations || [],
      followUpDate: followUpDate || null
    });

    await prescription.save();

    res.status(201).json({
      message: "Prescription uploaded successfully",
      prescription
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload prescription", error: err.message });
  }
});

// GET /api/prescription/:appointmentId - Get prescription by appointment
router.get("/:appointmentId", verifyToken, async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      appointmentId: req.params.appointmentId
    }).populate("doctorId", "specialization hospital").populate("patientId", "name email");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json(prescription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch prescription" });
  }
});

// GET /api/prescription/patient/:patientId - Get all prescriptions for patient
router.get("/patient/:patientId", verifyToken, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.params.patientId
    }).populate("doctorId", "specialization hospital").sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch prescriptions" });
  }
});

// PUT /api/prescription/:id - Update prescription (doctor only)
router.put("/:id", verifyToken, authorizeRole("doctor"), async (req, res) => {
  try {
    const { medicines, advice, testRecommendations, followUpDate } = req.body;

    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      {
        medicines,
        advice,
        testRecommendations,
        followUpDate,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({
      message: "Prescription updated successfully",
      prescription
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update prescription" });
  }
});

// DELETE /api/prescription/:id - Delete prescription (doctor only)
router.delete("/:id", verifyToken, authorizeRole("doctor"), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({
      message: "Prescription deleted successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete prescription" });
  }
});

export default router;
