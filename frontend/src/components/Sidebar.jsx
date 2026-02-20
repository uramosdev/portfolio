import React, { useState } from 'react';
import { Home, User, Briefcase, FileText, Mail, Settings, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'about', icon: User, label: 'Sobre mí' },
    { id: 'projects', icon: Briefcase, label: 'Proyectos' },
    { id: 'blog', icon: FileText, label: 'Blog' },
    { id: 'contact', icon: Mail, label: 'Contacto' }
    // Admin route hidden - access directly via URL
  ];

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
      >
        {isOpen ? <X size={24} className="text-black" /> : <Menu size={24} className="text-black" />}
      </motion.button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#0a0a0a] border-r border-[#2a2a2a] z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-20`}
      >
        {/* Logo/Menu Icon */}
        <div className="h-20 flex items-center justify-center border-b border-[#2a2a2a]">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center"
          >
            <Menu size={24} className="text-black" />
          </motion.div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center py-8 space-y-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.1,
                  x: 5
                }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-12 h-12 flex items-center justify-center rounded-lg transition-all group ${
                  isActive
                    ? 'bg-emerald-500 text-black'
                    : 'text-gray-400 hover:text-emerald-500 hover:bg-[#1a1a1a]'
                }`}
                title={item.label}
              >
                <motion.div
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Icon size={20} />
                </motion.div>
                
                {/* Tooltip */}
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-4 px-3 py-1.5 bg-[#1a1a1a] text-white text-sm rounded-lg whitespace-nowrap pointer-events-none"
                >
                  {item.label}
                </motion.span>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;