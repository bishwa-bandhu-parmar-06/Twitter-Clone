import API from "./axiosInstance";

// Fetch all posts
export const getPosts = async () => {
  try {
    const response = await API.get("/posts");
    return response.data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error.response?.data || error.message);
    return [];
  }
};

// Create a new post
export const createPost = async (caption, media) => {
  try {
    const formData = new FormData();
    formData.append("caption", caption);
    if (media) formData.append("media", media);

    const response = await API.post("/posts/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.post;
  } catch (error) {
    console.error("Error creating post:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    const response = await API.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error.response?.data || error.message);
    throw error;
  }
};


// ✅ Fix: Use API to include token automatically
export const editPost = async (postId, newCaption, newImage) => {
  try {
    const formData = new FormData();
    formData.append("caption", newCaption);
    
    if (newImage) {
      formData.append("media", newImage); // ✅ Fix: Ensure the image is appended correctly
    }

    const response = await API.put(`/posts/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error editing post:", error);
    throw error;
  }
};