import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Compass, Users, Bell, MessageSquare, User, Menu, X, LogOut, Settings, PlusCircle, Search } from "lucide-react";
import PostForm from "../Components/postForm"; // Import the PostForm component
import axios from 'axios';

const Header = ({ setIsAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false); // State to toggle the post modal
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const backendUri = import.meta.env.VITE_BACKEND_URI || "http://localhost:3000";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await axios.get(`${backendUri}/api/users/get-current-user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Only remove token if it's an authentication error
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          navigate('/auth');
        }
      }
    };

    fetchUserData();
  }, [setIsAuthenticated, navigate]);

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch('http://localhost:3000/api/users/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      localStorage.removeItem("authToken");
      setDropdownOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePostSubmit = () => {
    setShowPostModal(false);
  };

  const ProfileImage = ({ user }) => {
    if (!user) return null;

    return (
      <div className={`rounded-full bg-blue-500 flex items-center justify-center text-white font-medium transition-all duration-300 ${
        isOpen ? "w-10 h-10" : "w-8 h-8"
      }`}>
        {getInitials(user.name)}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar Navigation */}
      <nav className={`bg-gray-900 text-white h-screen p-5 transition-all duration-300 ${isOpen ? "w-1/5" : "w-16"} fixed left-0 top-0 flex flex-col z-50`}>
        {/* Toggle Button */}
        <button className="text-white mb-5 self-end cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <ul className="space-y-4">
          <NavItem to="/feed" icon={<Home size={24} />} text="Home" isOpen={isOpen} />
          <NavItem to="/search" icon={<Search size={24} />} text="Search" isOpen={isOpen} />
          <NavItem to="/explore" icon={<Compass size={24} />} text="Explore" isOpen={isOpen} />
          <NavItem to="/communities" icon={<Users size={24} />} text="Communities" isOpen={isOpen} />
          <NavItem to="/notifications" icon={<Bell size={24} />} text="Notifications" isOpen={isOpen} />
          <NavItem to="/messages" icon={<MessageSquare size={24} />} text="Messages" isOpen={isOpen} />
          <NavItem to="/dashboard" icon={<User size={24} />} text="Profile" isOpen={isOpen} />
        </ul>

        {/* Create Post Button */}
        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg cursor-pointer mt-4"
        >
          <PlusCircle size={24} />
          {isOpen && <span>Create Post</span>}
        </button>

        {/* Settings and Profile Section */}
        <div className="mt-auto">
          <div 
            className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'} p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="relative flex justify-center">
              <ProfileImage user={userData} />
              <div className={`absolute bottom-0 right-0 bg-green-500 rounded-full border-2 border-gray-900 transition-all duration-300 ${
                isOpen ? "w-3 h-3" : "w-2 h-2"
              }`}></div>
            </div>
            {isOpen && userData && (
              <div className="flex-grow min-w-0">
                <p className="text-white font-medium truncate">
                  {userData.username}
                </p>
                <p className="text-gray-400 text-sm truncate">
                  {userData.name}
                </p>
              </div>
            )}
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className={`absolute bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
              isOpen ? "left-5 right-5" : "left-16 w-48"
            } bottom-20`}>
              <div className="py-2">
                <Link 
                  to="/settings" 
                  className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings size={20} className="mr-3 text-gray-400 shrink-0" />
                  <span className="truncate">Settings</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-gray-700 cursor-pointer"
                >
                  <LogOut size={20} className="mr-3 shrink-0" />
                  <span className="truncate">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Post Form Modal */}
      {showPostModal && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-[60] cursor-pointer"
          onClick={() => setShowPostModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 cursor-auto transform translate-y-0 sm:translate-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <PostForm onPostSubmit={handlePostSubmit} />
          </div>
        </div>
      )}
    </>
  );
};

/* Reusable Nav Item Component */
const NavItem = ({ to, icon, text, isOpen }) => (
  <li>
    <Link to={to} className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'} p-2 hover:bg-gray-800 rounded-lg cursor-pointer`}>
      {icon}
      {isOpen && <span>{text}</span>}
    </Link>
  </li>
);

export default Header;
