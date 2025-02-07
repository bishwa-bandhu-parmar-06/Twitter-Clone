// src/api/axiosInstance.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

// Automatically attach Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
