import { useState, useEffect } from "react";
import axiosInstance from "../component/axiosInstance";

export default function MettingOptions({
  fetchChatData,
  chatId,
  setTimeMettingShow,
  mentorId,
}) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [date, setDate] = useState("");

  // Helper to format time as "hh:mm AM/PM"
  function formatTime(timeStr) {
    if (!timeStr) return "";
    const [hours, minutes, seconds] = timeStr.split(":");
    const dateObj = new Date();
    dateObj.setHours(hours, minutes, seconds);
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    const fetchTimes = async () => {
      if (!mentorId) return;
      try {
        const res = await axiosInstance.post("/zoom/times/", {
          mentor_id: mentorId,
        });
        setAvailableTimes(res.data.available_times.slice(0, 3) || []);
        setDate(res.data.date || "");
      } catch (error) {
        console.error("Error fetching available times:", error);
      }
    };
    fetchTimes();
  }, [mentorId]);

  const handleOptionClick = async (start_time) => {
    if (!start_time) return;
    try {
      await axiosInstance.post(`/zoom/meetings/`, {
        chat: chatId,
        date: date,
        meeting_time: start_time,
        duration: "30",
        users: [mentorId], // Add user id if needed
      });
      fetchChatData(chatId);
      setTimeMettingShow(false);
    } catch (error) {
      console.error("Error scheduling meeting:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 border border-blue-300 rounded-lg">
      <h1 className="text-xl font-semibold text-slate-700 text-center mb-4">
        Please Click On One of The Available Times Below
      </h1>
      <p className="text-sm text-slate-600 text-center mb-8">
        Our expert mentors are always available to support you.
      </p>
      <div className="space-y-4">
        {availableTimes.length === 0 && (
          <div className="text-center text-gray-500">
            No available times found.
          </div>
        )}
        {availableTimes.map((time, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(time.start_time)}
            className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            <span className="font-medium">{idx + 1}.</span> {date} at{" "}
            {formatTime(time.start_time)} - {formatTime(time.end_time)}
          </button>
        ))}
      </div>
    </div>
  );
}
