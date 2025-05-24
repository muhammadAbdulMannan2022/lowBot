import React, { useEffect } from "react";

import { Routes, Route, Link, BrowserRouter, Navigate } from "react-router-dom";
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

function App() {
  const handleMessage = (m) => {
    console.log("message recived");
  };
  const token = localStorage.getItem("token");
  const route = "/ws/api/v1/chat/";
  useEffect(() => {
    console.log(token);
    if (token) {
      wsManager.connect({ route, token });
      wsManager.addListener(handleMessage);
    }
    return () => {
      wsManager.removeListener(handleMessage);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        ``
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/forget-password" element={<ForgetEmail />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<UserManagement />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/user-notification" element={<UserNotifications />} />
        <Route path="/chat" element={<UserChatPage />} />
        <Route path="/chat/:id" element={<UserChatPage />} />
        <Route path="/supportchat" element={<SupportChat />} />
        <Route path="/supportchat/:id" element={<SupportChat />} />
        <Route path="/mettings" element={<MeetingDashboard />} />
        <Route path="/user-mettings" element={<UserMettings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditProfileForm />} />
        <Route path="/user-edit-profile" element={<UserEditProfile />} />
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
