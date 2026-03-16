import express from "express";
import {
  createUser,
  getUser,
  updateAvailability,
  updateProfile
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getLeaderboard } from "../controllers/userController.js";
const router = express.Router();

// Public
router.post("/", createUser);
router.get("/:id", getUser);

// Protected
router.put("/profile", protect, updateProfile);
router.put("/availability", protect, updateAvailability);
router.get("/leaderboard", getLeaderboard);

// routes/userRoutes.js
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;