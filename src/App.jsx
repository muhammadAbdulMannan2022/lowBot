import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "./component/AuthContext";
import Login from "./authentication/Login";
import "./App.css";
import LandingPage from "./page/LandingPage";
import RegistrationPage from "./authentication/Registration";
import ActivateEmail from "./authentication/ActivateEmail";
import OtpVerification from "./authentication/OtpVerification";
import ResetPassword from "./authentication/ResetPassword";
import ForgetEmail from "./authentication/ForgetEmail";
import UserManagement from "./page/admin/UserManagement";
import Notifications from "./page/admin/Notifications";
import UserChatPage from "./page/user/UserChatPage";
import SupportChat from "./page/admin/SupportChat";
import MeetingDashboard from "./page/admin/MeetingDashboard";
import Profile from "./page/admin/Profile";
import EditProfileForm from "./page/admin/EditProfile";
import PricingTable from "./page/user/Pricing";
import UserProfile from "./page/user/UserProfile";
import UserEditProfile from "./page/user/UserEditProfile";
import UserMettings from "./page/user/UserMettings";
import UserNotifications from "./page/user/UserNotifications";
import wsManager from "./socket/socket";
import PrivateRoute from "./private/Private";
import AdminPrivate from "./private/AdminPrivate";
import UserPrivate from "./private/UserPrivate";

function App() {
  const [theme, setTheme] = useState("system");
  const chatWs = useRef(null);
  const token = localStorage.getItem("token");

  const handleMessage = (m) => {
    console.log("Chat message received:", m);
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    } else {
      // system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
        setTheme("system");
      } else {
        document.documentElement.classList.remove("dark");
        setTheme("system");
      }
    }
  }, [theme]);
  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");

    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };
  useEffect(() => {
    if (!token) return;

    // Initialize chat WebSocket
    // const chatRoute = "/ws/v1/api/chat/";
    // wsManager.connect({ route: chatRoute, token });
    // wsManager.addListener(chatRoute, handleMessage);

    chatWs.current = new WebSocket(
      `wss://devidcyrus.duckdns.org/ws/api/v1/chat/?Authorization=Bearer ${token}`
    );

    // next one
    chatWs.current.onopen = () => {
      console.log("chat WebSocket connected");
    };

    chatWs.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleMessage(data);
    };

    chatWs.current.onerror = (err) => {
      console.error("chat WebSocket error:", err);
    };

    chatWs.current.onclose = () => {
      console.log("chat WebSocket closed");
    };

    return () => {
      if (chatWs.current) {
        chatWs.current.close();
      }
    };
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <UserPrivate>
              <Login />
            </UserPrivate>
          }
        />
        <Route
          path="/signup"
          element={
            <UserPrivate>
              <RegistrationPage />
            </UserPrivate>
          }
        />
        <Route path="/forget-password" element={<ForgetEmail />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <AdminPrivate>
              <UserManagement />
            </AdminPrivate>
          }
        />
        <Route
          path="/notification"
          element={
            <AdminPrivate>
              <Notifications />
            </AdminPrivate>
          }
        />
        <Route
          path="/user-notification"
          element={
            <PrivateRoute>
              <UserNotifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <UserChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <PrivateRoute>
              <UserChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/supportchat"
          element={
            <AdminPrivate>
              <SupportChat />
            </AdminPrivate>
          }
        />
        <Route
          path="/supportchat/:id"
          element={
            <AdminPrivate>
              <SupportChat />
            </AdminPrivate>
          }
        />
        <Route
          path="/mettings"
          element={
            <AdminPrivate>
              <MeetingDashboard />
            </AdminPrivate>
          }
        />
        <Route
          path="/user-mettings"
          element={
            <PrivateRoute>
              <UserMettings />
            </PrivateRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/user-profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <AdminPrivate>
              <EditProfileForm />
            </AdminPrivate>
          }
        />
        <Route
          path="/user-edit-profile"
          element={
            <PrivateRoute>
              <UserEditProfile />
            </PrivateRoute>
          }
        />
        <Route path="/membership" element={<PricingTable />} />
      </Routes>
    </BrowserRouter>
  );
}

const ProtectedRoute = ({ component }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? component : <Navigate to="/" replace />;
};

export default App;
