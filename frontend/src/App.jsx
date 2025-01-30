import React, { useState } from "react";
import { Routes, Route } from "react-router-dom"; // Only import Routes and Route
import HomePage from "./Pages/HomePage.jsx";
import LoginForm from "./components/Authentication/LoginForm.jsx";
import SignUpForm from "./components/Authentication/SignUpForm.jsx";
import ChatProvider from "./Context/ChatProvider.jsx"; // Import your provider
import ChatPage from "./Pages/ChatPage.jsx";
import { LoadingProvider } from "./Context/LoadingContext.jsx"; // Import LoadingProvider

const App = () => {
  const [loading, setLoading] = useState(false); // State for loading

  return (
    <LoadingProvider>
      {" "}
      {/* Provide global loading state */}
      <ChatProvider loading={loading}>
        {" "}
        {/* Pass loading state to ChatProvider */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </ChatProvider>
    </LoadingProvider>
  );
};

export default App;
