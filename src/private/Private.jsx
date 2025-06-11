// components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const role = localStorage.getItem("role");

  // If role doesn't match, redirect to home or login
  if (role !== "user") {
    return <Navigate to="/supportchat" replace />;
  }

  // If role matches, allow access
  return children;
};

export default PrivateRoute;
