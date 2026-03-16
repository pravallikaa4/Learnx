import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isProfileComplete: false,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isProfileComplete: false,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isProfileComplete: user.isProfileComplete,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
// ... keep your existing register/login/update code ...

export const getMe = async (req, res) => {
  try {
    // req.user is already available because of the 'protect' middleware
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bio = req.body.bio || user.bio;
    user.skillsKnown = req.body.skillsKnown || user.skillsKnown;
    user.skillsToLearn = req.body.skillsToLearn || user.skillsToLearn;
    user.availability = req.body.availability || user.availability;
    user.isProfileComplete = true;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      skillsKnown: updatedUser.skillsKnown,
      skillsToLearn: updatedUser.skillsToLearn,
      availability: updatedUser.availability,
      isProfileComplete: true,
    });
  } catch (error) {
    console.log("PROFILE ERROR:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
};