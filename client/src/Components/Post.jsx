// src/Components/Post.jsx
import React, { useState, useEffect } from "react";
import { addComment, addReply, toggleLike, deletePost, editPost } from "../utils/api"; // Import the API methods
import { formatDistanceToNow, format } from 'date-fns'; // Install with: npm install date-fns
import { FaHeart, FaRegHeart, FaRegComment, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Post = ({ post, onPostDelete, onPostUpdate }) => {
  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem('userId');
  
  // Initialize state with post data
  const [liked, setLiked] = useState(post.likes?.includes(currentUserId) || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption);
  const [newMedia, setNewMedia] = useState(null);

  const isOwner = post.user?._id === currentUserId;

  // Debug logs
  useEffect(() => {
    console.log('Post user:', post.user);
    console.log('Post likes:', post.likes);
    console.log('Current user ID:', currentUserId);
  }, [post]);

  const getAvatarText = (name) => {
    if (!name) return '?';
    const trimmedName = name.trim();
    if (!trimmedName) return '?';
    console.log('Getting avatar text for:', trimmedName); // Debug log
    return trimmedName.charAt(0).toUpperCase();
  };

  const handleLike = async () => {
    try {
      await toggleLike(post._id);
      setLiked(!liked);
      setLikeCount(prevCount => liked ? prevCount - 1 : prevCount + 1);
      console.log('Like toggled:', !liked, 'New count:', likeCount); // Debug log
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error('Failed to update like');
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsLoading(true);
    try {
      const newComment = await addComment(post._id, comment);
      setComments([...comments, newComment]);
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = async (commentId, replyText) => {
    if (replyText) {
      try {
        const reply = await addReply(post._id, commentId, replyText);
        setComments((prevComments) => 
          prevComments.map((comment) => 
            comment._id === commentId ? { ...comment, replies: [...comment.replies, reply] } : comment
          )
        );
      } catch (error) {
        console.error("Failed to add reply:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post._id);
        toast.success('Post deleted successfully');
        onPostDelete(post._id); // Callback to remove post from parent component
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      setIsLoading(true);
      const updatedPost = await editPost(post._id, editedCaption, newMedia);
      onPostUpdate(updatedPost); // Callback to update post in parent component
      setIsEditing(false);
      toast.success('Post updated successfully');
    } catch (error) {
      toast.error('Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMedia(file);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      {/* User Info with Options Menu */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {post.user?.avatar ? (
              <img 
                src={post.user.avatar}
                alt={post.user?.name || 'User'}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold ${post.user?.avatar ? 'hidden' : ''}`}
            >
              {getAvatarText(post.user?.name)}
            </div>
          </div>
          <div className="flex-grow">
            <p className="font-semibold text-sm sm:text-base text-gray-900">
              {post.user?.name || 'Anonymous'}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
              <span>•</span>
              <span>{format(new Date(post.createdAt), 'h:mm a')}</span>
            </div>
          </div>
        </div>
        
        {isOwner && (
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaEllipsisV className="text-gray-500" />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <FaEdit className="text-blue-500" />
                  <span>Edit Post</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-500"
                >
                  <FaTrash />
                  <span>Delete Post</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="p-3 sm:p-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="hidden"
                id={`media-upload-${post._id}`}
              />
              <label
                htmlFor={`media-upload-${post._id}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
              >
                Change Media
              </label>
              <button
                onClick={handleEdit}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedCaption(post.caption);
                  setNewMedia(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap mb-3">
              {post.caption}
            </p>
            {post.media && post.media.length > 0 && (
              <div className="relative w-full h-auto max-h-[600px] overflow-hidden rounded-lg">
                {post.media.map((mediaUrl, index) => (
                  <img
                    key={index}
                    src={mediaUrl}
                    alt={`Post content ${index + 1}`}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-3 sm:px-4 py-2 border-t border-gray-50">
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleLike}
            className="flex items-center space-x-2 group"
          >
            {liked ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegHeart className="text-gray-500 group-hover:text-red-500 text-xl" />
            )}
            <span className={`text-sm font-medium ${liked ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`}>
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </span>
          </button>
          <button 
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
            onClick={() => document.getElementById(`comment-input-${post._id}`).focus()}
          >
            <FaRegComment className="text-xl" />
            <span className="text-sm font-medium">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-50">
        <form onSubmit={handleCommentSubmit} className="p-3 sm:p-4">
          <div className="flex space-x-2">
            <input
              id={`comment-input-${post._id}`}
              type="text"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Add a comment..."
              className="flex-grow px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={isLoading || !comment.trim()}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>

        {/* Display Comments */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3">
          {comments.map((comment, idx) => (
            <div key={comment._id || idx} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <img 
                  src={comment.user?.avatar || 'default-avatar.jpg'}
                  alt={comment.user?.name || 'User'}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'default-avatar.jpg';
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium text-xs sm:text-sm text-gray-900">
                    {comment.user?.name || 'Anonymous'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700">{comment.text}</p>
                  {/* Replies */}
                  {comment.replies?.length > 0 && (
                    <div className="ml-4 mt-2 space-y-2">
                      {comment.replies.map((reply, replyIdx) => (
                        <div key={reply._id || replyIdx} className="flex items-start space-x-2">
                          <img 
                            src={reply.user?.avatar || 'default-avatar.jpg'}
                            alt={reply.user?.name || 'User'}
                            className="w-5 h-5 rounded-full"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'default-avatar.jpg';
                            }}
                          />
                          <div>
                            <p className="font-medium text-xs text-gray-900">
                              {reply.user?.name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-gray-700">{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
