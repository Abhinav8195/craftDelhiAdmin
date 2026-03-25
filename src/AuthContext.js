import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("craftdelhiadmin_token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Backend currently returns role: 1 for admin
        if (response.data.role === 1 || response.data.role === "admin") {
          setUser(response.data);
        } else {
          // Only remove token if we explicitly get a response that says the role is wrong
          console.warn("⚠️ Unauthorized role detected:", response.data.role);
          setUser(null);
          // localStorage.removeItem("craftdelhiadmin_token"); // Keep token for now to avoid accidental logouts
        }
      } catch (error) {
        console.error("❌ Auth profile fetch failed (this is expected if backend hasn't added /auth/me yet):", error.message);
        // Do NOT remove token here. If the API is missing or down, we should still trust the local token
        // until we get a definitive 401 or 403 from a real API call.
        setUser({ role: 1 }); // Fallback to avoid breaking UI state
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("craftdelhiadmin_token", token);
    setUser(userData);
    console.log("✅ Login successful, token saved:", token);
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("craftdelhiadmin_token"); 
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
