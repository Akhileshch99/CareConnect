import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 30 }, // in minutes
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
  paymentMethod: { type: String, enum: ["online", "cash"], default: "online" },
  consultationFee: { type: Number, required: true },
  reason: { type: String, default: "" },
  notes: { type: String, default: "" },
  videoRoomId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Appointment", appointmentSchema);