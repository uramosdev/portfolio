import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';


import { 
  User, 
  Briefcase, 
  BookOpen, 
  Mail, 
  Menu, 
  X, 
  Github, 
  Linkedin, 
  Twitter,
  LayoutDashboard
} from 'lucide-react';
import { useAboutStore } from '../store/aboutStore.ts';
import { useAuthStore } from '../store/authStore.ts';
import { cn } from '../shared/utils.ts';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { about, fetchAbout } = useAboutStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const navItems = [
    { name: 'About', path: '/', icon: User },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  if (user) {
    navItems.push({ name: 'Admin', path: '/admin', icon: LayoutDashboard });
  }

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-72 bg-zinc-950 border-r border-zinc-900 z-40 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-8 overflow-y-auto scrollbar-hide">
          {/* Profile Section */}
          <div className="mb-12 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <img 
                  src={about?.avatar_url || "https://picsum.photos/seed/avatar/400/400"} 
                  alt={about?.name || "Profile"}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-zinc-950" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              {about?.name || "Loading..."}
            </h1>
            <div className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
              <div>Web Developer</div>
              <div className="text-emerald-500/60 mt-1">-FullStack-</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-zinc-900 text-white border border-zinc-800" 
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
                )}
              >
                <item.icon size={18} className="transition-transform group-hover:scale-110" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Social Links */}
          <div className="pt-8 border-t border-zinc-900 flex items-center justify-center gap-4">
            <a href="#" className="p-2 text-zinc-500 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="p-2 text-zinc-500 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="p-2 text-zinc-500 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
