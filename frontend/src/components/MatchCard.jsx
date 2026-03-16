import { useNavigate } from "react-router-dom";

export default function MatchCard({ match }) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    // Best practice → use user ID
    navigate(`/profile/${match._id}`);
  };

  return (
    <div className="card p-6 hover:shadow-md transition">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {match.name}
        </h3>
        <span className="text-sm text-muted">
          {match.level}
        </span>
      </div>

      <p className="text-muted mb-3">
        Strong in: <span className="font-medium text-black">{match.skill}</span>
      </p>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full"
            style={{ width: `${match.score}%` }}
          ></div>
        </div>
        <p className="text-sm text-muted mt-1">
          Match Score: {match.score}%
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleViewProfile}
          className="border border-border px-4 py-2 rounded-lg w-full hover:bg-gray-100 transition"
        >
          View Profile
        </button>

        <button
          onClick={() => navigate(`/chat/${match._id}`)}
          className="btn-primary w-full"
        >
          Chat
        </button>
      </div>
    </div>
  );
}