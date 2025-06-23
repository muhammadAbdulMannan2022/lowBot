import { Bell, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../axiosInstance";

function Navbar() {
  const [theme, setTheme] = useState("system");
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const notifyWs = useRef(null);
  const token = localStorage.getItem("token");
  const location = useLocation();

  const handleNotifications = (notify) => {
    if (location.pathname !== "/user-notification") {
      setNotifications((prev) => [...prev, notify]);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    let activeTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(activeTheme);

    if (activeTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    // WebSocket for notifications
    notifyWs.current = new WebSocket(
      `wss://leapapp-d8gtazf2e9aygcc6.canadacentral-01.azurewebsites.net/ws/api/v1/notification/?Authorization=Bearer ${token}`
    );

    notifyWs.current.onopen = () => {
      console.log("Notification WebSocket connected");
    };

    notifyWs.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleNotifications(data);
    };

    notifyWs.current.onerror = (err) => {
      console.error("Notification WebSocket error:", err);
    };

    notifyWs.current.onclose = () => {
      console.log("Notification WebSocket closed");
    };

    return () => {
      if (notifyWs.current) {
        notifyWs.current.close();
      }
    };
  }, [token]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/auth/profile/");
        setProfile(res.data);
      } catch (error) {
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 fixed z-40 top-0 border-t-[20px] w-full border-[#C3DAEF] py-2 px-4 flex justify-end items-center border-b dark:border-[#1e293b] transition-colors duration-300 md:justify-between">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
        className="mr-4 w-10 h-6 flex items-center rounded-full bg-blue-600 dark:bg-blue-800 transition-colors duration-300"
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
            isDark ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>

      {/* Notification + User Info */}
      <div className="flex items-center gap-4">
        <Link to="/user-notification" className="relative">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-200" />
          {notifications.length > 0 && (
            <div className="absolute w-5 h-5 flex items-center justify-center bg-blue-400 text-white rounded-full -top-2 -right-2 text-xs">
              {notifications.length > 9 ? "9+" : notifications.length}
            </div>
          )}
        </Link>
        <Link to={"/user-profile"} className="flex items-center gap-2">
          <Avatar className="w-8 h-8 border">
            {/* {console.log(profile)} */}
            <img
              src={
                profile?.profile_picture
                  ? `https://leapapp-d8gtazf2e9aygcc6.canadacentral-01.azurewebsites.net${profile.profile_picture}`
                  : undefined
              }
              alt="User"
            />
            <AvatarFallback>
              {profile?.first_name?.[0] || ""}
              {profile?.last_name?.[0] || ""}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-800 dark:text-white">
            {(profile?.first_name || "") +
              (profile?.last_name ? " " + profile.last_name : "")}
          </span>
          <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
