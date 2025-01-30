import React from "react";
import { ChatState } from "../Context/ChatProvider.jsx";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics.js";
import Avatar from "../assets/Avatar.png"; // You can use a custom avatar component or an image

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <div className="scrollable-chat">
      {messages &&
        messages.map((m, i) => (
          <div className="message-container" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Avatar
                className="avatar"
                name={m.sender.name}
                src={m.sender.pic}
              />
            )}
            <span
              className="message-content"
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;
