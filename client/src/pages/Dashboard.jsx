import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import UpdationForm from "../Components/UpdationForm"; // Import the update form
import { toast } from "react-toastify";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userUpdated, setUserUpdated] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false); // State to toggle modal
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
  
          // console.log("Full API Response:", response.data); // ✅ Debugging
          // console.log("User Data from API:", response.data.user); // ✅ Debugging
  
          setUser(response.data.user);
      } catch (error) {
          console.error("Error fetching user:", error.response?.data || error.message);
          
      }
  };
  
    

    fetchUser();
}, [userUpdated]);  // ✅ Re-fetch when `userUpdated` changes
  // ✅ Re-fetch when `userUpdated` changes
  
    


  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Profile Banner */}
      <div className="w-full max-w-3xl relative">
        {/* Profile Banner */}
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
        {/* Profile Info */}
          <p className="text-gray-300 mt-2">{user?.profileCaption || "No bio available."}</p>


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

      {/* Profile Update Modal */}
      {isEditOpen && <UpdationForm 
        user={user} 
        setUser={setUser} 
        setIsEditOpen={setIsEditOpen} 
        setUserUpdated={setUserUpdated}/>}
    </div>


    
  );
};

export default Dashboard;
