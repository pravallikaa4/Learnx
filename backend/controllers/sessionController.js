import Session from "../models/Session.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { io } from "../server.js";
import Feedback from "../models/Feedback.js";

// ================= CREATE SESSION =================

export const createSession = async (req, res) => {
  try {
    const { matchedUserId, skill, scheduledDate, scheduledTime } = req.body;
    const userId = req.user._id;

    if (!matchedUserId) {
      return res.status(400).json({ message: "Matched user required" });
    }

    const usersSorted = [userId.toString(), matchedUserId].sort();

    // Prevent duplicate active session
    const existing = await Session.findOne({
      users: usersSorted,
      status: { $ne: "completed" },
    });

    if (existing) {
      return res.json(existing);
    }

    // 🔥 FIX: Check if date/time are missing or invalid
    const finalDate = (scheduledDate && scheduledDate !== "null") ? scheduledDate : "Flexible / TBD";
    const finalTime = (scheduledTime && scheduledTime !== "null") ? scheduledTime : "To be discussed";

    const session = await Session.create({
      users: usersSorted,
      skill: skill || "General Mentorship",
      scheduledDate: finalDate,
      scheduledTime: finalTime,
    });

    const matchedUser = await User.findById(matchedUserId);
    const currentUser = await User.findById(userId);

    // 🔔 Socket notification
    if (io) {
      io.to(matchedUserId).emit("newSessionRequest", {
        message: `${currentUser.name} started a session with you`,
        sessionId: session._id,
      });
    }

    // 📧 Email notification
    if (matchedUser?.email) {
      const emailStatus = await sendEmail({
        to: matchedUser.email,
        subject: `Session Request from ${currentUser.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; line-height: 1.6;">
            <h2 style="color: #1f2937;">Dear ${matchedUser.name},</h2>
            <p>We hope this message finds you well.</p>
            <p><strong>${currentUser.name}</strong> has expressed interest in scheduling a one-on-one learning session with you.</p>
            
            <p>Please find the session details below:</p>

            <div style="background:#f9fafb; padding:15px; border-radius:8px; margin:15px 0; border: 1px solid #e5e7eb;">
              <p style="margin: 5px 0;"><strong>Proposed Date:</strong> ${finalDate}</p>
              <p style="margin: 5px 0;"><strong>Proposed Time:</strong> ${finalTime}</p>
            </div>

            <p>You may review and manage this session request by clicking the button below.</p>

            <a href="${process.env.FRONTEND_URL}/chat"
               style="background:#2563eb; color:white; padding:12px 20px;
                      text-decoration:none; border-radius:6px; display:inline-block; font-weight:600;">
              Click to chat
            </a>

            <p style="margin-top:30px;">Warm regards,<br/><strong>LearnX Team</strong></p>
          </div>
        `,
      });

      if (emailStatus) console.log("📩 Email delivered");
      else console.log("⚠ Email failed");
    }

    res.status(201).json(session);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Session creation failed" });
  }
};


// ================= GET USER SESSIONS =================
export const getSessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      users: userId,
      status: { $in: ["scheduled", "active"] },
    })
      .populate("users", "-password")
      .sort({ createdAt: -1 });

    res.json(sessions);

  } catch (error) {
    res.status(500).json({ message: "Fetching sessions failed" });
  }
};



// ================= DELETE SESSION =================
export const deleteSession = async (req, res) => {
  try {
    const sessionId = req.params.id;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    await session.deleteOne();

    res.json({ message: "Session deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};



// ================= COMPLETE SESSION =================
export const completeSession = async (req, res) => {
  try {
    const { sessionId, toUser, rating, knowledgeRating } = req.body;
    const fromUser = req.user._id;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // 1️⃣ Save Feedback
    await Feedback.create({
      sessionId,
      fromUser,
      toUser,
      rating: rating || 0,
      knowledgeRating: knowledgeRating || 0,
    });

    // 2️⃣ Mark session completed
    session.status = "completed";
    await session.save();

    // 3️⃣ Calculate mentor rating & knowledge score
    if (toUser) {

      const feedbacks = await Feedback.find({ toUser });

      // Ignore rating = 0
      const validRatings = feedbacks.filter(f => f.rating > 0);

      // Ignore knowledgeRating = 0
      const validKnowledge = feedbacks.filter(f => f.knowledgeRating > 0);

      let avgRating = 0;
      let knowledgeScore = 0;

      if (validRatings.length > 0) {
        avgRating =
          validRatings.reduce((sum, f) => sum + f.rating, 0) /
          validRatings.length;
      }

      if (validKnowledge.length > 0) {
        knowledgeScore =
          validKnowledge.reduce((sum, f) => sum + f.knowledgeRating, 0) /
          validKnowledge.length;
      }

      // 4️⃣ Determine expertise level
      let expertise = "Beginner";

      if (avgRating >= 8) expertise = "Expert";
      else if (avgRating >= 5) expertise = "Intermediate";

      // 5️⃣ Update mentor stats
      await User.findByIdAndUpdate(toUser, {
        averageRating: Number(avgRating.toFixed(1)),
        knowledgeScore: Number(knowledgeScore.toFixed(1)),
        expertiseLevel: expertise,
      });
    }

    // 6️⃣ Increment session count for both users
    await User.findByIdAndUpdate(toUser, {
      $inc: { totalSessions: 1 }
    });

    await User.findByIdAndUpdate(fromUser, {
      $inc: { totalSessions: 1 }
    });

    res.json({ message: "Session completed successfully" });

  } catch (error) {
    console.error("Backend Crash Detail:", error);

    res.status(500).json({
      message: "Failed to complete session",
      error: error.message,
    });
  }
};
export const getUserAnalytics = async (req, res) => {
  try {

    const userId = req.user._id;

    const feedbacks = await Feedback
      .find({ toUser: userId, rating: { $gt: 0 } })
      .sort({ createdAt: 1 });

    const analytics = feedbacks.map((f, index) => ({
      session: index + 1,
      rating: f.rating
    }));

    res.json(analytics);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Analytics fetch failed"
    });
  }
};