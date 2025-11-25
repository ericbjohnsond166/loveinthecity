import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { CommunityPage } from './pages/CommunityPage';
import { ChoosePage } from './pages/ChoosePage';
import { HotelPage } from './pages/HotelPage';
import { MinePage } from './pages/MinePage';
import { UserProfilePage } from './pages/UserProfilePage';
import { LoginPage } from './pages/LoginPage';
import { VipPage } from './pages/VipPage';
import { MessagesPage } from './pages/MessagesPage';

// Layout component to handle conditional rendering of BottomNav
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Hide nav on login and detailed user profile pages
  const hideNavPaths = ['/login', '/vip', '/messages'];
  const isUserProfile = location.pathname.startsWith('/user/');
  const showNav = !hideNavPaths.includes(location.pathname) && !isUserProfile;

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden relative font-sans">
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative bg-gray-50">
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Check authentication using StorageManager for consistency
  useEffect(() => {
    try {
      const storage = require('./utils/localStorage').StorageManager.getInstance();
      const userSession = storage.get('userSession');
      if (userSession && userSession.isAuthenticated) {
        setIsAuthenticated(true);
      } else {
        // Start authenticated by default
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    // Both methods for compatibility, but primary is StorageManager
    localStorage.setItem('funloves_token', 'mock_jwt_token');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('funloves_token');
    const storage = require('./utils/localStorage').StorageManager.getInstance();
    storage.remove('userSession');
    storage.clearUserProfile();
    storage.clear(); // Clear all storage
    setIsAuthenticated(false);
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
          } />
          
          <Route path="/" element={
            isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/community" element={
            isAuthenticated ? <CommunityPage /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/choose" element={
            isAuthenticated ? <ChoosePage /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/hotel" element={
            isAuthenticated ? <HotelPage /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/mine" element={
            isAuthenticated ? <MinePage onLogout={handleLogout} /> : <Navigate to="/login" replace />
          } />

           <Route path="/vip" element={
            isAuthenticated ? <VipPage /> : <Navigate to="/login" replace />
          } />
          
           <Route path="/messages" element={
            isAuthenticated ? <MessagesPage /> : <Navigate to="/login" replace />
          } />

          <Route path="/user/:id" element={
            isAuthenticated ? <UserProfilePage /> : <Navigate to="/login" replace />
          } />
          
          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}