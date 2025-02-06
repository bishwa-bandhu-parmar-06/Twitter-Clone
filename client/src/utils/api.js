// src/api.js

import axios from "axios";

const API_URL = "http://localhost:3000/api/posts"; // Backend URL

// Get all posts
export const getPosts = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Changed to authToken
    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
    const response = await axios.get(API_URL, config);
    return response.data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

// Create a new post
export const createPost = async (caption, media) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (media) {
      formData.append("media", media);
    }

    // Log the formData contents for debugging
    for (let pair of formData.entries()) {
      console.log('FormData content:', pair[0], pair[1]);
    }

    const response = await axios.post(`${API_URL}/create`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });

    return response.data.post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Add a comment to a post
export const addComment = async (postId, comment) => {
  try {
    const token = localStorage.getItem('authToken'); // Changed to authToken
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response = await axios.post(
      `${API_URL}/comment/${postId}`,
      { text: comment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Add a reply to a comment
export const addReply = async (postId, commentId, reply) => {
  try {
    const token = localStorage.getItem('authToken'); // Changed to authToken
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response = await axios.post(
      `${API_URL}/comment/${postId}/reply/${commentId}`,
      { text: reply },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding reply:", error);
    throw error;
  }
};

// Toggle like on a post
export const toggleLike = async (postId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response = await axios.post(
      `${API_URL}/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response = await axios.delete(`${API_URL}/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Edit a post
export const editPost = async (postId, caption, newMedia) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (newMedia) {
      formData.append("media", newMedia);
    }

    const response = await axios.put(`${API_URL}/${postId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.post;
  } catch (error) {
    console.error("Error editing post:", error);
    throw error;
  }
};
