import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { AIAssistant } from './pages/AIAssistant';
import TryOn from './pages/TryOn';
import VisualSearchPage from './pages/VisualSearch';
import { SocialHub } from './pages/SocialHub';
import NewsFeed from './pages/NewsFeed';
import { useAuth } from './context/AuthContext';
import Profile from './pages/Profile';
import Login from './pages/Login';

const AppContent: React.FC = () => {
  const location = useLocation();
  const showFooter = location.pathname !== '/ai-assistant';
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/try-on" element={<TryOn />} />
          <Route path="/visual-search" element={<VisualSearchPage />} />
          <Route path="/social" element={<SocialHub />} />
          <Route path="/news" element={<NewsFeed />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

import GoogleLoginBtn from './components/GoogleLoginBtn';
import UserMenu from './components/UserMenu';

function App() {
  const { isDarkMode } = useStore();
  const { user, setUser } = useAuth();

  // Apply theme immediately on mount to prevent flickering
  useEffect(() => {
    // Apply theme class synchronously
    const applyTheme = () => {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    // Apply immediately
    applyTheme();
    // Also apply on next frame to ensure it sticks
    requestAnimationFrame(applyTheme);
  }, [isDarkMode]);

  // Prevent flash of unstyled content
  useEffect(() => {
    document.documentElement.style.visibility = 'visible';
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      {/* Google Auth Overlay */}
      {user ? (
        <UserMenu user={user} onLogout={handleLogout} />
      ) : (
        <GoogleLoginBtn onLogin={setUser} />
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;