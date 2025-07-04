import { useState } from "react";
import { FiArrowLeft, FiX } from "react-icons/fi";
import axiosInstance from "../axiosInstance";

const GiveNoticeModal = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({ message: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post(`/dashboard/user/management/${user.id}/`, {
        message: formData.message,
      });
      onClose();
    } catch (error) {
      alert("Failed to send notice.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center mb-6 justify-between">
          <button
            onClick={onClose}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Notice
          </h2>
          <h2></h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter here"
              rows="4"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Sending..." : "SUBMIT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GiveNoticeModal;
