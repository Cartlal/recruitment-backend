import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";

import config from "./config.js";
import User from "./models/User.js";

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------
// MongoDB Connection
// ----------------------------------
mongoose
  .connect(config.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));


// ----------------------------------
// SIGNUP API (Frontend: signup.html)
// ----------------------------------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate
    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ msg: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to DB
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({ msg: "Account created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ----------------------------------
// LOGIN API (Frontend: login.html)
// ----------------------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid email or password" });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ msg: "Invalid email or password" });

    // Success
    res.json({
      msg: "Login successful",
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});


app.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      role: "User",
      createdAt: user.createdAt,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ----------------------------------
// START SERVER
// ----------------------------------
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

