import { useState } from "react";
import { toast } from "react-toastify";
import "../CSS/ProfileModal.css";

const ProfileModal = ({ user, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <button className="view-button" onClick={onOpen}>
          <i className="fas fa-eye"></i>
        </button>
      )}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{user.name}</h2>
              <button className="close-button" onClick={onClose}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <img className="profile-pic" src={user.pic} alt={user.name} />
              <p className="user-email">Email: {user.email}</p>
            </div>
            <div className="modal-footer">
              <button className="close-button" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;
