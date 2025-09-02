// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------- Middleware ----------------------
app.use(cors());
app.use(express.json());

// ---------------------- MongoDB Connection ----------------------
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // exit if DB cannot connect
  }
};

connectMongo();

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

// --------- User Routes ---------

app.post("/api/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();
    res
      .status(201)
      .json({
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

app.post("/api/login", async (req, res) => {
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

app.get("/api/user", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ fullName: user.fullName, email: user.email });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// --------- Appointment Routes ---------

app.get("/api/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

app.post("/api/appointments", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: "Failed to save appointment" });
  }
});

app.delete("/api/appointments/:id", async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Appointment not found" });
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

// --------- Profile Routes ---------

app.get("/api/profile", async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ _id: -1 }).limit(1);
    if (profiles.length === 0)
      return res.status(404).json({ error: "No profile found" });
    res.json(profiles[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.post("/api/profile", async (req, res) => {
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

// ---------------------- Serve React Build ----------------------
const buildPath = path.join(__dirname, "../build");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  console.warn(
    "⚠️ React build folder not found, static files will not be served"
  );
}

// ---------------------- Start Server ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
