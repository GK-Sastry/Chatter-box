import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getSender } from "../../config/ChatLogics.js";
import UserListItem from "../userAvatar/UserListItem.jsx";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../ChatLoading";
import "../CSS/SideDrawer.css";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Controls the search drawer

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/"); // Navigate to home on logout
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please enter something in search", {
        position: "top-left",
        autoClose: 5000,
        closeOnClick: true,
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error occurred! Failed to load search results", {
        position: "bottom-left",
        autoClose: 5000,
        closeOnClick: true,
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setIsOpen(false); // Close search drawer after selecting chat
    } catch (error) {
      toast.error("Error fetching the chat: " + error.message, {
        position: "bottom-left",
        autoClose: 5000,
        closeOnClick: true,
      });
    }
  };

  return (
    <>
      <div className="side-drawer">
        <button className="search-button" onClick={() => setIsOpen(true)}>
          <i className="fas fa-search"></i>
          <span className="search-text">Search User</span>
        </button>
        <span className="app-title">Talk-A-Tive</span>
        <div className="user-menu">
          <div className="notification-bell">
            <i className="bell-icon fas fa-bell"></i>
          </div>
          <div className="user-avatar">
            <img
              className="avatar"
              src={user.pic}
              alt={user.name}
              onClick={logoutHandler}
            />
            <div className="dropdown">
              <button className="dropdown-button">{user.name}</button>
              <div className="dropdown-content">
                <button onClick={logoutHandler}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Drawer */}
      {isOpen && (
        <div className="search-drawer open">
          <div className="search-drawer-header">
            Search Users
            <button className="close-button" onClick={() => setIsOpen(false)}>
              X
            </button>
          </div>
          <div className="search-drawer-body">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button className="search-button" onClick={handleSearch}>
              Go
            </button>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <div className="loading-spinner">Loading...</div>}
          </div>
        </div>
      )}
    </>
  );
}

export default SideDrawer;
