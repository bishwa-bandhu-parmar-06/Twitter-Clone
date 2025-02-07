import React, { useEffect, useState } from "react";
import { getPosts, createPost, editPost, deletePost } from "../utils/api"; // ✅ Fix: Import editPost & deletePost
import PostForm from "../Components/postForm";
import Post from "../Components/Post";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      }
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (caption, media) => {
    try {
      console.log("Feed handling post submit:", { caption, media });
      const newPost = await createPost(caption, media);
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error("Failed to create post:", error);
      setError("Failed to create post. Please try again later.");
    }
  };

  const handleEditPost = async (postId, newCaption) => {
    try {
      const response = await editPost(postId, newCaption);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, caption: newCaption } : post
        )
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
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-[20%] min-w-[250px]"></div>

      <main className="flex-1 max-w-[700px] w-full mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6 shadow-md transition-all duration-300 hover:bg-red-600">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <PostForm onPostSubmit={handlePostSubmit} />
        </div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <Post
              key={post._id || index}
              post={post}
              onEdit={handleEditPost} // ✅ Fix: Pass correct prop name
              onDelete={handleDeletePost} // ✅ Fix: Pass correct prop name
            />
          ))}
        </div>
      </main>

      <div className="hidden lg:block w-[20%] min-w-[250px] p-4">
        <div className="sticky top-20">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">Suggestions For You</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-medium">User Name</p>
                    <p className="text-sm text-gray-500">Suggested for you</p>
                  </div>
                </div>
                <button className="text-blue-500 hover:text-blue-600 font-medium text-sm">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
