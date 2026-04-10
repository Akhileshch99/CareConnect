import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  alternatePhone: { type: String, default: "" },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  departments: [{ type: String }], // e.g. ["Cardiology", "Neurology"]
  beds: { type: Number, default: 0 },
  availableBeds: { type: Number, default: 0 },
  emergencyServices: { type: Boolean, default: false },
  ambulanceServices: { type: Boolean, default: false },
  icuBeds: { type: Number, default: 0 },
  website: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  openTime: { type: String, default: "24/7" },
  isOpen: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Hospital", hospitalSchema);
