// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import User model
const User = require("./models/User");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ---------------------------
// POST /api/users
// ---------------------------
app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error("POST /api/users error:", err);
    res.status(500).json({ error: "Error saving user" });
  }
});

// ---------------------------
// GET /api/users
// ---------------------------
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 }).lean().exec();
    res.json(users);
  } catch (err) {
    console.error("GET /api/users error:", err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// ---------------------------
// Test route
// ---------------------------
app.get("/", (_req, res) => {
  res.send("API Running 🚀");
});

// ---------------------------
// Connect to MongoDB Atlas
// ---------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.error("MongoDB connection error:", err));

// ---------------------------
// Use Render-assigned port
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));