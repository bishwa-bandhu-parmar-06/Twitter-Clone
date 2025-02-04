import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const backendUri = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Session expired, please log in again.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${backendUri}/api/users/get-current-user`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data.success && response.data.user) {
          setUser(response.data.user); // ✅ Correctly set the logged-in user
        } else {
          throw new Error("Invalid user data");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Session expired, please log in again.");
        navigate("/login");
      }
    };

    if (backendUri) fetchUser();
  }, [backendUri, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUri}/api/users/logout`, {}, { withCredentials: true });

      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];

      toast.success("Logged out successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error("Logout failed, try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Dashboard</h2>

        {user ? (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-gray-600"><strong>Name:</strong> {user.name}</p>
              <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-gray-600">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
