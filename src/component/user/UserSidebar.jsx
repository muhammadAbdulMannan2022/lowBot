/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import {
  MessageCircle,
  Bell,
  Users,
  Settings,
  ChevronDown,
  User,
  Crown,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../../assets/logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import LogoutModal from "../admin/LogoutModal";

export default function Sidebar({
  userName = "Cameron Malek",
  userType = "Freebie User",
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar toggle

  // Toggle the Settings submenu
  const toggleSettingsMenu = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  // Toggle the mobile sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Handle menu item click and navigate
  const handleMenuClick = (path) => {
    navigate(path);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  // Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate("/login");
    }
    setIsSidebarOpen(false); // Close sidebar on logout
  };

  // Check if a path is active
  const isActive = (path) => location.pathname === path;

  const [isLogoutModal, setIsLogoutModal] = useState(false);

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <Button
        variant="ghost"
        className="fixed top-6 left-0 z-40 md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <Menu className="h-12 w-12 text-gray-800 dark:text-white" />
      </Button>

      {/* Overlay for Mobile when Sidebar is Open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 border-r dark:border-gray-600 flex flex-col px-5 h-screen transition-transform duration-300 ease-in-out md:z-0 z-40",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:h-[93vh]"
        )}
      >
        {/* Logo and User Info */}
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex justify-center mb-4">
            <img
              src={Logo}
              alt="Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <div className="text-center">
            <h2 className="font-medium text-lg text-gray-800 dark:text-white">
              {userName}{" "}
              <span
                className="text-gray-400 text-xs cursor-pointer hover:underline"
                onClick={() => handleMenuClick("/user-profile")}
              >
                Edit
              </span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userType}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isActive("/chat")
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700"
                )}
                onClick={() => handleMenuClick("/chat")}
                aria-label="Navigate to Chats"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chats
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isActive("/user-notification")
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700"
                )}
                onClick={() => handleMenuClick("/user-notification")}
                aria-label="Navigate to Notifications"
              >
                <Bell className="mr-2 h-5 w-5" />
                Notification
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isActive("/user-mettings")
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700"
                )}
                onClick={() => handleMenuClick("/user-mettings")}
                aria-label="Navigate to Meetings"
              >
                <Users className="mr-2 h-5 w-5" />
                Meetings
              </Button>
            </li>
            <li>
              {/* Settings Menu with Submenu */}
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start flex items-center",
                  isActive("/settings") ||
                    isActive("/user-profile") ||
                    isActive("/membership")
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700"
                )}
                onClick={toggleSettingsMenu}
                aria-expanded={isSettingsOpen}
                aria-label="Toggle Settings menu"
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
                <ChevronDown
                  className={cn(
                    "ml-auto h-5 w-5 transition-transform",
                    isSettingsOpen ? "rotate-180" : ""
                  )}
                />
              </Button>
              {/* Submenu */}
              <ul
                className={cn(
                  "ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                  isSettingsOpen ? "max-h-40" : "max-h-0"
                )}
              >
                <li>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm",
                      isActive("/user-profile")
                        ? "bg-blue-200 text-blue-800 hover:bg-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
                    )}
                    onClick={() => handleMenuClick("/user-profile")}
                    aria-label="Navigate to Profile"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm",
                      isActive("/membership")
                        ? "bg-blue-200 text-blue-800 hover:bg-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
                    )}
                    onClick={() => handleMenuClick("/membership")}
                    aria-label="Navigate to Membership"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Membership
                  </Button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start bg-blue-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-gray-600"
            onClick={() => {
              setIsLogoutModal(true);
            }}
            aria-label="Logout"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModal}
        onClose={() => setIsLogoutModal(false)}
      />
    </>
  );
}
