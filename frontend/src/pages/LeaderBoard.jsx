import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

export default function Leaderboard() {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const data = await apiRequest("/api/users/leaderboard");
    setMentors(data || []);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          🏆 Top Mentors
        </h2>

        {mentors.map((mentor, index) => (
          <div
            key={mentor._id}
            className="flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold w-6">
                {index + 1}
              </span>
              <img
                src={mentor.image || "https://via.placeholder.com/40"}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{mentor.name}</p>
                <p className="text-sm text-gray-500">
                  {mentor.expertiseLevel}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-blue-600">
                ⭐ {mentor.averageRating}
              </p>
              <p className="text-xs text-gray-400">
                {mentor.totalSessions} sessions
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
