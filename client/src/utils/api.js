import API from "./axiosInstance";
const backendUri = import.meta.env.VITE_BACKEND_URI;
// Fetch all posts
export const getPosts = async () => {
  try {
    const response = await fetch(`${backendUri}/api/posts`);
    const data = await response.json();

    return Array.isArray(data.posts) ? data.posts : []; // ✅ Always return an array
  } catch (error) {
    console.error("API error fetching posts:", error);
    return []; // ✅ Ensure safe fallback
  }
};


// Create a new post
export const createPost = async (caption, media) => {
  try {
    const formData = new FormData();
    formData.append("caption", caption);
    if (media) formData.append("media", media);

    const response = await API.post("/api/posts/create", formData, {
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
    const response = await API.delete(`/api/posts/${postId}`);
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

    const response = await API.put(`/api/posts/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error editing post:", error);
    throw error;
  }
};


export const updateUserProfile = async (formData, token) => {
  try {
      console.log("Calling API with data:", Object.fromEntries(formData.entries()));

      const response = await API.put("/api/users/update-profile", formData, {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
          },
      });

      console.log("API Response:", response.data);
      return response.data;
  } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      throw error;
  }
};
