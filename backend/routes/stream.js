import express from "express";
import { StreamClient } from "@stream-io/node-sdk";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/token", protect,async (req, res) => {
  try {
    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_SECRET;
    console.log(apiKey);
    console.log(apiSecret);
    if (!apiKey || !apiSecret) {
      return res.status(500).json({ message: "Stream env missing" });
    }

    const serverClient = new StreamClient(apiKey, apiSecret);

    const userId = String(req.user._id);

    // ✅ THIS IS CORRECT FOR NEW SDK
    const token = serverClient.createToken(userId);
    console.log(token);
    res.json({ token, apiKey });
  } catch (err) {
    console.error("Stream token error:", err);
    res.status(500).json({ message: "Token generation failed" });
  }
});

export default router;