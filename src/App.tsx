import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'motion/react';
import Sidebar from './components/Sidebar.tsx';
import { useAuthStore } from './store/authStore.ts';


// Lazy loading features
const About = lazy(() => import('./features/about/About.tsx'));
const Projects = lazy(() => import('./features/projects/Projects.tsx'));
const Blog = lazy(() => import('./features/blog/Blog.tsx'));
const BlogPost = lazy(() => import('./features/blog/BlogPost.tsx'));
const Contact = lazy(() => import('./features/contact/Contact.tsx'));
const Login = lazy(() => import('./features/admin/Login.tsx'));
const AdminDashboard = lazy(() => import('./features/admin/Dashboard.tsx'));

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
        transition={{ 
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1] // Standard material easing for smooth motion
        }}
        className="min-h-screen pt-24 pb-12 px-6 lg:pt-12 lg:px-12"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-emerald-500/30 selection:text-emerald-400">
          <Sidebar />
          
          <main className="lg:ml-72 transition-all duration-300">
            <Suspense fallback={<LoadingFallback />}>
              <PageTransition>
                <Routes>
                  <Route path="/" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PageTransition>
            </Suspense>
          </main>
        </div>
      </Router>
    </HelmetProvider>
  );
}
