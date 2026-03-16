import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/api";
import StreamChatProvider from "../components/streamChatProvider";
import VideoCall from "../components/videoCall";

export default function Chat() {
  const { currentUser } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [sessionRole, setSessionRole] = useState("");

  const [courseLearned, setCourseLearned] = useState("");
  const [courseTaught, setCourseTaught] = useState("");

  const [mentorLevel, setMentorLevel] = useState("");
  const [knowledgeRating, setKnowledgeRating] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!currentUser?._id) return;
    loadSessions();
  }, [currentUser]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(`/api/sessions?userId=${currentUser._id}`);
      setSessions(data || []);
      if (data?.length > 0) setActiveSession(data[0]);
    } catch (err) {
      console.error("Failed to load sessions", err);
    } finally {
      setLoading(false);
    }
  };

  const otherUser = useMemo(() => {
    if (!activeSession || !currentUser) return null;
    return activeSession.users.find((u) => u._id !== currentUser._id);
  }, [activeSession, currentUser]);

  const handleEndSession = () => {
    setVideoOpen(false);
    setFeedbackOpen(true);
  };

  const submitFeedback = async () => {
  try {
    const receiverId = otherUser?._id;

    if (!receiverId) {
      alert("Error: No partner found for this session.");
      return;
    }

    // Prepare the data object
    const feedbackData = {
      sessionId: activeSession._id,
      toUser: receiverId,
      role: sessionRole,
      // If "I taught", these might be empty/0, and that's okay
      courseLearned: courseLearned || "", 
      courseTaught: courseTaught || "",
      mentorLevel: mentorLevel || "Beginner",
      knowledgeRating: Number(knowledgeRating) || 0,
      rating: Number(rating) || 0,
    };

    await apiRequest("/api/sessions/complete", "PUT", feedbackData);

    // Reset UI
    setFeedbackOpen(false);
    setSessionRole("");
    setCourseLearned("");
    setCourseTaught("");
    setRating(0);
    setKnowledgeRating(0);
    
    // Refresh sessions to show it's completed
    loadSessions();
    alert("Session completed successfully!");

  } catch (err) {
    console.error("Feedback submission failed", err);
    alert("Failed to submit. Check console for details.");
  }
};
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading sessions...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-100 overflow-hidden font-sans">

      {/* SIDEBAR */}
      <div className="w-full md:w-1/4 bg-white border-r flex flex-col">

        <div className="p-4 md:p-6 border-b font-bold text-lg">
          One-on-One Sessions
        </div>

        <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto p-3 md:p-4 gap-3">

          {sessions.length === 0 && (
            <div className="text-gray-400 text-center w-full mt-4">
              No sessions yet
            </div>
          )}

          {sessions.map((s) => {
            const sessionUser = s.users.find(
              (u) => u._id !== currentUser._id
            );

            return (
              <div
                key={s._id}
                onClick={() => setActiveSession(s)}
                className={`min-w-[200px] md:min-w-0 p-3 md:p-4 rounded-xl cursor-pointer flex items-center gap-3 transition ${
                  activeSession?._id === s._id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <img
                  src={
                    sessionUser?.image ||
                    "https://www.bing.com/th/id/OIP.0sgPfAro4PnEPPZNa4v8HgHaHa?w=220&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.7&pid=3.1&rm=2"
                  }
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
                  alt="user"
                />

                <div>
                  <p className="font-semibold text-sm md:text-base">
                    {sessionUser?.name || "Unknown User"}
                  </p>

                  <p className="text-xs text-gray-500 uppercase">
                    {s.skill}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT PANEL */}
      <div className="flex-1 flex flex-col bg-white">

        {activeSession && otherUser ? (
          <>
            <div className="p-3 md:p-4 border-b flex justify-between items-center">

              <h3 className="font-bold text-lg md:text-xl">
                {otherUser.name}
              </h3>

              <button
                onClick={() => setVideoOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-medium transition"
              >
                🎥 Video Call
              </button>

            </div>

            <div className="flex-1 overflow-hidden">
              <StreamChatProvider
                user={currentUser}
                session={activeSession}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a session to start
          </div>
        )}
      </div>

      {/* VIDEO OVERLAY */}
      {videoOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <VideoCall
            currentUser={currentUser}
            activeSession={activeSession}
            onCallEnd={handleEndSession}
          />
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {feedbackOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">

          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">

            {/* HEADER */}
            <div className="p-6 border-b">
              <h3 className="text-xl md:text-2xl font-bold text-center">
                Session Feedback
              </h3>
            </div>

            {/* FORM SCROLL AREA */}
            <div className="overflow-y-auto p-6 space-y-4">

              {/* ROLE */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  What did you do in this session?
                </label>

                <select
                  value={sessionRole}
                  onChange={(e) => setSessionRole(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select</option>
                  <option value="learned">I Learned</option>
                  <option value="taught">I Taught</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {(sessionRole === "learned" || sessionRole === "both") && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    What course did you learn?
                  </label>

                  <input
                    type="text"
                    value={courseLearned}
                    onChange={(e) => setCourseLearned(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              {(sessionRole === "taught" || sessionRole === "both") && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    What course did you teach?
                  </label>

                  <input
                    type="text"
                    value={courseTaught}
                    onChange={(e) => setCourseTaught(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              {(sessionRole === "learned" || sessionRole === "both") && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Mentor is best suited for:
                    </label>

                    <select
                      value={mentorLevel}
                      onChange={(e) => setMentorLevel(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="text-center">
                    <label className="block text-sm font-semibold mb-2">
                      Rate mentor's knowledge
                    </label>

                    <div className="flex justify-center gap-2">
                      {[1,2,3,4,5].map((num) => (
                        <button
                          key={num}
                          onClick={() => setKnowledgeRating(num)}
                          className={`text-2xl ${
                            knowledgeRating >= num
                              ? "text-green-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-center">

                    <label className="block text-sm font-semibold mb-3">
                      Overall Rating
                    </label>

                    <div className="grid grid-cols-5 gap-2">
                      {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                        <button
                          key={num}
                          onClick={() => setRating(num)}
                          className={`h-9 rounded-lg text-sm font-semibold ${
                            rating === num
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                  </div>
                </>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="p-5 border-t">
              <button
                onClick={submitFeedback}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                Submit Feedback
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
