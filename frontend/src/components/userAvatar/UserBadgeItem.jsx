import React from "react";
import "./UserBadgeItem.css"; // Adjust path as necessary

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <div className="user-badge-item" onClick={handleFunction}>
      <span className="user-name">
        {user.name}
        {admin === user._id && <span className="admin-tag"> (Admin)</span>}
      </span>
      <span className="close-icon">×</span>
    </div>
  );
};

export default UserBadgeItem;
