import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Edit, Trash2, Save, X, Image as ImageIcon } from "lucide-react";

const Post = ({ post, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption);
  const [editedImage, setEditedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(post.media?.[0] || ""); // ✅ Fix: Use first media item

  const getAvatarText = (name) => (name ? name.trim().charAt(0).toUpperCase() : "?");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // ✅ Show preview of selected image
    }
  };

  // Handle edit submit
  const handleEditSubmit = () => {
    onEdit(post._id, editedCaption, editedImage);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md relative">
      {/* User Info & Three-dot Menu */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {post.user?.avatar ? (
              <img
                src={post.user.avatar}
                alt={post.user?.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {getAvatarText(post.user?.name)}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base text-gray-900">{post.user?.name || "Anonymous"}</p>
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-800">
                {format(new Date(post.createdAt), "MMM d, yyyy")}
              </span>
              <span> • </span>
              <span className="font-medium text-gray-800">
                {format(new Date(post.createdAt), "h:mm a")}
              </span>
            </div>
          </div>
        </div>

        {/* Three-dot menu */}
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-100">
            <MoreHorizontal size={20} />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg z-50 border">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setMenuOpen(false);
                  setIsEditing(true);
                }}
              >
                <Edit size={16} className="mr-2" /> Edit Post
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(post._id);
                }}
              >
                <Trash2 size={16} className="mr-2" /> Delete Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="p-3 sm:p-4">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              className="w-full p-2 border rounded-md"
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
            />
            <label className="flex items-center space-x-2 cursor-pointer text-blue-600">
              <ImageIcon size={18} />
              <span>Select Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {previewImage && (
              <img src={previewImage} alt="Preview" className="w-full max-h-[300px] object-cover rounded-lg" />
            )}
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded flex items-center" onClick={handleEditSubmit}>
                <Save size={16} className="mr-1" /> Save
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded flex items-center"
                onClick={() => setIsEditing(false)}
              >
                <X size={16} className="mr-1" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap mb-3">{post.caption}</p>
        )}

        {/* Post Image (Fix: Handle multiple images) */}
        {!isEditing && post.media && post.media.length > 0 && (
          <div className="w-full max-h-[500px] flex justify-center">
            {post.media.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post media ${index + 1}`}
                className="w-full max-h-[500px] object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
