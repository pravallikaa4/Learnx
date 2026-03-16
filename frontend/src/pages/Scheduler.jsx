import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../components/calendar.css";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/api";
import TimeSelector from "./TimeSelector";

export default function Scheduler() {
  const { currentUser, updateUser } = useAuth();

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeDate, setActiveDate] = useState(new Date());

  const handleDateClick = (date) => {
    setSelectedDate(date.toDateString());
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(activeDate);
    newDate.setMonth(newDate.getMonth() - 1);

    if (
      newDate.getFullYear() < today.getFullYear() ||
      (newDate.getFullYear() === today.getFullYear() &&
        newDate.getMonth() < today.getMonth())
    ) {
      return;
    }

    setActiveDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(activeDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setActiveDate(newDate);
  };

  const saveAvailability = async (date, times) => {
    try {
      const existing = currentUser?.availability || [];

      const updatedAvailability = [
        ...existing.filter((d) => d.date !== date),
        { date, timeSlots: times },
      ];

      const updatedUser = await apiRequest(
        "/api/users/availability",
        "PUT",
        { availability: updatedAvailability }
      );

      updateUser(updatedUser);
      setSelectedDate(null);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEntireDate = async (dateToRemove) => {
    const updatedAvailability = (currentUser?.availability || []).filter(
      (day) => day.date !== dateToRemove
    );

    const updatedUser = await apiRequest(
      "/api/users/availability",
      "PUT",
      { availability: updatedAvailability }
    );

    updateUser(updatedUser);
  };

  const deleteTimeSlot = async (date, timeToRemove) => {
    const updatedAvailability = currentUser.availability
      .map((day) => {
        if (day.date === date) {
          return {
            ...day,
            timeSlots: day.timeSlots.filter((t) => t !== timeToRemove),
          };
        }
        return day;
      })
      .filter((day) => day.timeSlots.length > 0);

    const updatedUser = await apiRequest(
      "/api/users/availability",
      "PUT",
      { availability: updatedAvailability }
    );

    updateUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start md:items-center justify-center px-3 sm:px-4 py-6 md:py-10">

      <div className="w-full max-w-6xl">

        {!selectedDate ? (
          <>
            {/* CALENDAR CARD */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

              {/* LEFT PANEL */}
              <div className="md:w-2/5 bg-orange-500 text-white p-6 sm:p-8 flex flex-col justify-center items-center text-center">

                <div className="text-5xl sm:text-6xl md:text-7xl font-bold">
                  {today.getDate()}
                </div>

                <div className="text-base sm:text-lg mt-2">
                  {activeDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="md:w-3/5 p-4 sm:p-6">

                {/* NAVIGATION */}
                <div className="flex justify-between items-center mb-4">

                  <button
                    onClick={goToPreviousMonth}
                    className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition"
                  >
                    ◀
                  </button>

                  <h3 className="font-semibold text-base sm:text-lg text-center">
                    {activeDate.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>

                  <button
                    onClick={goToNextMonth}
                    className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition"
                  >
                    ▶
                  </button>

                </div>

                {/* CALENDAR */}
                <div className="w-full overflow-x-auto">
                  <Calendar
                    onClickDay={handleDateClick}
                    activeStartDate={activeDate}
                    showNavigation={false}
                    minDate={today}
                    className="custom-calendar w-full"
                  />
                </div>

              </div>
            </div>

            {/* SAVED AVAILABILITY */}
            <div className="mt-8 sm:mt-10">

              <h3 className="font-semibold mb-4 text-lg">
                Your Saved Availability
              </h3>

              {(!currentUser?.availability ||
                currentUser.availability.length === 0) && (
                <p className="text-gray-500">
                  No availability added yet.
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {currentUser?.availability?.map((day) => (
                  <div
                    key={day.date}
                    className="p-4 bg-white rounded-xl shadow-sm border"
                  >
                    <div className="flex justify-between items-center mb-3">

                      <strong className="text-sm sm:text-base">
                        {day.date}
                      </strong>

                      <button
                        onClick={() => deleteEntireDate(day.date)}
                        className="text-red-500 text-xs sm:text-sm hover:underline"
                      >
                        Delete
                      </button>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      {day.timeSlots.map((time) => (
                        <div
                          key={time}
                          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm"
                        >
                          {time}

                          <button
                            onClick={() =>
                              deleteTimeSlot(day.date, time)
                            }
                            className="text-red-500 font-bold"
                          >
                            ✕
                          </button>

                        </div>
                      ))}

                    </div>

                  </div>
                ))}

              </div>

            </div>
          </>
        ) : (
          <TimeSelector
            date={selectedDate}
            initialTimes={
              currentUser?.availability?.find(
                (d) => d.date === selectedDate
              )?.timeSlots || []
            }
            onSave={saveAvailability}
            onBack={() => setSelectedDate(null)}
          />
        )}
      </div>
    </div>
  );
}
