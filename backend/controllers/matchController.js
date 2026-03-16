import User from "../models/User.js";
import axios from "axios";

const PYTHON_MATCH_API = "https://match-jipp.onrender.com/match";

export const findMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
      isProfileComplete: true
    });

    const matches = [];

    for (let user of users) {

      try {

        const response = await axios.post(PYTHON_MATCH_API, {
          current_user: currentUser,
          other_user: user
        });

        const result = response.data;

        if (result.score > 0) {
          matches.push({
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
          });
        }

      } catch (err) {
        console.error("Python API error:", err.message);
      }

    }

    matches.sort((a, b) => b.score - a.score);

    res.json(matches);

  } catch (error) {
    console.error("Match calculation failed:", error);
    res.status(500).json({ message: "Match calculation failed" });
  }
};
