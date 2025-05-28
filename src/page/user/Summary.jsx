import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import axiosInstance from "../../component/axiosInstance";

const SummaryModal = ({ isOpen, onClose, meetingId }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [video, setVideo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !meetingId) return;
    setLoading(true);
    setError("");
    setSummary("");
    setVideo("");
    axiosInstance
      .get(`/zoom/meetings/summary/${meetingId}/`)
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setSummary(res.data.meeting_summary || "");
          setVideo(res.data.meeting_video || "");
        }
      })
      .catch(() => {
        setError("Failed to load summary or video.");
      })
      .finally(() => setLoading(false));
  }, [isOpen, meetingId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FiX size={22} />
        </button>
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold ${
              activeTab === "summary"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold ml-2 ${
              activeTab === "video"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("video")}
          >
            Video
          </button>
        </div>
        <div className="p-4 min-h-[200px]">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : activeTab === "summary" ? (
            summary ? (
              <div className="whitespace-pre-line text-gray-800">{summary}</div>
            ) : (
              <div className="text-center text-gray-500">No summary found.</div>
            )
          ) : video ? (
            <video
              src={video}
              controls
              className="w-full max-h-[400px] rounded-lg bg-black"
            />
          ) : (
            <div className="text-center text-gray-500">No video found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
