const express = require("express");
const router = express.Router();
const axios = require("axios");

const otpStore = {};

const WHATSAPP_TOKEN = "YOUR_META_WHATSAPP_TOKEN";
const WHATSAPP_PHONE_ID = "YOUR_PHONE_NUMBER_ID";

router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[phone] = otp;

    await axios.post(
      `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: `Your OTP is: ${otp}` }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (otpStore[phone] === otp) {
    delete otpStore[phone];
    return res.json({ success: true });
  }

  res.json({ success: false });
});

module.exports = router;
