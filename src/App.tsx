import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import LoginScreen from "./widgets/LoginWidget";
import PDFLibrary from "./widgets/LibraryWidget";

const flaskServer = import.meta.env.VITE_FLASK_SERVER_IP || 'http://localhost';
const flaskPORT = import.meta.env.VITE_FLASK_PORT || 5000;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for authentication token in cookies on page load
  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login
  const handleLogin = async (username: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${flaskServer}:${flaskPORT}/login`, {
        method: "POST",
        credentials: "include", // Important for cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Handle logout
  const handleLogout = async (): Promise<void> => {
    try {
      await fetch(`${flaskServer}:${flaskPORT}/logout`, {
        method: "POST",
        credentials: "include",
      });

      setIsAuthenticated(false);
      Cookies.remove("auth_token");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return isAuthenticated ? (
    <PDFLibrary onLogout={handleLogout} />
  ) : (
    <LoginScreen onLogin={handleLogin} />
  );
};

export default App;
