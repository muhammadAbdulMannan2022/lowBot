import React from "react";
import { Navigate } from "react-router";

const AdminPrivate = ({ children }) => {
  const role = localStorage.getItem("role");

  // If role doesn't match, redirect to home or login
  if (role === "user") {
    return <Navigate to="/chat" replace />;
  }

  // If role matches, allow access
  return children;
};

export default AdminPrivate;
