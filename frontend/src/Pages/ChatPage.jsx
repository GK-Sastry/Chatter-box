import { useState } from "react";
import Chatbox from "../components/ChatBox.jsx";
import MyChats from "../components/MyChats.jsx";
import SideDrawer from "../components/miscellaneous/SideDrawer.jsx";
import ChatContext from "../Context/Chat_Context.js";
import { ChatState } from "../Context/ChatProvider.jsx";
import "./ChatPage.css"; // Importing the custom CSS

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div className="chat-page">
      {user && <SideDrawer />}
      <div className="chat-container">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
};

export default Chatpage;
