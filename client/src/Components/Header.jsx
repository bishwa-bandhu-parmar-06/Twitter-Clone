import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-500">
              Twitter Clone
            </a>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 mx-8">
            <input
              type="text"
              placeholder="Search Twitter Clone"
              className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Right side - Navigation Links */}
          <div className="flex items-center space-x-6">
            <a href="/home" className="text-gray-700 hover:text-blue-500">
              Home
            </a>
            <a href="/notifications" className="text-gray-700 hover:text-blue-500">
              Notifications
            </a>
            <a href="/messages" className="text-gray-700 hover:text-blue-500">
              Messages
            </a>
            <a href="/profile" className="text-gray-700 hover:text-blue-500">
              Profile
            </a>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
              Tweet
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;