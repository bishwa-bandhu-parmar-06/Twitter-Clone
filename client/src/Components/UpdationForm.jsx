import React, { useState } from "react";
import { updateUserProfile } from "../utils/api";
import API from "../utils/axiosInstance"

const UpdationForm = ({ user, setUser, setIsEditOpen, setUserUpdated }) => {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [profileCaption, setProfileCaption] = useState(user.profileCaption || "");

  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const token = localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("profileCaption", profileCaption);

    if (profileImage) {
        console.log("Uploading profile image:", profileImage.name);
        formData.append("avatar", profileImage);
    }

    if (bannerImage) {
        console.log("Uploading banner image:", bannerImage.name);
        formData.append("banner", bannerImage);
    }

    try {
        const response = await API.put("/api/users/update-profile", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Updated User Data:", response.data.user);
        setUser(response.data.user);
        setUserUpdated((prev) => !prev);
        setIsEditOpen(false);
    } catch (error) {
        console.error("Profile update failed:", error.response?.data || error.message);
    }
};




  
  
  

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-white mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
            placeholder="Name"
          />

          <input 
            type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
            placeholder="Username"
          />

          <textarea 
            value={profileCaption} onChange={(e) => setProfileCaption(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
            placeholder="Caption"
          ></textarea>

          <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} className="w-full text-white" />
          <input type="file" onChange={(e) => setBannerImage(e.target.files[0])} className="w-full text-white" />

          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Update</button>
            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 bg-red-500 text-white rounded-lg">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdationForm;
