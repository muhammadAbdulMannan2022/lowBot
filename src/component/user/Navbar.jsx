import { Bell, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function Navbar() {
  const [theme, setTheme] = useState("system");
  const [isDark, setIsDark] = useState(false); // ⬅️ Added this
  const [notifications, setNotifications] = useState([]);
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
      setIsDark(true); // ⬅️ Set dark mode state
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false); // ⬅️ Set light mode state
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
      `ws://192.168.10.124:3100/ws/api/v1/notification/?Authorization=Bearer ${token}`
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
    // console.log(notifications);

    return () => {
      if (notifyWs.current) {
        notifyWs.current.close();
      }
    };
  }, [token]);

  return (
    <header className="bg-white dark:bg-gray-800 fixed z-40 top-0 border-t-[20px] w-full border-[#C3DAEF] py-2 px-4 flex justify-end items-center border-b dark:border-[#1e293b] transition-colors duration-300 md:justify-between">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
        className="mr-4 w-14 h-8 flex items-center rounded-full bg-blue-600 dark:bg-blue-800 p-1 transition-colors duration-300"
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
            isDark ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>

      {/* Notification + User Info */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-200" />
          {notifications.length > 0 && (
            <div className="absolute w-5 h-5 flex items-center justify-center bg-blue-400 text-white rounded-full -top-2 -right-2 text-xs">
              {notifications.length > 9 ? "9+" : notifications.length}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 border">
            <AvatarImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Desktop%20-%20489-uXtSfwFxEGp28xQRAlXpi6iTA8vhbf.png"
              alt="User"
            />
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-800 dark:text-white">
            Cameron
          </span>
          <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
