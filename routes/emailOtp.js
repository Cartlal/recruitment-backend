import express from "express";
import { Resend } from "resend";

const router = express.Router();

// Initialize Resend API
const resend = new Resend(process.env.RESEND_API_KEY);

// Store OTP temporarily in memory
const otpStore = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// -------- SEND OTP ----------
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    otpStore.set(email, { otp, expiresAt });

    // Send email through Resend API
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.error("Resend Error:", error);
    res.json({ success: false, message: "Failed to send OTP" });
  }
});

// -------- VERIFY OTP ----------
router.post("/verify-otp", async (req, res) => {
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
    return res.json({ success: true, message: "OTP verified successfully" });
  }

  res.json({ success: false, message: "Incorrect OTP" });
});

export default router;
