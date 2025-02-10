import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import UpdationForm from "../Components/UpdationForm"; // Import the update form
import { toast } from "react-toastify";
import Post from "../Components/Post";
import { editPost, deletePost } from "../utils/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userUpdated, setUserUpdated] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postUpdated, setPostUpdated] = useState(false);

  const navigate = useNavigate();
  const backendUri = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      try {
        const response = await axios.get(`${backendUri}/api/users/get-current-user`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setUser(response.data.user);
        setFollowers(response.data.user.followers || []);
        setFollowing(response.data.user.following || []);
      } catch (error) {
        console.error("Error fetching user:", error.response?.data || error.message);
      }
    };

    fetchUser();
  }, [userUpdated]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${backendUri}/api/posts/user/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          withCredentials: true,
        });

        const postsArray = response.data.posts || [];
        setPosts(postsArray);
      } catch (error) {
        console.error("Error fetching posts:", error.response?.data || error.message);
        setPosts([]);
      }
    };

    fetchPosts();
  }, [user?._id, postUpdated]);

  const handleEditPost = async (postId, newCaption) => {
    try {
      await editPost(postId, newCaption);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? { ...post, caption: newCaption } : post))
      );
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Profile Banner */}
      <div className="w-full max-w-3xl relative">
        <div className="w-full h-56 bg-gray-800 rounded-b-xl overflow-hidden relative">
          {user?.banner && <img src={user.banner} className="w-full h-full object-cover" alt="Banner" />}
        </div>

        {/* Profile Avatar */}
        <div className="absolute -bottom-12 left-6 w-28 h-28 border-4 border-black rounded-full overflow-hidden shadow-lg">
          {user?.avatar ? (
            <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-2xl">
              {user?.name?.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-16 max-w-3xl w-full px-6 text-center">
        <h1 className="text-3xl font-bold">{user?.name}</h1>
        <p className="text-gray-400 text-lg">@{user?.username}</p>
        <p className="text-gray-300 mt-2">{user?.profileCaption || "No bio available."}</p>

        {/* Follow & Following Buttons */}
        <div className="mt-4 flex gap-4 justify-center">
          <button
            className="border border-gray-600 px-5 py-2 rounded-full hover:bg-gray-800 transition"
            onClick={() => setIsFollowersOpen(true)}
          >
            Followers ({user?.followers?.length || 0})
          </button>
          <button
            className="border border-gray-600 px-5 py-2 rounded-full hover:bg-gray-800 transition"
            onClick={() => setIsFollowingOpen(true)}
          >
            Following ({user?.following?.length || 0})
          </button>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6">
          <button
            className="border border-gray-600 px-5 py-2 rounded-full hover:bg-gray-800 transition"
            onClick={() => setIsEditOpen(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Post Section */}
      <div className="space-y-6">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post, index) => (
            <Post key={post._id || index} post={post} onEdit={handleEditPost} onDelete={handleDeletePost} />
          ))
        ) : (
          <p className="text-gray-400 text-center mt-4">No posts available</p>
        )}
      </div>

      {/* Profile Update Modal */}
      {isEditOpen && <UpdationForm user={user} setUser={setUser} setIsEditOpen={setIsEditOpen} setUserUpdated={setUserUpdated} />}

      {/* Followers Modal */}
      {isFollowersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded-lg relative">
            <h2 className="text-lg font-bold mb-4">Followers</h2>
            <ul>
              {followers.length > 0 ? (
                followers.map((follower) => <li key={follower._id}>{follower.name}</li>)
              ) : (
                <p>No followers yet.</p>
              )}
            </ul>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setIsFollowersOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {isFollowingOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded-lg relative">
            <h2 className="text-lg font-bold mb-4">Following</h2>
            <ul>
              {following.length > 0 ? (
                following.map((person) => <li key={person._id}>{person.name}</li>)
              ) : (
                <p>Not following anyone yet.</p>
              )}
            </ul>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setIsFollowingOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
