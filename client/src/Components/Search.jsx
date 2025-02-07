import React, { useState, useEffect } from "react";
import API from "../utils/axiosInstance";
import { Search as SearchIcon, X } from "lucide-react";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/users/get-users");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      {/* Sidebar Placeholder */}
      <div className="w-1/4 hidden md:block"></div>

      {/* Main Search Content */}
      <div className="w-full md:w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Search Users</h1>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute left-3 top-3 text-gray-500" size={20} />
        </div>

        {/* Display Users List */}
        <ul className="mt-4 bg-white border rounded-lg shadow-md max-h-60 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <li
                key={user._id}
                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b"
                onClick={() => setSelectedUser(user)}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    👤
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 p-3 text-center">No users found</p>
          )}
        </ul>
      </div>

      {/* User Details Popup */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setSelectedUser(null)} // Close on background click
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative transition-transform transform scale-95 animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 cursor-pointer"
              onClick={() => setSelectedUser(null)}
            >
              <X size={24} />
            </button>

            {/* User Info */}
            <div className="text-center">
              {selectedUser.avatar ? (
                <img
                  src={selectedUser.avatar}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full mx-auto"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mx-auto">
                  👤
                </div>
              )}
              <h2 className="text-xl font-bold mt-4">{selectedUser.name}</h2>
              <p className="text-gray-600">@{selectedUser.username}</p>
              <p className="text-gray-500 mt-2">{selectedUser.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
