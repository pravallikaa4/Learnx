import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js"; // Add getMe here
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// This is the missing piece:
router.get("/me", protect, getMe); 

export default router;