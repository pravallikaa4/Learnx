import User from "../models/User.js";
import { calculateMatchScore } from "../utils/matchAlgorithm.js";

export const findMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const users = await User.find({ 
      _id: { $ne: req.user._id }, 
      isProfileComplete: true 
    });

    const matches = users
      .map((user) => {
        try {
          const result = calculateMatchScore(currentUser, user);
          if (!result) return null;

          return {
            user: {
              _id: user._id,
              name: user.name,
              image: user.photo || user.image, 
              skillsKnown: user.skillsKnown,
              skillsToLearn: user.skillsToLearn
            },
            score: result.score,
            matchedSkills: result.matchedSkills,
            bestTime: result.bestTime
          };
        } catch (err) {
          return null;
        }
      })
      .filter(m => m !== null)
      .sort((a, b) => b.score - a.score);

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Match calculation failed" });
  }
};