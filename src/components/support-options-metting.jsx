import { useState, useEffect } from "react";
import axiosInstance from "../component/axiosInstance";

export default function MeetingOptions({
  fetchChatData,
  chatId,
  setTimeMeetingShow,
  timeMettingShow,
}) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [mentorId, setMentorId] = useState("");

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

  // Helper to format date as "Month Day, Year"
  function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        // Adjust the endpoint to include mentorId if required by the backend
        const res = await axiosInstance.get(`/zoom/times/`);
        setAvailableTimes(res.data.mentor.available_slots.slice(0, 3) || []);
        setMentorId(res.data.mentor.mentor_id);
      } catch (error) {
        console.error("Error fetching available times:", error);
        setAvailableTimes([]);
      }
    };
    fetchTimes();
    console.log(timeMettingShow);
  }, []);

  const handleOptionClick = async (slot) => {
    if (!slot.start_time || !slot.date) return;
    try {
      await axiosInstance.post(`/zoom/meetings/`, {
        chat: chatId,
        date: slot.date,
        meeting_time: slot.start_time,
        duration: "30",
        users: [Number(mentorId)],
      });
      fetchChatData(chatId);
      setTimeMeetingShow(false);
      console.log(
        "time ...........................................................................",
        timeMettingShow
      );
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
        {availableTimes.map((slot, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(slot)}
            className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            <span className="font-medium">{idx + 1}.</span>{" "}
            {formatDate(slot.date)} at {formatTime(slot.start_time)} -{" "}
            {formatTime(slot.end_time)}
          </button>
        ))}
      </div>
    </div>
  );
}
