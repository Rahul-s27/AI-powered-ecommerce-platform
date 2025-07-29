import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { AIAssistant } from './pages/AIAssistant';
import TryOn from './pages/TryOn';

import VisualSearchPage from './pages/VisualSearch';
import { SocialHub } from './pages/SocialHub';

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
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  const { isDarkMode } = useStore();
  
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

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;