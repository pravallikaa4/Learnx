import { useState } from "react";

export default function TimeSelector({
  date,
  onSave,
  onBack,
  initialTimes,
}) {
  const [selectedTimes, setSelectedTimes] = useState(
    initialTimes || []
  );

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "3:00 PM",
    "5:00 PM",
    "7:00 PM",
  ];

  const toggleTime = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time)
        ? prev.filter((t) => t !== time)
        : [...prev, time]
    );
  };

  const handleSave = () => {
    if (selectedTimes.length === 0) {
      alert("Please select at least one time slot.");
      return;
    }
    onSave(date, selectedTimes);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border animate-in fade-in duration-300 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-2">
        Select Time for {date}
      </h3>

      <p className="text-gray-500 mb-6">
        Click the slots you are available for.
      </p>

      <div className="flex flex-wrap gap-4 mb-8">
        {timeSlots.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => toggleTime(time)}
            className={`px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedTimes.includes(time)
                ? "bg-orange-500 text-white border-orange-500 shadow-md scale-105"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:border-orange-400"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center border-t pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="px-8 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 shadow-lg transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}