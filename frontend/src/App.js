import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Admin from './components/Admin';
import { AuthProvider } from './context/AuthContext';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

function AppContent() {
  const [activeSection, setActiveSection] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Sync activeSection with current route
    const path = location.pathname;
    if (path === '/admin-unchain') {
      setActiveSection('admin-unchain');
    } else if (path === '/about') {
      setActiveSection('about');
    } else if (path === '/projects') {
      setActiveSection('projects');
    } else if (path === '/blog') {
      setActiveSection('blog');
    } else if (path === '/contact') {
      setActiveSection('contact');
    } else {
      setActiveSection('home');
    }
  }, [location]);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'projects':
        return <Projects />;
      case 'blog':
        return <Blog />;
      case 'contact':
        return <Contact />;
      case 'admin-unchain':
        return <Admin />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App bg-[#0a0a0a] min-h-screen flex">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onCollapseChange={setIsSidebarCollapsed}
      />
      <motion.main
        animate={{ 
          marginLeft: window.innerWidth >= 1024 ? (isSidebarCollapsed ? 80 : 256) : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 w-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="*" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;