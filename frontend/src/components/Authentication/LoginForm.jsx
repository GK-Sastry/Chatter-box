import React, { useState } from "react";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // For page redirection
import "../common.css"; // Import the CSS file

const LoginForm = () => {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility toggle
  const [loading, setLoading] = useState(false); // Loading state to show when API is being called
  const navigate = useNavigate(); // useNavigate hook for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      alert("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      // Send login request to backend (replace with your actual API endpoint)
      const { data } = await axios.post(
        "/api/user/login", // Backend URL to handle login
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert(`Login Successful! Welcome ${data.name}`); // Success message with name
      localStorage.setItem("userInfo", JSON.stringify(data)); // Store user data in localStorage
      setLoading(false);
      navigate("/chats"); // Redirect to the dashboard or another page
    } catch (error) {
      alert(
        "Login Failed: " +
          (error.response?.data?.message || "An error occurred.")
      );
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <div style={{ position: "relative" }}>
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="password-toggle-button"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
