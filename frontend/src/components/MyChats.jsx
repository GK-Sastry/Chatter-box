import React, { useEffect, useState } from "react";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import AddIcon from "../assets/icons.svg"; // Assuming AddIcon is an SVG or image in your assets

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="my-chats-container">
      <div className="my-chats-header">
        <span>My Chats</span>
        <GroupChatModal>
          <button className="new-group-chat-btn">
            <AddIcon />
            New Group Chat
          </button>
        </GroupChatModal>
      </div>

      <div className="chats-list">
        {chats ? (
          <div className="chats">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${
                  selectedChat === chat ? "selected" : ""
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <span>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </span>
                {chat.latestMessage && (
                  <span className="chat-latest-message">
                    <b>{chat.latestMessage.sender.name}:</b>{" "}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
