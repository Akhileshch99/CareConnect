import mongoose from "mongoose";

const healthBlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true, enum: ["Nutrition", "Exercise", "Mental Health", "Preventive Care", "Disease Management", "Wellness"] },
  author: { type: String, default: "CareConnect Team" },
  image: { type: String, default: null },
  readTime: { type: Number, default: 5 },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("HealthBlog", healthBlogSchema);
