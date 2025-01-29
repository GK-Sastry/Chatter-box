import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Chatter-Box</h1>
      <p className="homepage-tagline">Where Chats Collide Non stop 😉</p>

      <div className="button-container">
        <button
          className="homepage-button"
          title="New To Chatter Box, please SignUp"
          onClick={() => navigate("/signup")}
          //
        >
          Sign Up
        </button>
        <button
          className="homepage-button"
          title="Already a user, please Login"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default HomePage;
