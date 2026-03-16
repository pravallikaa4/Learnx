import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [bio, setBio] = useState("");
  const [skillsKnown, setSkillsKnown] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState("");

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [availability, setAvailability] = useState([]);

  const addAvailability = () => {
    if (!date || !timeSlot) return;

    const existingDate = availability.find((a) => a.date === date);

    if (existingDate) {
      existingDate.timeSlots.push(timeSlot);
      setAvailability([...availability]);
    } else {
      setAvailability([
        ...availability,
        { date, timeSlots: [timeSlot] },
      ]);
    }

    setTimeSlot("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiRequest("/auth/profile", "PUT", {
      bio,
      skillsKnown: skillsKnown.split(",").map((s) => s.trim()),
      skillsToLearn: skillsToLearn.split(",").map((s) => s.trim()),
      availability,
    });

    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl"
      >
        <h2 className="text-2xl font-semibold mb-6">
          Complete Your Profile
        </h2>

        <textarea
          placeholder="Short Bio"
          className="border p-3 w-full mb-4 rounded"
          onChange={(e) => setBio(e.target.value)}
        />

        <input
          placeholder="Skills You Know (comma separated)"
          className="border p-3 w-full mb-4 rounded"
          onChange={(e) => setSkillsKnown(e.target.value)}
        />

        <input
          placeholder="Skills You Want To Learn (comma separated)"
          className="border p-3 w-full mb-4 rounded"
          onChange={(e) => setSkillsToLearn(e.target.value)}
        />

        <div className="mb-4">
          <h3 className="font-medium mb-2">Availability</h3>

          <div className="flex gap-2 mb-2">
            <input
              type="date"
              className="border p-2 rounded flex-1"
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              type="time"
              className="border p-2 rounded flex-1"
              onChange={(e) => setTimeSlot(e.target.value)}
            />

            <button
              type="button"
              onClick={addAvailability}
              className="bg-blue-500 text-white px-4 rounded"
            >
              Add
            </button>
          </div>

          {availability.map((a, index) => (
            <div key={index} className="text-sm text-gray-600">
              {a.date} → {a.timeSlots.join(", ")}
            </div>
          ))}
        </div>

        <button className="bg-green-500 text-white w-full py-3 rounded">
          Save Profile
        </button>
      </form>
    </div>
  );
}