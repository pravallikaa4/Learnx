import User from "../models/User.js";

export const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

export const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { availability },
      { new: true }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Failed to update availability" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found in DB" });
    }

    const { name, bio, image, skillsKnown, skillsToLearn, availability } = req.body;

    // ================= IMAGE VALIDATION =================
    if (image) {
      // Check if it's a valid Base64 image string with allowed types
      const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
      
      // Base64 strings look like: "data:image/png;base64,iVBORw..."
      const mimeMatch = image.match(/^data:(image\/[a-z]+);base64,/);
      
      if (mimeMatch) {
        const mimeType = mimeMatch[1];
        if (!allowedMimeTypes.includes(mimeType)) {
          return res.status(400).json({ 
            message: "Invalid file type. Only JPG, JPEG, and PNG are allowed." 
          });
        }
      } else if (!image.startsWith('http')) { 
        // If it's not a URL and doesn't match the Base64 pattern, it's invalid
        return res.status(400).json({ message: "Invalid image format." });
      }
    }

    // Update fields
    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.image = image === undefined ? user.image : image;
    user.skillsKnown = skillsKnown || user.skillsKnown;
    user.skillsToLearn = skillsToLearn || user.skillsToLearn;
    user.availability = availability || user.availability;
    user.isProfileComplete = true;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
};


export const getLeaderboard = async (req, res) => {
  try {
    const mentors = await User.find()
      .sort({ averageRating: -1 })
      .limit(10)
      .select("name image expertiseLevel averageRating totalSessions");

    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: "Leaderboard failed" });
  }
};