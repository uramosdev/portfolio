import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Admin from './components/Admin';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Sync activeSection with current route
    const path = location.pathname;
    if (path === '/admin-panel-ubaldino-2025') {
      setActiveSection('admin-panel-ubaldino-2025');
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
      case 'admin-panel-ubaldino-2025':
        return <Admin />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App bg-[#0a0a0a] min-h-screen">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="lg:ml-20">
        {renderSection()}
      </main>
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