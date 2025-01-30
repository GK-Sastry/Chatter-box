import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import "../CSS/UpdateGroupChatModal.css";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error Occurred! Failed to Load the Search Results", {
        position: "bottom-left",
        autoClose: 5000,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast.error(`Error Occurred! ${error.response.data.message}`, {
        position: "bottom",
        autoClose: 5000,
        closeOnClick: true,
      });
    } finally {
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already in group!", {
        position: "bottom",
        autoClose: 5000,
        closeOnClick: true,
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone!", {
        position: "bottom",
        autoClose: 5000,
        closeOnClick: true,
      });
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast.error(`Error Occurred! ${error.response.data.message}`, {
        position: "bottom",
        autoClose: 5000,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone!", {
        position: "bottom",
        autoClose: 5000,
        closeOnClick: true,
      });
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (error) {
      toast.error(`Error Occurred! ${error.response.data.message}`, {
        position: "bottom",
        autoClose: 5000,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <button className="view-button" onClick={onOpen}>
        <i className="fas fa-eye"></i>
      </button>

      <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>{selectedChat.chatName}</h2>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="user-badges">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </div>
            <div className="form-control">
              <input
                type="text"
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className="input"
              />
              <button
                className="update-button"
                onClick={handleRename}
                disabled={renameloading}
              >
                {renameloading ? "Updating..." : "Update"}
              </button>
            </div>
            <div className="form-control">
              <input
                type="text"
                placeholder="Add User to group"
                onChange={(e) => handleSearch(e.target.value)}
                className="input"
              />
            </div>

            {loading ? (
              <div className="spinner">Loading...</div>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </div>
          <div className="modal-footer">
            <button className="leave-button" onClick={() => handleRemove(user)}>
              Leave Group
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateGroupChatModal;
