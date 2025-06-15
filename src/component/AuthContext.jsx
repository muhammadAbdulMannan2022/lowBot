import React, { createContext, useContext, useState, useEffect } from "react";

// Create AuthContext
const AuthContext = createContext();

// Provide AuthContext to children
export const AuthProvider = ({ children }) => {
  // Initialize auth state with localStorage values
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const refresh_token = localStorage.getItem("refresh_token");
    const user_id = localStorage.getItem("id");
    const access_token = localStorage.getItem("access_token");
    return {
      token: token || null,
      username: email || null,
      refresh_token: refresh_token || null,
      id: user_id || null,
      access_token: access_token || null,
    };
  });

  // Login function
  const login = (token, email, refresh_token, user_id, role, access_token) => {
    console.log("Login called with:", {
      token,
      email,
      refresh_token,
      user_id,
    });
    setAuth({ token, email, refresh_token, user_id });
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("id", user_id);
    localStorage.setItem("role", role);
    localStorage.setItem("access_token", access_token);
  };

  // Logout function
  const logout = () => {
    setAuth({ token: null, email: null, refresh_token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
  };

  // Check if user is authenticated
  const isAuthenticated = !!auth.token;

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing AuthContext
export const useAuth = () => useContext(AuthContext);
