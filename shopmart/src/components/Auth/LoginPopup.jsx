import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import the useAuth hook
import "./auth.css";

// LoginPopup now takes an additional `onLoginSuccess` prop
const LoginPopup = ({ onClose, onLoginSuccess }) => {
  const { login } = useAuth(); // Get the login function from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Both fields are required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Login failed.");
      } else {
        // SUCCESS! Use the login function from context
        login(data.user); // The backend sends back a user object
        onClose(); // Close the popup
      }
    } catch (err) {
      setErrorMsg("Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup-backdrop">
      <div className="login-popup">
        <button className="close-btn cursor-pointer" onClick={onClose}>
          ×
        </button>
        <h2>Login</h2>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="register-link mt-3">
          Don't have an account? <Link to="/register" onClick={onClose}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;