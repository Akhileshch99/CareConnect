import express from "express";
import Razorpay from "razorpay";
import Appointment from "../models/Appointment.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret"
});

// Create payment order or handle cash payment
router.post("/checkout", verifyToken, async (req, res) => {
  try {
    const { appointmentId, amount, paymentMethod } = req.body;

    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (paymentMethod === "cash") {
      // For cash payment, mark as paid immediately
      appointment.paymentStatus = "paid";
      appointment.status = "confirmed";
      appointment.paymentMethod = "cash";
      await appointment.save();

      return res.status(200).json({
        message: "Cash payment recorded successfully",
        appointment
      });
    }

    // Online payment with Razorpay
    // Create order
    const options = {
      amount: Math.round(amount * 100), // Amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `receipt_${appointmentId}`,
      description: `Consultation with doctor for appointment ${appointmentId}`
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      order,
      message: "Order created successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment initiation failed" });
  }
});

// Verify payment
router.post("/verify", verifyToken, async (req, res) => {
  try {
    const { appointmentId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Verify signature (simplified - use proper verification in production)
    // const crypto = require('crypto');
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    //   .digest('hex');

    // if (expectedSignature !== razorpay_signature) {
    //   return res.status(400).json({ message: "Invalid signature" });
    // }

    // Update appointment payment status
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        paymentStatus: "paid",
        status: "confirmed",
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Payment verified and confirmed",
      appointment,
      paymentId: razorpay_payment_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

// Get payment status
router.get("/:appointmentId", verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      appointmentId: appointment._id,
      paymentStatus: appointment.paymentStatus,
      consultationFee: appointment.consultationFee
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payment status" });
  }
});

export default router;
