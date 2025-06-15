import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function UserOnly({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const token = localStorage.getItem("token");

    if (accessToken || refreshToken || token) {
      // User is authenticated — show content
      setChecking(false);
    } else {
      // Not authenticated — redirect away
      navigate("/"); // or "/"
    }
  }, [navigate]);

  if (checking) return null;
  return <>{children}</>;
}
