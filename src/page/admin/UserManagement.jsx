"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiInfo,
  FiMoreHorizontal,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";
import UserDetailsModal from "../../component/admin/UserDetailsModal";
import GiveNoticeModal from "../../component/admin/GiveNoticeModal";
import Sidebar from "../../component/admin/Sidebar";
import axiosInstance from "../../component/axiosInstance";

// const users = [
//   { id: "55-1234", name: "Takács Bianka", startingDate: "12 July 2024" },
//   { id: "55-1234", name: "Sipos Veronika", startingDate: "12 July 2024" },
//   { id: "55-1234", name: "Nagy Timea", startingDate: "12 July 2024" },
//   { id: "55-1234", name: "Kende Lili", startingDate: "12 July 2024" },
//   { id: "55-1234", name: "Pásztor Kira", startingDate: "12 July 2024" },
//   { id: "55-1234", name: "Virág Mercédesz", startingDate: "12 July 2024" },
//   { id: "55-1234", name: "Hajdú Dominika", startingDate: "12 July 2024" },
//   { id: "55-1234", name: "Balázs Annamária", startingDate: "12 July 2024" },
//   { id: "55-1234", name: "Kelemen Krisztina", startingDate: "12 July 2024" },
// ];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [isGiveNoticeModalOpen, setIsGiveNoticeModalOpen] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]); // State to hold users
  const [userDetails, setUserDetails] = useState({}); // State to hold user details

  const dropdownRefs = useRef([]); // Array to store refs for each dropdown

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/auth/users/");
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const name =
      (user.user_profile?.first_name || "") +
      " " +
      (user.user_profile?.last_name || "");
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(user.id).includes(searchTerm)
    );
  });

  const toggleDropdown = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const handleGiveNotice = (user) => {
    setSelectedUser(user);
    setIsGiveNoticeModalOpen(true);
    setDropdownIndex(null);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutside = dropdownRefs.current.every(
        (ref, index) =>
          !ref || !ref.contains(event.target) || dropdownIndex !== index
      );

      if (isOutside && dropdownIndex !== null) {
        setDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownIndex]);

  return (
    <div className="flex flex-col h-screen bg-[#f0f7ff] dark:bg-gray-900">
      <Sidebar>
        <div className="flex-1 overflow-y-auto mt-20 p-4 md:p-6 md:pl-7">
          {/* Header and Search Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
              User Management
            </h1>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by username or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm md:text-base text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search users by username or ID"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            </div>
          </div>

          {/* Responsive Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-xs md:text-sm font-medium">
                  <th className="py-2 px-2 md:py-3 md:px-4" scope="col">
                    User ID
                  </th>
                  <th className="py-2 px-2 md:py-3 md:px-4" scope="col">
                    Name
                  </th>
                  <th className="py-2 px-2 md:py-3 md:px-4" scope="col">
                    Email
                  </th>
                  <th className="py-2 px-2 md:py-3 md:px-4" scope="col">
                    Role
                  </th>
                  <th className="py-2 px-2 md:py-3 md:px-4" scope="col">
                    Joined Date
                  </th>
                  <th className="py-2 px-2 md:py-3 md:px-4" scope="col">
                    User Info
                  </th>
                  <th className="py-2 px-2 md:py-3 md:px-4" scope="col">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs md:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 relative"
                  >
                    <td className="py-2 px-2 md:py-3 md:px-4 truncate">
                      {user.id}
                    </td>
                    <td className="py-2 px-2 md:py-3 md:px-4">
                      {(user.user_profile?.first_name || "-") +
                        " " +
                        (user.user_profile?.last_name || "-")}
                    </td>
                    <td className="py-2 px-2 md:py-3 md:px-4">{user.email}</td>
                    <td className="py-2 px-2 md:py-3 md:px-4">{user.role}</td>
                    <td className="py-2 px-2 md:py-3 md:px-4">
                      {user.user_profile?.joined_date
                        ? new Date(
                            user.user_profile.joined_date
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-2 px-2 md:py-3 md:px-4">
                      <button
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600"
                        onClick={() => {
                          setIsUserDetailsModalOpen(true);
                          setUserDetails(user.user_profile);
                        }}
                        aria-label={`View details for ${user.email}`}
                      >
                        <FiInfo className="mr-1 h-4 w-4" />
                        Click
                      </button>
                    </td>
                    <td className="py-2 px-2 md:py-3 md:px-4">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
                        aria-label={`More actions for ${user.email}`}
                      >
                        <FiMoreHorizontal className="h-5 w-5" />
                      </button>
                      {dropdownIndex === index && (
                        <div
                          ref={(el) => (dropdownRefs.current[index] = el)}
                          className="absolute right-0 top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 w-48"
                        >
                          <button
                            onClick={() => handleGiveNotice(user)}
                            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left text-xs md:text-sm"
                            aria-label={`Give notice to ${user.email}`}
                          >
                            <FiAlertTriangle className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-300" />
                            Give a Notice
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        <UserDetailsModal
          isOpen={isUserDetailsModalOpen}
          onClose={() => setIsUserDetailsModalOpen(false)}
          user={userDetails}
        />

        {/* Give Notice Modal */}
        <GiveNoticeModal
          isOpen={isGiveNoticeModalOpen}
          onClose={() => setIsGiveNoticeModalOpen(false)}
          user={selectedUser}
        />
      </Sidebar>
    </div>
  );
};

export default UserManagement;
