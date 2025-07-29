import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCheck = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("craftdelhiadmin_token");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (window.location.pathname !== "/") {
        navigate("/"); 
      }
    }
  }, [navigate, setIsAuthenticated]);

  return null;
};

export default AuthCheck;
