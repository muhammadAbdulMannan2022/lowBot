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
    return {
      token: token || null,
      username: email || null,
      refresh_token: refresh_token || null,
      id: user_id || null,
    };
  });

  // Login function
  const login = (token, email, refresh_token, user_id) => {
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
  };

  // Logout function
  const logout = () => {
    setAuth({ token: null, email: null, refresh_token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("id");
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
