import React, { useEffect, useState } from "react";
import { getPosts, createPost } from "../utils/api"; // Import the createPost function
import PostForm from "../Components/postForm";
import Post from "../Components/Post";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null); // New state for error handling

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
      console.log('Feed handling post submit:', { caption, media });
      const newPost = await createPost(caption, media);
      setPosts([newPost, ...posts]); // Add the new post at the top
    } catch (error) {
      console.error("Failed to create post:", error);
      setError("Failed to create post. Please try again later.");
    }
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar Spacing (20%) */}
      <div className="w-[20%] min-w-[250px]"></div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[700px] w-full mx-auto px-4 py-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6 shadow-md transition-all duration-300 hover:bg-red-600">
            {error}
          </div>
        )}

        {/* Post Creation Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <PostForm onPostSubmit={handlePostSubmit} />
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Post 
              key={post._id} 
              post={post} 
              onPostDelete={handlePostDelete}
              onPostUpdate={handlePostUpdate}
            />
          ))}
        </div>
      </main>

      {/* Right Sidebar - Suggestions (20%) */}
      <div className="hidden lg:block w-[20%] min-w-[250px] p-4">
        <div className="sticky top-20">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">Suggestions For You</h2>
            {/* Add your suggestions content here */}
            <div className="space-y-4">
              {/* Example suggestion items */}
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
              {/* Add more suggestion items as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
