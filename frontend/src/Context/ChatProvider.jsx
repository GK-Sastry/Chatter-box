// ChatProvider.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatContext from "./Chat_Context.js"; // Import the created context
import { useLoading } from "./LoadingContext.jsx"; // Import the loading context

const ChatProvider = ({ children }) => {
  const { loading } = useLoading(); // Get loading state from global context
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    // Skip redirect logic if loading is true
    if (loading) return;

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      console.log("log from ChatProvider when No userInfo");
      navigate("/"); // Redirect to home if userInfo is not found
    }
  }, [navigate, loading]); // Depend on loading state

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to access the context
export const ChatState = () => {
  return React.useContext(ChatContext);
};

export default ChatProvider;
