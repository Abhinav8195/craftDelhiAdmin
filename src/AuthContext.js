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

        if (response.data.role === "admin") {
          setUser(response.data);
         
        } else {
          setUser(null);
          localStorage.removeItem("craftdelhiadmin_token");
        }
      } catch (error) {
        console.error("❌ Auth error:", error);
        setUser(null);
        localStorage.removeItem("craftdelhiadmin_token");
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
