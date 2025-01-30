import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div onClick={handleFunction} className="user-list-item">
      <div className="avatar">
        <img src={user.pic} alt={user.name} className="avatar-img" />
      </div>
      <div className="user-info">
        <p className="user-name">{user.name}</p>
        <p className="user-email">
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
