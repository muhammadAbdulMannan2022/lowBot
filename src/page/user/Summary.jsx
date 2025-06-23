import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import axiosInstance from "../../component/axiosInstance";

const SummaryModal = ({ isOpen, onClose, meetingId }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isOpen || !meetingId) return;
    setLoading(true);
    setError("");
    setSummaries([]);
    axiosInstance
      .get(`/zoom/meetings/summary/${meetingId}/`)
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);
        } else if (Array.isArray(res.data)) {
          setSummaries(res.data);
        } else {
          setSummaries([res.data]);
        }
      })
      .catch(() => {
        setError("Failed to load summary or video.");
      })
      .finally(() => setLoading(false));
  }, [isOpen, meetingId]);

  if (!isOpen) return null;

  const current = summaries[activeIndex] || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FiX size={22} />
        </button>
        {/* Tabs for each summary/video */}
        {summaries.length > 1 && (
          <div className="flex justify-center mb-4 flex-wrap gap-2">
            {summaries.map((_, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 rounded font-semibold border ${
                  activeIndex === idx
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
                onClick={() => setActiveIndex(idx)}
              >
                {`Session ${idx + 1}`}
              </button>
            ))}
          </div>
        )}
        {/* Tab for summary/video */}
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
            current.meeting_summary ? (
              <div className="whitespace-pre-line text-gray-800">
                {current.meeting_summary}
              </div>
            ) : (
              <div className="text-center text-gray-500">No summary found.</div>
            )
          ) : current.meeting_video ? (
            <video
              src={
                current.meeting_video.startsWith("http")
                  ? current.meeting_video
                  : `https://leapapp-d8gtazf2e9aygcc6.canadacentral-01.azurewebsites.net${current.meeting_video}`
              }
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
