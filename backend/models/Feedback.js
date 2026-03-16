import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // This is the person whose dashboard will be updated
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10, // Matching your UI (1-10 scale)
    },
    knowledgeRating: {
      type: Number,
      min: 0,
      max: 5, // Matching your UI (1-5 stars)
    },
    comment: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["mentor", "student", "both"],
    },
  },
  { timestamps: true }
);

// Prevent a user from rating the same session twice
feedbackSchema.index({ sessionId: 1, fromUser: 1 }, { unique: true });

export default mongoose.model("Feedback", feedbackSchema);