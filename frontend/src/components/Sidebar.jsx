import React, { useState } from 'react';
import { Home, User, Briefcase, FileText, Mail, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ activeSection, setActiveSection, onCollapseChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Estado para desktop - cerrado por defecto

  const menuItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'about', icon: User, label: 'Sobre mí' },
    { id: 'projects', icon: Briefcase, label: 'Proyectos' },
    { id: 'blog', icon: FileText, label: 'Blog' },
    { id: 'contact', icon: Mail, label: 'Contacto' }
  ];

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onCollapseChange) {
      onCollapseChange(newState);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors shadow-lg"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} className="text-black" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} className="text-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Sidebar Desktop (collapsible) */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:block fixed left-0 top-0 h-screen bg-[#0a0a0a] border-r border-[#2a2a2a] z-40"
      >
        {/* Header con botón toggle */}
        <div className="h-20 border-b border-[#2a2a2a] flex items-center justify-end px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCollapse}
            className="w-10 h-10 rounded-lg bg-[#1a1a1a] hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-500 flex items-center justify-center transition-colors"
          >
            <AnimatePresence mode="wait">
              {isCollapsed ? (
                <motion.div
                  key="expand"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="collapse"
                  initial={{ rotate: 180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronLeft size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Navigation Items Desktop */}
        <nav className={`flex flex-col py-8 ${isCollapsed ? 'items-center space-y-8 px-0' : 'px-4 space-y-4'}`}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            if (isCollapsed) {
              // Vista colapsada (solo iconos)
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, x: 5 }}
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
                  
                  {/* Tooltip cuando está colapsado */}
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute left-full ml-4 px-3 py-1.5 bg-emerald-500 text-black text-sm font-semibold rounded-lg whitespace-nowrap pointer-events-none shadow-lg z-50"
                  >
                    {item.label}
                  </motion.span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDesktopIndicatorCollapsed"
                      className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            }
            
            // Vista expandida (iconos + labels)
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, x: 5 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-4 px-4 py-4 rounded-lg transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/50'
                    : 'text-gray-400 hover:text-emerald-500 hover:bg-[#1a1a1a]'
                }`}
              >
                <Icon size={22} className={isActive ? 'text-black' : ''} />
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className={`text-base font-semibold whitespace-nowrap ${isActive ? 'text-black' : ''}`}
                >
                  {item.label}
                </motion.span>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeDesktopIndicatorExpanded"
                    className="ml-auto w-2 h-2 bg-black rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer info Desktop */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-0 right-0 px-6"
          >
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
              <p className="text-gray-400 text-xs text-center">
                Portfolio © 2025
              </p>
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Sidebar Mobile (expanded with labels) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen bg-[#0a0a0a] border-r border-emerald-500 z-40 w-64 shadow-2xl"
            >
              {/* Header - Sin contenido */}
              <div className="h-20 border-b border-[#2a2a2a]"></div>

              {/* Navigation Items Mobile con Labels */}
              <nav className="flex flex-col px-4 py-8 space-y-4">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, x: 5 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-4 px-4 py-4 rounded-lg transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/50'
                          : 'text-gray-400 hover:text-emerald-500 hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <Icon size={22} className={isActive ? 'text-black' : ''} />
                      <span className={`text-base font-semibold ${isActive ? 'text-black' : ''}`}>
                        {item.label}
                      </span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeMobileIndicator"
                          className="ml-auto w-2 h-2 bg-black rounded-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Footer info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-8 left-0 right-0 px-6"
              >
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
                  <p className="text-gray-400 text-xs text-center">
                    Portfolio © 2025
                  </p>
                </div>
              </motion.div>
            </motion.aside>

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;