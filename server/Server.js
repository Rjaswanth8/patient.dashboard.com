// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------- Middleware ----------------------
app.use(cors());
app.use(express.json());

// ---------------------- MongoDB Connection ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

mongoose.connection.once("open", () =>
  console.log("✅ MongoDB connection open")
);

// ---------------------- Schemas & Models ----------------------

// User Schema
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
  })
);

// Appointment Schema
const Appointment = mongoose.model(
  "Appointment",
  new mongoose.Schema({
    name: String,
    age: Number,
    type: String,
    date: String,
    time: String,
    reason: String,
  })
);

// Profile Schema
const Profile = mongoose.model(
  "Profile",
  new mongoose.Schema({
    name: String,
    lastname: String,
    Email: String,
    Phone: String,
    Address1: String,
    Address2: String,
    Country: String,
    State: String,
    City: String,
    Pincode: String,
  })
);

// ---------------------- API ROUTES ----------------------

// Optional API prefix from environment (must start with /)
const API_PREFIX = process.env.API_PREFIX?.startsWith("/")
  ? process.env.API_PREFIX
  : "/api";

// ---------------- User ----------------

// Signup
app.post(`${API_PREFIX}/signup`, async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { fullName, email },
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Signup failed" });
    }
  }
});

// Login
app.post(`${API_PREFIX}/login`, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found. Please sign up." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    res.json({
      message: "Login successful",
      user: { fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Get user details
app.get(`${API_PREFIX}/user`, async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ fullName: user.fullName, email: user.email });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ---------------- Appointments ----------------

// Get all appointments
app.get(`${API_PREFIX}/appointments`, async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// Add new appointment
app.post(`${API_PREFIX}/appointments`, async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: "Failed to save appointment" });
  }
});

// Delete appointment by ID
app.delete(`${API_PREFIX}/appointments/:id`, async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Appointment not found" });
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

// ---------------- Profile ----------------

// Get latest profile
app.get(`${API_PREFIX}/profile`, async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ _id: -1 }).limit(1);
    if (profiles.length === 0)
      return res.status(404).json({ error: "No profile found" });
    res.json(profiles[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Add or update profile
app.post(`${API_PREFIX}/profile`, async (req, res) => {
  try {
    const existing = await Profile.find().sort({ _id: -1 }).limit(1);
    let result;

    if (existing.length > 0) {
      result = await Profile.findByIdAndUpdate(existing[0]._id, req.body, {
        new: true,
      });
    } else {
      result = await new Profile(req.body).save();
    }

    res.status(200).json({ message: "Profile saved", profile: result });
  } catch (err) {
    res.status(500).json({ error: "Failed to save profile" });
  }
});

// ---------------- Serve React build ----------------
app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

// ---------------- Start Server ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
