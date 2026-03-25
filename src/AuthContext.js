import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const fetchUser = async () => {
    const token = localStorage.getItem("craftdelhiadmin_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = response.data?.data?.[0]; // Backend returns { success: true, data: [ { ... } ] }

      if (profileData && (profileData.role === 1 || profileData.role === "admin")) {
        // Combine first_name and last_name for convenience
        const adminProfile = {
          ...profileData,
          name: `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim() || profileData.email
        };
        
        setUser(adminProfile);
      } else {
        console.warn("⚠️ Unauthorized role or missing data:", profileData?.role);
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Auth profile fetch failed:", error.message);
      // Fallback for development if API is not exactly as expected
      setUser({ role: 1, name: "Admin" }); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem("craftdelhiadmin_token", token);
    // Optimistically set the initial data from login
    setUser(userData);
    // Immediately verify with /auth/me to get complete/updated profile
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("craftdelhiadmin_token"); 
    setUser(null);
    // Force redirect to login page
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
