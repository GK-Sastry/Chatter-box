import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../Context/LoadingContext.jsx";
import axios from "axios";
import "../CSS/common_auth.css";

const SignUpForm = () => {
  const { setLoading } = useLoading(); // Access global loading context
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [picLoading, setPicLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPicLoading(true); // Set loading for picture
    setLoading(true); // Set global loading state to true

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      setPicLoading(false);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setPicLoading(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, profilePic },
        { headers: { "Content-type": "application/json" } }
      );

      alert("Registration Successful!");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false); // Reset loading state
      setLoading(false); // Reset global loading state
      navigate("/chats"); // Redirect to chats after sign-up
    } catch (error) {
      alert("Error occurred! Please try again.");
      setPicLoading(false);
      setLoading(false); // Reset global loading state on error
    }
  };

  return (
    <div className="card">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
          />
        </div>
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
        <div className="input-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          {picLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
