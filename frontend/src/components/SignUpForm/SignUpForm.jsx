import React, { useState } from "react";
import "../common.css"; // Import the CSS file

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log({ name, email, password, profilePic });
    alert("Sign-up successful! Please check your email for verification.");
  };

  return (
    <div className="card">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="form">
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
        <div className="input-group">
          <label>Confirm Password:</label>
          <div style={{ position: "relative" }}>
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              required
            />
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="password-toggle-button"
            >
              {confirmPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="input-group">
          <label>Profile Picture:</label>
          <input
            type="file"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="file-input"
          />
        </div>
        <button type="submit" className="submit-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
