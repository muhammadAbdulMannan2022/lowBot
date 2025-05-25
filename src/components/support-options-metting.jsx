import { useState } from "react";
import axiosInstance from "../component/axiosInstance";

export default function MettingOptions({
  fetchChatData,
  chatId,
  setTimeMettingShow,
}) {
  // Function to format date and time
  const formatDateTime = (date) => {
    return `${date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })} . ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })} (GMT+6)`;
  };

  // Generate dynamic dates and times starting from tomorrow
  const now = new Date(); // Current date and time: 09:35 PM +06, Thursday, May 15, 2025
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1); // Start from May 16, 2025

  // Option 1: Tomorrow at 10:00 AM
  const option1Date = new Date(tomorrow);
  option1Date.setHours(10, 0, 0);

  // Option 2: Tomorrow at 2:30 PM
  const option2Date = new Date(tomorrow);
  option2Date.setHours(14, 30, 0);

  // Option 3: Day after tomorrow at 3:00 PM
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(tomorrow.getDate() + 3); // May 17, 2025
  const option3Date = new Date(dayAfterTomorrow);
  option3Date.setHours(15, 0, 0);

  // Handle option click with dynamic date and time
  const handleOptionClick = async (date) => {
    if (!date) return; // Prevent undefined date

    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }); // HH:mm

    try {
      await axiosInstance.post(`/zoom/meetings/`, {
        // Changed from PUT to POST and fixed typo in endpoint
        date: formattedDate,
        meeting_time: formattedTime, // Fixed typo: metting_time -> meeting_time
        chat: chatId,
      });

      fetchChatData(chatId);
      setTimeMettingShow(false); // Hide the meeting options after scheduling
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      // alert("An error occurred while scheduling the meeting.");
    } finally {
      // Optionally, you can reset the state or perform any cleanup here
      setTimeMettingShow(false);
      console.log("Meeting scheduled for:", formattedDate, formattedTime);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 border border-blue-300 rounded-lg">
      <h1 className="text-xl font-semibold text-slate-700 text-center mb-4">
        Please Click On One of The Options Below
      </h1>
      <p className="text-sm text-slate-600 text-center mb-8">
        Our expert mentors are always available to support you.
      </p>

      <div className="space-y-4">
        <button
          onClick={() => handleOptionClick(option1Date)}
          className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          <span className="font-medium">1.</span> {formatDateTime(option1Date)}
        </button>

        <button
          onClick={() => handleOptionClick(option2Date)}
          className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          <span className="font-medium">2.</span> {formatDateTime(option2Date)}
        </button>

        <button
          onClick={() => handleOptionClick(option3Date)}
          className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          <span className="font-medium">3.</span> {formatDateTime(option3Date)}
        </button>
      </div>
    </div>
  );
}
