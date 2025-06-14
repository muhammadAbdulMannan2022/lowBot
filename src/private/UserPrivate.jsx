import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function UserPrivate({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken && refreshToken) {
      navigate("/chat");
    } else {
      setChecking(false); // allow rendering of children
    }
  }, [navigate]);

  if (checking) return null; // or a loader

  return <>{children}</>;
}
