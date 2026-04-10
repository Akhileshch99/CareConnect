import express from "express";
import HealthBlog from "../models/HealthBlog.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get all health blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await HealthBlog.find({ isPublished: true })
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await HealthBlog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    await HealthBlog.findByIdAndUpdate(req.params.id, { views: blog.views + 1 });
    res.status(200).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create health blog (Admin only)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, content, category, author, image, readTime, tags } = req.body;

    const newBlog = new HealthBlog({
      title,
      description,
      content,
      category,
      author: author || "CareConnect Team",
      image,
      readTime: readTime || 5,
      tags: tags || []
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Like a blog
router.post("/:id/like", async (req, res) => {
  try {
    const blog = await HealthBlog.findByIdAndUpdate(
      req.params.id,
      { likes: (await HealthBlog.findById(req.params.id)).likes + 1 },
      { new: true }
    );
    res.status(200).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get blogs by category
router.get("/category/:category", async (req, res) => {
  try {
    const blogs = await HealthBlog.find({ category: req.params.category, isPublished: true })
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
