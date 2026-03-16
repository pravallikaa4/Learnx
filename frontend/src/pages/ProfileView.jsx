import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function ProfileView() {
  const location = useLocation();
    const navigate = useNavigate();
    const { addSession } = useContext(UserContext);

  const user = location.state;

  if (!user) {
    return <div className="p-10">User not found</div>;
  }

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-sm">

        <div className="flex items-center gap-6">
          <img
            src={user.image}
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">
              Match Score: {user.matchScore}%
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-2">Skills Known</h3>
          <div className="flex flex-wrap gap-2">
            {user.skillsKnown.map(skill => (
              <span
                key={skill}
                className="bg-primary text-white px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Wants to Learn</h3>
          <div className="flex flex-wrap gap-2">
            {user.skillsLearn.map(skill => (
              <span
                key={skill}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-green-600">
            Suggested Time: {user.bestSlot}
          </p>
        </div>

        <button
  onClick={() => {
    addSession(user);
    navigate("/chat");
  }}
  className="btn-primary mt-8"
>
  Start One-on-One Session
</button>

      </div>
    </div>
  );
}