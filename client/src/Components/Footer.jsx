import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white text-gray-500 text-sm py-4 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4 text-center md:justify-between md:text-left">
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help Center</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookies</a>
          <a href="#" className="hover:underline">Ads Info</a>
        </div>
        <p className="text-gray-400">&copy; {new Date().getFullYear()} Twitter Clone</p>
      </div>
    </footer>
  );
};

export default Footer;
