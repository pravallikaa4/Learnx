import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    bio: String,
    image: String,

    skillsKnown: [String],
    skillsToLearn: [String],

    availability: [
      {
        date: String,
        timeSlots: [String],
      },
    ],

    // Dashboard Stats
    totalSessions: { type: Number, default: 5 },
    averageRating: { type: Number, default: 5 },        // out of 10
    knowledgeScore: { type: Number, default: 5 },       // out of 5

    expertiseLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
      default: "Beginner",
    },

    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);