import React, { useState, useEffect, useRef } from "react";
import { FiX, FiSend, FiPaperclip } from "react-icons/fi";
import axiosInstance from "../../component/axiosInstance";

const SUPPORTED_FILE_TYPES = [
  "image/*",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".csv",
  ".txt",
];

const AiModal = ({ isOpen, onClose, mainChatId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedPreview, setAttachedPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch chat history
  const fetchHistory = async () => {
    if (!mainChatId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/chats/${mainChatId}/history/`);
      setMessages(response.data || []);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  // Fetch history on open or chat change
  useEffect(() => {
    if (isOpen && mainChatId) fetchHistory();
  }, [isOpen, mainChatId]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setAttachedPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setAttachedPreview(null);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setAttachedPreview(null);
  };

  const handleSend = async () => {
    if (!message.trim() && !attachedFile) return;
    const formData = new FormData();
    formData.append("message", message);
    formData.append("sender_type", "user");
    if (attachedFile) {
      formData.append("attachment", attachedFile); // backend should expect 'attachment'
      formData.append("attachment_name", attachedFile.name);
    }
    try {
      await axiosInstance.post(`/chats/${mainChatId}/history/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("");
      setAttachedFile(null);
      setAttachedPreview(null);
      fetchHistory(); // Refresh messages after sending
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg shadow-lg h-[80vh] w-[60vw] flex flex-col relative">
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FiX size={22} />
        </button>
        <div className="p-4 border-b font-semibold text-lg">AI Assistant</div>
        {/* Chat Body */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ maxHeight: "80%" }}
        >
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender_type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg p-3 max-w-xs ${
                    msg.sender_type === "user"
                      ? "bg-blue-100 text-right"
                      : "bg-gray-100 text-left"
                  }`}
                >
                  {msg.message && <div className="mb-1">{msg.message}</div>}
                  {msg.attachment && msg.attachment_name && (
                    <div className="mt-2">
                      {msg.attachment_name.startsWith("data:image/") ? (
                        <img
                          src={`${msg.attachment_name},${msg.attachment}`}
                          alt="attachment"
                          className="max-h-32 rounded"
                        />
                      ) : (
                        <a
                          href={`${msg.attachment_name},${msg.attachment}`}
                          download="attachment"
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download Attachment
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <div className=" border-t py-4 absolute bottom-0 left-0 right-0">
          <div className="w-fit items-center px-12">
            {attachedPreview && (
              <div className="relative">
                <img
                  src={attachedPreview}
                  alt="Preview"
                  className="h-10 w-10 rounded object-cover"
                />
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX size={12} />
                </button>
              </div>
            )}
            {attachedFile && !attachedPreview && (
              <div className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded">
                <span className="text-xs">{attachedFile.name}</span>
                <button onClick={handleRemoveFile} className="text-red-500">
                  <FiX size={12} />
                </button>
              </div>
            )}
          </div>

          <div className="px-4 flex items-center gap-2">
            <label className="cursor-pointer">
              <FiPaperclip size={20} className="text-gray-500" />
              <input
                type="file"
                accept={SUPPORTED_FILE_TYPES.join(",")}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <input
              type="text"
              className="flex-1 border rounded-3xl px-3 py-2 text-sm outline-none"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiModal;
