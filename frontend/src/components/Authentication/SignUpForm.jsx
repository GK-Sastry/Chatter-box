import React, { useState } from "react";
import "../common.css"; // Import the CSS file
import axios from "axios";
import CloudinaryUpload from "./CloudinaryUpload.jsx"; // Import the Cloudinary upload component

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      alert("Please Fill all the Fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords Do Not Match!");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/register", // Endpoint for regular sign-up (if not using Google)
        {
          name,
          email,
          password,
          profilePic, // Send the profile picture URL to the backend
        },
        config
      );

      console.log(data);
      alert("Registration Successful!");
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      console.error("Error Occurred:", error);
      alert("Error Occurred! Please try again.");
    }
  };

  return (
    <div className="card">
      <h2 className="form-title">Sign Up</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Enter Your Name"
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
            placeholder="Enter Your Email"
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
            placeholder="Enter Password"
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
            placeholder="Confirm Password"
            required
          />
        </div>

        <CloudinaryUpload setProfilePic={setProfilePic} />

        <button type="submit" className="submit-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
