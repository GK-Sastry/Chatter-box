import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../Context/LoadingContext.jsx"; // Use the global loading context
import axios from "axios";
import "../CSS/common_auth.css";

const LoginForm = () => {
  const { setLoading } = useLoading(); // Access global loading context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true); // Set loading state to true for form submission
    setLoading(true); // Set global loading state to true

    if (!email || !password) {
      alert("Please fill in all fields.");
      setLoadingState(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert(`Login Successful! Welcome ${data.name}`);
      localStorage.setItem("userInfo", JSON.stringify(data)); // Save user info to localStorage
      setLoadingState(false);
      setLoading(false); // Set loading to false after login
      navigate("/chats"); // Navigate to chats page after successful login
    } catch (error) {
      alert(
        "Login Failed: " +
          (error.response?.data?.message || "An error occurred.")
      );
      setLoadingState(false);
      setLoading(false); // Set loading to false if error occurs
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={loadingState}>
          {loadingState ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
