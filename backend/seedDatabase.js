import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Doctor from "./models/Doctor.js";
import HealthBlog from "./models/HealthBlog.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await HealthBlog.deleteMany({});
    console.log("✓ Cleared existing data");

    // Create demo users
    const hashedPassword = await bcryptjs.hash("password123", 10);

    const patientUser = await User.create({
      role: "patient",
      name: "Raj Kumar",
      email: "patient@example.com",
      password: hashedPassword,
      phone: "9876543210",
      address: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      gender: "Male",
      isActive: true
    });

    const doctorUser = await User.create({
      role: "doctor",
      name: "Dr. Raj Sharma",
      email: "doctor@example.com",
      password: hashedPassword,
      phone: "9123456789",
      address: "Medical Plaza",
      city: "Mumbai",
      state: "Maharashtra",
      gender: "Male",
      isActive: true
    });

    console.log("✓ Created demo users");

    // Create doctor profile
    await Doctor.create({
      userId: doctorUser._id,
      specialization: "Cardiologist",
      experienceYears: 10,
      qualifications: ["MBBS", "MD (Cardiology)"],
      licenseNumber: "MED-2024-001",
      hospital: "Apollo Hospital",
      consultationFees: 500,
      bio: "Experienced cardiologist with 10 years of practice",
      languages: ["English", "Hindi"],
      availability: [
        { day: "Monday", startTime: "10:00", endTime: "18:00" },
        { day: "Tuesday", startTime: "10:00", endTime: "18:00" },
        { day: "Wednesday", startTime: "10:00", endTime: "18:00" },
      ],
      rating: 4.9,
      totalReviews: 150,
      isVerified: true
    });

    console.log("✓ Created doctor profile");

    // Create health blogs
    const blogs = [
      {
        title: "10 Heart Health Tips You Should Know",
        description: "Learn the essential tips to keep your heart healthy and reduce risks of cardiovascular diseases.",
        content: "Heart health is crucial for overall well-being. Regular exercise, healthy diet, and stress management are key factors...",
        category: "Preventive Care",
        readTime: 5,
        tags: ["heart", "health", "cardio"]
      },
      {
        title: "Natural Remedies for Better Sleep",
        description: "Discover proven natural methods to improve your sleep quality without medications.",
        content: "Sleep is essential for recovery. Try meditation, herbal tea, and proper sleep hygiene...",
        category: "Wellness",
        readTime: 6,
        tags: ["sleep", "wellness", "natural"]
      },
      {
        title: "Nutrition Guide for Healthy Skin",
        description: "Find out which foods can help you achieve healthy, glowing skin naturally.",
        content: "Your skin reflects your diet. Include antioxidants, omega-3s, and vitamins...",
        category: "Nutrition",
        readTime: 7,
        tags: ["skincare", "nutrition", "diet"]
      },
      {
        title: "Effective Home Exercises for Fitness",
        description: "No gym required! Try these simple exercises you can do at home.",
        content: "Home workouts are effective and convenient. Start with basic exercises and progress...",
        category: "Exercise",
        readTime: 8,
        tags: ["exercise", "fitness", "home"]
      },
      {
        title: "Managing Stress Through Meditation",
        description: "Learn meditation techniques to reduce stress and improve mental health.",
        content: "Meditation is scientifically proven to reduce stress and anxiety...",
        category: "Mental Health",
        readTime: 6,
        tags: ["meditation", "stress", "mental-health"]
      },
      {
        title: "Diabetes Prevention & Management",
        description: "Practical steps to prevent diabetes and manage it effectively.",
        content: "Diabetes is preventable with lifestyle changes. Monitor blood sugar, exercise regularly...",
        category: "Disease Management",
        readTime: 9,
        tags: ["diabetes", "prevention", "health"]
      }
    ];

    await HealthBlog.insertMany(blogs);
    console.log("✓ Created health blogs");

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📝 Demo Credentials:");
    console.log("Patient - Email: patient@example.com | Password: password123");
    console.log("Doctor - Email: doctor@example.com | Password: password123");

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
