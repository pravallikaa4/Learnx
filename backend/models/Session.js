import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    skill: String,
    scheduledDate: String,
    scheduledTime: String,

    status: {
      type: String,
      enum: ["scheduled", "active", "completed"],
      default: "scheduled",
    },

    // Feedback
    course: String,
    mentorLevel: String,
    rating: Number,           // out of 10
    knowledgeRating: Number,  // out of 5
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);