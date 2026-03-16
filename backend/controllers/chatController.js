import Message from "../models/Message.js";
import Session from "../models/Session.js";


// ================= SEND MESSAGE =================
export const sendMessage = async (req, res) => {
  try {
    const { sessionId, text } = req.body;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.includes(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const message = await Message.create({
      sessionId,
      sender: userId,
      text,
    });

    res.status(201).json(message);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Message sending failed" });
  }
};



// ================= GET MESSAGES =================
export const getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.includes(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const messages = await Message.find({ sessionId })
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: "Fetching messages failed" });
  }
};