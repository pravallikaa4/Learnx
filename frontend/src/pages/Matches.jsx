import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Matches() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?._id) {
      fetchMatches();
    }
  }, [currentUser]);

  const fetchMatches = async () => {
    try {
      const data = await apiRequest("/matches", "POST");
      setMatches(data);
      setLoading(false);
    } catch (err) {
      console.error("Match error:", err);
      setLoading(false);
    }
  };

  const startSession = async (match) => {
    try {
      await apiRequest("/sessions", "POST", {
        matchedUserId: match.user._id,
        skill: match.matchedSkills?.[0] || "General",
        scheduledDate: match.bestTime?.date || null,
        scheduledTime: match.bestTime?.time || null,
      });

      navigate("/chat");
    } catch (err) {
      console.error("Session error:", err);
    }
  };

  const viewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-blue-200 text-center px-4">
        Finding best matches...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-blue-200 px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center sm:text-left">
          AI Smart Matches
        </h2>

        {matches.length === 0 && (
          <p className="text-gray-500 text-center sm:text-left">
            No matches found yet.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {matches.map((match) => (
            <div
              key={match.user._id}
              className="bg-white rounded-2xl shadow-md p-5 sm:p-6 hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    match.user.image ||
                    "https://www.bing.com/th/id/OIP.0sgPfAro4PnEPPZNa4v8HgHaHa?w=220&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.7&pid=3.1&rm=2"
                  }
                  alt={match.user.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold text-base sm:text-lg">
                    {match.user.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Match Score: {match.score}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="text-xs sm:text-sm text-gray-600 mb-4">
                <p>
                  <strong>Knows:</strong>{" "}
                  {match.user.skillsKnown?.join(", ")}
                </p>
                <p>
                  <strong>Wants:</strong>{" "}
                  {match.user.skillsToLearn?.join(", ")}
                </p>
              </div>

              {/* Suggested Time */}
              <div className="mb-4">
                {match.bestTime && match.bestTime.date && match.bestTime.time ? (
                  <div className="p-3 bg-green-50 rounded-lg text-xs sm:text-sm">
                    <p className="font-semibold text-green-700">
                      🕒 Suggested Session Time
                    </p>
                    <p className="mt-1">
                      {match.bestTime.date} at {match.bestTime.time}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 rounded-lg text-xs sm:text-sm text-red-700">
                    Schedules differ, Chat to sync.
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => viewProfile(match.user._id)}
                  className="flex-1 border border-gray-300 py-2 rounded-full text-xs sm:text-sm hover:bg-gray-100 transition"
                >
                  View Profile
                </button>

                <button
                  onClick={() => startSession(match)}
                  className="flex-1 bg-primary text-white py-2 rounded-full text-xs sm:text-sm hover:opacity-90 transition"
                >
                  Start One-on-One
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}