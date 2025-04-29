
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCheck = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("craftdelhiadmin_token");
      const tokenExpiry = Number(localStorage.getItem("craftdelhiadmin_tokenExpiry"));
      const currentTime = Date.now();

      if (token && tokenExpiry) {
        if (currentTime >= tokenExpiry) {
          // Token expired, logout user
          localStorage.removeItem("craftdelhiadmin_token");
          localStorage.removeItem("craftdelhiadmin_tokenExpiry");
          setIsAuthenticated(false);
          navigate("/"); // Redirect to home instead of reload
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Check every 5 seconds if the token is expired
    const interval = setInterval(checkAuth, 5000);

    return () => clearInterval(interval);
  }, [navigate, setIsAuthenticated]);

  return null; // This component does not render anything
};

export default AuthCheck;
