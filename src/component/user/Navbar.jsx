import { Bell, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const notifyWs = useRef(null);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const handleNotifications = (notify) => {
    console.log("Current path:", location.pathname);
    if (location.pathname !== "/user-notification") {
      console.log("Notification received:", notify);
      setNotifications((prev) => [...prev, notify]);
    }
  };

  useEffect(() => {
    // Initialize notification WebSocket
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
    /* Top Navigation */
    <header className="bg-white fixed z-40 top-0 border-t-[20px] w-full border-[#C3DAEF] py-2 px-4 flex justify-end items-center border-b">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          {notifications.length > 0 && (
            <div className="absolute w-5 h-5 flex items-center justify-center bg-blue-400 text-white rounded-full -top-2 -right-2 text-xs">
              {notifications.length > 9 ? "9+" : notifications.length}
            </div>
          )}
          {console.log(notifications.length)}
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 border">
            <AvatarImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Desktop%20-%20489-uXtSfwFxEGp28xQRAlXpi6iTA8vhbf.png"
              alt="User"
            />
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
          <span className="font-medium">Cameron</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
