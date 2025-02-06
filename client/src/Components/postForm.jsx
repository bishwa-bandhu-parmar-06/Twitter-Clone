import React, { useState, useEffect } from "react";
import { FaImage, FaVideo, FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import axios from 'axios';

const PostForm = ({ onPostSubmit }) => {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userData, setUserData] = useState(null);
  const backendUri = import.meta.env.VITE_BACKEND_URI || "http://localhost:3000";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await axios.get(`${backendUri}/api/users/get-current-user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const ProfileImage = ({ user }) => {
    if (!user) return null;

    // If no avatar, show initials
    return (
      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium border-2 border-gray-200">
        {getInitials(user.name)}
      </div>
    );
  };

  const handleEmojiClick = (emoji) => {
    setCaption(caption + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0];
      setMedia(file);
      setMediaType(fileType);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!caption.trim() && !media) {
        return; // Don't submit if both caption and media are empty
      }

      // Log what we're trying to submit
      console.log('Submitting post with:', { caption, media });

      if (onPostSubmit) {
        await onPostSubmit(caption, media);
        
        // Clear form only after successful submission
        setCaption('');
        setMedia(null);
        setMediaType(null);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm transition-all duration-300">
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-4">
          <ProfileImage user={userData} />
          <div>
            <p className="font-medium text-gray-800">
              {userData ? `What's on your mind, ${userData.name}?` : "What's on your mind?"}
            </p>
          </div>
        </div>

        {/* Text Input */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
          rows="3"
        />

        {/* Display Selected Media */}
        {media && (
          <div className="mt-4 relative rounded-lg overflow-hidden bg-gray-100">
            {mediaType === "image" && (
              <img
                src={URL.createObjectURL(media)}
                alt="Selected"
                className="w-full h-auto max-h-[400px] object-contain"
              />
            )}
            {mediaType === "video" && (
              <video
                controls
                className="w-full h-auto max-h-[400px]"
                src={URL.createObjectURL(media)}
              />
            )}
            <button
              onClick={() => {
                setMedia(null);
                setMediaType(null);
              }}
              className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all duration-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <div className="flex items-center space-x-2">
            {/* Image Upload */}
            <label className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors duration-300 group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <FaImage className="text-xl text-blue-500 group-hover:text-blue-600" />
            </label>

            {/* Video Upload */}
            <label className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors duration-300 group">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <FaVideo className="text-xl text-green-500 group-hover:text-green-600" />
            </label>

            {/* Emoji Picker */}
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 group"
              >
                <FaSmile className="text-xl text-yellow-500 group-hover:text-yellow-600" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-50">
                  <div className="shadow-xl rounded-lg overflow-hidden">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Post Button */}
          <button
            onClick={handlePostSubmit}
            disabled={!caption.trim() && !media}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
