import Feedback from "../models/Feedback.js";
import User from "../models/User.js";
import Session from "../models/Session.js";

export const submitFeedback = async (req, res) => {
  try {
    const { sessionId, toUser, rating, comment, knowledgeRating, mentorLevel } = req.body;
    const fromUser = req.user._id; // The logged-in user providing the feedback

    // 1. Prevent self-rating
    if (fromUser.toString() === toUser) {
      return res.status(400).json({
        message: "You cannot rate yourself. Ratings must be given to your session partner.",
      });
    }

    // 2. Check if the user being rated exists
    const ratedUser = await User.findById(toUser);
    if (!ratedUser) {
      return res.status(404).json({ message: "The user you are trying to rate does not exist." });
    }

    // 3. Create the Feedback record 
    // This allows the Analytics chart to fetch data where 'toUser' === current logged in user
    const feedback = await Feedback.create({
      sessionId,
      fromUser,
      toUser,
      rating,
      comment,
    });

    // 4. Update the Rated User's Dashboard Stats
    // We fetch ALL feedback ever received by User B to get a true average
    const allReceivedFeedback = await Feedback.find({ toUser: toUser });
    
    const totalRatingsCount = allReceivedFeedback.length;
    const sumOfRatings = allReceivedFeedback.reduce((acc, curr) => acc + curr.rating, 0);
    const newAverage = sumOfRatings / totalRatingsCount;

    // 5. Logic for Expertise Level based on new average
    let expertise = "Beginner";
    if (newAverage >= 8) expertise = "Expert";
    else if (newAverage >= 5) expertise = "Intermediate";

    // 6. Update User B's profile
    // Note: We also update knowledgeScore if provided in the feedback
    await User.findByIdAndUpdate(toUser, {
      averageRating: Number(newAverage.toFixed(1)),
      expertiseLevel: expertise,
      // If the feedback included a knowledge score, update that too
      ...(knowledgeRating && { knowledgeScore: knowledgeRating })
    });

    // 7. Optional: Mark the session as completed in the Session model
    if (sessionId) {
      await Session.findByIdAndUpdate(sessionId, { status: "completed" });
    }

    res.status(201).json({
      message: "Feedback submitted. Your partner's dashboard has been updated!",
      feedback,
    });

  } catch (err) {
    console.error("Feedback Error:", err);
    res.status(500).json({ message: "Feedback submission failed" });
  }
};