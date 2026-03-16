import express from "express";
import {
  createSession,
  getSessions,
  completeSession,
  deleteSession
} from "../controllers/sessionController.js";
import { getUserAnalytics } from "../controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSession);
router.get("/", protect, getSessions);
router.put("/complete", protect, completeSession);
router.delete("/:id", protect, deleteSession);
router.get("/analytics", protect, getUserAnalytics);
export default router;