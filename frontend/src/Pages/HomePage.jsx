import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "../Context/LoadingContext.jsx"; // Import the Loading context
import "./HomePage.css";

const HomePage = () => {
  const { setLoading } = useContext(LoadingContext); // Access setLoading from context
  const navigate = useNavigate();

  // Check if user is logged in (based on localStorage)
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // Redirect to chats if user is already logged in
    if (userInfo) {
      console.log("user info Present");
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Chatter-Box</h1>
      <p className="homepage-tagline">Where Chats Collide Non stop 😉</p>

      <div className="button-container">
        <button
          className="homepage-button"
          title="New To Chatter Box? Please SignUp"
          onClick={() => {
            setLoading(true); // Set loading before navigating
            console.log("Navigating to /signup");
            navigate("/signup", { replace: true });
          }}
        >
          Sign Up
        </button>
        <button
          className="homepage-button"
          title="Already a user? Please Login"
          onClick={() => {
            setLoading(true); // Set loading before navigating
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
