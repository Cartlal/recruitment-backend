const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

const otpStore = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;
    otpStore.set(email, { otp, expiresAt });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your One-Time Password",
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.json({ success: false, message: "Invalid input" });
  }

  const record = otpStore.get(email);

  if (!record) {
    return res.json({ success: false, message: "OTP not found" });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.json({ success: false, message: "OTP expired" });
  }

  if (record.otp === otp) {
    otpStore.delete(email);
    return res.json({ success: true, message: "OTP verified" });
  }

  return res.json({ success: false, message: "Incorrect OTP" });
});

module.exports = router;
