import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import doctorRoutes from "./routes/doctor.js";
import appointmentRoutes from "./routes/appointment.js";
import paymentRoutes from "./routes/payment.js";
import emergencyRoutes from "./routes/emergency.js";
import hospitalsRoutes from "./routes/hospitals.js";
import pharmaciesRoutes from "./routes/pharmacies.js";
import prescriptionRoutes from "./routes/prescription.js";
import healthblogsRoutes from "./routes/healthblogs.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();
const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// MongoDB connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      retryWrites: true,
      w: 'majority'
    });
    console.log("✓ MongoDB Connected Successfully");
  } catch (err) {
    console.error("✗ MongoDB Connection Error:", err.message);
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/hospitals", hospitalsRoutes);
app.use("/api/pharmacies", pharmaciesRoutes);
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/healthblogs", healthblogsRoutes);
app.use("/api/contact", contactRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));