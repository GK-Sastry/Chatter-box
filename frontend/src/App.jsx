import React from "react";
import { Routes, Route } from "react-router-dom"; // Only import Routes and Route
import HomePage from "./Pages/HomePage.jsx";
import LoginForm from "./components/LoginForm/LoginForm.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignUpForm />} />
    </Routes>
  );
};

export default App;
