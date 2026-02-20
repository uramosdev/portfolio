import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Admin from './components/Admin';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [activeSection, setActiveSection] = useState('home');

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
      case 'admin':
        return <Admin />;
      default:
        return <Home />;
    }
  };

  return (
    <AuthProvider>
      <div className="App bg-[#0a0a0a] min-h-screen">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="lg:ml-20">
          {renderSection()}
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;