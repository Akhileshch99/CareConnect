import express from "express";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import { verifyToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// Book appointment
router.post("/book", verifyToken, authorizeRole("patient"), async (req, res) => {
  try {
    const { doctorId, date, time, reason, paymentMethod } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check for conflicting appointments
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $in: ["confirmed", "completed"] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    const appointment = new Appointment({
      patientId: req.userId,
      doctorId,
      date: new Date(date),
      time,
      reason,
      consultationFee: doctor.consultationFees,
      status: "pending",
      paymentStatus: paymentMethod === "cash" ? "paid" : "unpaid",
      paymentMethod: paymentMethod || "online"
    });

    await appointment.save();
    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to book appointment", error: err.message });
  }
});

// Get appointments for a patient
router.get("/patient/:id", async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.id })
      .populate("doctorId")
      .populate("patientId", "name email phone")
      .sort({ date: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch patient appointments" });
  }
});

// Get my appointments
router.get("/my/appointments", verifyToken, async (req, res) => {
  try {
    let query = {};
    if (req.userRole === "patient") {
      query.patientId = req.userId;
    } else if (req.userRole === "doctor") {
      const doctor = await Doctor.findOne({ userId: req.userId });
      query.doctorId = doctor?._id;
    }

    const appointments = await Appointment.find(query)
      .populate("doctorId")
      .populate("patientId", "name email phone profileImage")
      .sort({ date: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// Get appointments for a doctor
router.get("/doctor/:id", async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.id })
      .populate("patientId", "name email phone profileImage")
      .sort({ date: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch doctor appointments" });
  }
});

// Get appointment by ID
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctorId")
      .populate("patientId");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
});

// Update appointment status (accept/reject/complete)
router.put("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate("doctorId").populate("patientId");

    res.status(200).json({
      message: "Appointment status updated",
      appointment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update appointment status" });
  }
});

// Update appointment payment status
router.put("/:id/payment", verifyToken, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      message: "Payment status updated",
      appointment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update payment status" });
  }
});

// Cancel appointment
router.put("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only patient who booked or doctor can cancel
    if (req.userId !== appointment.patientId.toString() && req.userRole !== "doctor") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    appointment.status = "cancelled";
    appointment.updatedAt = Date.now();
    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
});

export default router;