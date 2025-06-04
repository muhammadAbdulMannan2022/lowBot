"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import Navbar from "../../component/user/Navbar";
import Sidebar from "../../component/user/UserSidebar";
import { Link } from "react-router-dom";
import axiosInstance from "../../component/axiosInstance";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);

  // Function to calculate relative time difference
  const getRelativeTime = (timestamp) => {
    const currentDate = new Date(); // Current date: 07:56 PM +06, May 16, 2025
    const notificationDate = new Date(timestamp);
    const diffInMs = currentDate - notificationDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get(
          "/notification/get/user/all-notifications/"
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        alert("An error occurred while fetching notifications.");
      }
    };
    fetchNotifications();
  }, []);

  // Handle deleting a notification
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/notification/delete/${id}/notifications/`); // Assuming an endpoint to delete a notification
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("An error occurred while deleting the notification.");
    }
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex mt-16">
        <Sidebar />
        <div className="mx-auto h-[93vh] w-full bg-white dark:bg-gray-800 rounded-lg shadow-md max-h-[100vh] overflow-y-auto">
          <div className="py-10 px-4 md:px-6">
            <h1 className="text-2xl font-medium text-gray-800 dark:text-gray-100">
              Notifications
            </h1>
          </div>

          <div className="divide-y border border-gray-100 dark:divide-gray-700 dark:border-gray-700">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-200">
                      {notification.title}: {notification.message}
                      {notification.slug && (
                        <Link
                          to={notification.slug}
                          className="ml-1 text-blue-500 hover:underline"
                        >
                          click here
                        </Link>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getRelativeTime(notification.created_at)}
                    </span>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      aria-label={`Delete notification: ${notification.message}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No notifications available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
