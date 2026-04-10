import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["ambulance", "fire", "police", "hospital"], required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
  alternatePhone: { type: String, default: "" },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  isPrimary: { type: Boolean, default: false },
  responseTime: { type: Number, default: 0 }, // in minutes
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("EmergencyService", emergencySchema);