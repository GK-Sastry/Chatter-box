// CloudinaryUpload.js
import { useState } from "react";

const CloudinaryUpload = ({ setProfilePic }) => {
  const [picLoading, setPicLoading] = useState(false);

  const postDetails = async (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      alert("Please Select an Image!");
      setPicLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Chat-app");
      data.append("cloud_name", "dsvfu5bxi");
      fetch("https://api.cloudinary.com/v1_1/dsvfu5bxi/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.log("Cloudinary error:", data.error);
          } else {
            setProfilePic(data.url.toString()); // Store the uploaded image URL
            console.log("Uploaded image URL:", data.url.toString());
          }
          setPicLoading(false);
        })
        .catch((err) => {
          console.log("Error uploading image:", err);
          setPicLoading(false);
        });
    } else {
      alert("Please Select a valid Image!");
      setPicLoading(false);
      return;
    }
  };

  return (
    <div className="input-group">
      <label>Profile Picture:</label>
      <input
        type="file"
        onChange={(e) => postDetails(e.target.files[0])}
        className="file-input"
        accept="image/*"
      />
      {picLoading && <p>Uploading...</p>}
    </div>
  );
};

export default CloudinaryUpload;
