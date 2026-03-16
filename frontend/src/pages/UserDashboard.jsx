import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

export default function UserDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiRequest(`/api/users/${id}`);
        setUser(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">

        {/* ===== HEADER ===== */}
        <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>

        {/* ===== STATS ROW ===== */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold">{user.totalSessions || 0}</h2>
            <p className="text-gray-500">Sessions Attended</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold">
              ⭐ {user.averageRating || 0}
            </h2>
            <p className="text-gray-500">Average Rating</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-yellow-500">
            <h2 className="text-2xl font-bold">
              {user.expertiseLevel}
            </h2>
            <p className="text-gray-500">Expertise Level</p>
          </div>

        </div>

        {/* ===== MAIN GRADIENT CARD ===== */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl p-10 shadow-xl mb-8">
          <div className="flex justify-between items-center">

            <div>
              <h2 className="text-3xl font-bold mb-2">
                {user.name}
              </h2>
              <p className="opacity-80">{user.bio}</p>

              <div className="mt-6 flex gap-6">
                <div>
                  <p className="text-sm opacity-70">Knowledge Score</p>
                  <p className="text-xl font-semibold">
                    {user.knowledgeScore || 0}
                  </p>
                </div>

                
              </div>
            </div>


          </div>
        </div>
        </div>
    </div>
  );
}
