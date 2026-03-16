import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/api";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
);

export default function Dashboard() {

  const { currentUser } = useAuth();

  const [userData, setUserData] = useState(null);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {

    loadUser();
    loadAnalytics();

  }, []);

  const loadUser = async () => {

    try {

      const data = await apiRequest("/auth/me");
      setUserData(data);

    } catch (err) {

      console.error(err);

    }

  };

  const loadAnalytics = async () => {

    try {

      const data = await apiRequest("/sessions/analytics");
      setAnalytics(data || []);

    } catch (err) {

      console.error(err);

    }

  };

  if (!userData) {

    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  }

  const totalSessions = userData.totalSessions || 0;

  /* BADGE SYSTEM */

  const getBadge = () => {

    if (totalSessions <= 5)
      return { name: "Cheer Up Badge", color: "from-pink-400 to-pink-500", emoji: "🌱" };

    if (totalSessions <= 9)
      return { name: "Motive Badge", color: "from-yellow-400 to-orange-400", emoji: "🔥" };

    if (totalSessions <= 24)
      return { name: "Bronze Badge", color: "from-amber-500 to-yellow-600", emoji: "🥉" };

    if (totalSessions <= 49)
      return { name: "Silver Badge", color: "from-gray-400 to-gray-500", emoji: "🥈" };

    return { name: "Gold Badge", color: "from-yellow-400 to-yellow-500", emoji: "🥇" };

  };

  const badge = getBadge();

  const chartData = {

    labels: analytics.map((_, i) => `Session ${i + 1}`),

    datasets: [
      {
        label: "Performance",
        data: analytics.map((s) => s.rating),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.15)",
        tension: 0.5,
        fill: true,
      },
    ],

  };

  return (

    <div className="min-h-screen bg-[#f4f6fb] p-4 sm:p-6 md:p-10">

      <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">

        {/* HEADER */}

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Overview
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Track your learning performance and growth
          </p>
        </div>


        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-5 sm:p-6 rounded-2xl shadow-lg">
            <p className="text-sm opacity-80">Total Sessions</p>
            <h3 className="text-xl sm:text-2xl font-bold mt-2">
              {totalSessions}
            </h3>
          </div>

          <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white p-5 sm:p-6 rounded-2xl shadow-lg">
            <p className="text-sm opacity-80">Average Rating</p>
            <h3 className="text-xl sm:text-2xl font-bold mt-2">
              {userData.averageRating || 0}
            </h3>
          </div>

          <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white p-5 sm:p-6 rounded-2xl shadow-lg">
            <p className="text-sm opacity-80">Knowledge Score</p>
            <h3 className="text-xl sm:text-2xl font-bold mt-2">
              {userData.knowledgeScore || 0}
            </h3>
          </div>

          <div className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white p-5 sm:p-6 rounded-2xl shadow-lg">
            <p className="text-sm opacity-80">Expertise Level</p>
            <h3 className="text-xl sm:text-2xl font-bold mt-2">
              {userData.expertiseLevel}
            </h3>
          </div>

        </div>


        {/* BADGE */}

        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center gap-6">

          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl sm:text-4xl text-white bg-gradient-to-r ${badge.color}`}
          >
            {badge.emoji}
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Your Current Badge
            </h3>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {badge.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Complete more sessions to unlock higher badges
            </p>
          </div>

        </div>


        {/* CHART */}

        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-sm">

          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-6">
            Performance Overview
          </h3>

          {analytics.length === 0 ? (
            <p className="text-gray-400 text-center">
              No session analytics yet
            </p>
          ) : (
            <Line data={chartData} />
          )}

        </div>

      </div>

    </div>

  );

}