import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../api/api";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await apiRequest(`/users/${id}`);
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

        <div className="flex items-center gap-6 mb-6">
          <img
            src={
              user.image ||
              "https://randomuser.me/api/portraits/women/44.jpg"
            }
            className="w-24 h-24 rounded-full"
          />

          <div>
            <h2 className="text-2xl font-semibold">
              {user.name}
            </h2>
            <p className="text-gray-500">
              {user.expertiseLevel}
            </p>
            <p className="text-yellow-500">
              ⭐ {user.averageRating?.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Bio</h3>
          <p className="text-gray-600">{user.bio}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Skills Known</h3>
          <p>{user.skillsKnown?.join(", ")}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Skills To Learn</h3>
          <p>{user.skillsToLearn?.join(", ")}</p>
        </div>

      </div>
    </div>
  );
}