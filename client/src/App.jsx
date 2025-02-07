import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Feed from './pages/Feed';
import AuthForm from './Components/AuthForm';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import Communities from './pages/Communities';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import ForgotPassword from './Components/ForgotPassword';
import axios from './utils/axiosConfig';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('authToken');
  });

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await axios.get('/api/users/validate-token');
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  return (
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <div className="flex flex-grow">
            {/* Sidebar (Header) should only be visible when authenticated */}
            {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} />}
    
            {/* Main Content Area */}
            <main className="flex-grow">
              <Routes>
                {/* Redirect Routes */}
                <Route path="/" element={isAuthenticated ? <Navigate to="/feed" /> : <Navigate to="/auth" />} />
                <Route path="/feed" element={isAuthenticated ? <Feed /> : <Navigate to="/auth" />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} />
                <Route path="/explore" element={isAuthenticated ? <Explore /> : <Navigate to="/auth" />} />
                <Route path="/communities" element={isAuthenticated ? <Communities /> : <Navigate to="/auth" />} />
                <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/auth" />} />
                <Route path="/messages" element={isAuthenticated ? <Messages /> : <Navigate to="/auth" />} />
    
                {/* Public Routes */}
                <Route path="/auth" element={!isAuthenticated ? <AuthForm setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/feed" />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
    
                {/* 404 Catch-All */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
    
          {/* Footer - Always at Bottom */}
          <Footer />
        </div>
      </BrowserRouter>
    );
    
};

export default App;