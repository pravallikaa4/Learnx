import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session"
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    text: String
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);