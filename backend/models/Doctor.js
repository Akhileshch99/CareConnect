import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  specialization: { type: String, required: true },
  experienceYears: { type: Number, required: true },
  qualifications: [{ type: String }],
  licenseNumber: { type: String, required: true, unique: true },
  hospital: { type: String, default: "" },
  consultationFees: { type: Number, required: true },
  bio: { type: String, default: "" },
  languages: [{ type: String }],
  availability: [{
    day: { type: String },
    startTime: { type: String },
    endTime: { type: String }
  }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  verificationDocument: { type: String, default: null },
  bankDetails: {
    accountHolder: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String }
  },
  earnings: { type: Number, default: 0 },
  totalAppointments: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Doctor", doctorSchema);