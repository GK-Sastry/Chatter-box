import React, { useState } from "react";
import "../common.css"; // Import the CSS file

const LoginForm = () => {
  const [emailOrName, setEmailOrName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ emailOrName, password });
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label>Name or Email:</label>
          <input
            type="text"
            value={emailOrName}
            onChange={(e) => setEmailOrName(e.target.value)}
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
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
