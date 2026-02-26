import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore.ts';
import { useProjectStore } from '../../store/projectStore.ts';
import { useBlogStore, Post } from '../../store/blogStore.ts';
import { useAboutStore } from '../../store/aboutStore.ts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BlogPostForm from './BlogPostForm.tsx';
import ProjectForm from './ProjectForm.tsx';
import ImageUpload from '../../components/ImageUpload.tsx';
import { Project } from '../../store/projectStore.ts';

const AdminDashboard = () => {
  const { logout } = useAuthStore();
  const { projects, fetchProjects, deleteProject } = useProjectStore();
  const { posts, fetchPosts, deletePost } = useBlogStore();
  const { about, fetchAbout } = useAboutStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'blog' | 'messages' | 'about' | 'media'>('projects');
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [aboutForm, setAboutForm] = useState({
    name: '',
    title: '',
    bio: '',
    location: '',
    whatsapp: '',
    avatar_url: '',
  });
  const [aboutError, setAboutError] = useState<string | null>(null);
  const [isUpdatingAbout, setIsUpdatingAbout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (about) {
      setAboutForm({
        name: about.name || '',
        title: about.title || '',
        bio: about.bio || '',
        location: about.location || '',
        whatsapp: about.whatsapp || '',
        avatar_url: about.avatar_url || '',
      });
    }
  }, [about]);

  useEffect(() => {
    fetchProjects();
    fetchPosts();
    fetchAbout();
    fetchMessages();
  }, []);

  const handleAboutUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAboutError(null);
    setIsUpdatingAbout(true);
    try {
      await axios.put('/api/about', aboutForm);
      await fetchAbout();
      alert('About information updated successfully!');
    } catch (error: any) {
      console.error('Error updating about');
      setAboutError(error.response?.data?.message || 'Error updating profile information.');
    } finally {
      setIsUpdatingAbout(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/contact');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const markMessageRead = async (id: string) => {
    await axios.patch(`/api/contact/${id}/read`);
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    await axios.delete(`/api/contact/${id}`);
    fetchMessages();
  };

  const openBlogForm = (post?: Post) => {
    setEditingPost(post);
    setIsBlogFormOpen(true);
  };

  const closeBlogForm = () => {
    setIsBlogFormOpen(false);
    setEditingPost(undefined);
  };

  const openProjectForm = (project?: Project) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  };

  const closeProjectForm = () => {
    setIsProjectFormOpen(false);
    setEditingProject(undefined);
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-zinc-500">Manage your digital presence</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-zinc-900 pb-4">
        {[
          { id: 'projects', label: 'Projects', icon: LayoutGrid },
          { id: 'blog', label: 'Blog', icon: FileText },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'media', label: 'Media', icon: LayoutGrid },
          { id: 'about', label: 'About', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-zinc-900 text-white border border-zinc-800' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Projects</h3>
                  <button 
                    onClick={() => openProjectForm()}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors"
                  >
                    <Plus size={16} /> Add Project
                  </button>
                </div>
                <div className="grid gap-4">
                  {projects.map(project => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                      <div>
                        <h4 className="text-white font-bold">{project.title}</h4>
                        <p className="text-xs text-zinc-500">{project.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openProjectForm(project)}
                          className="p-2 text-zinc-500 hover:text-white transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteProject(project.id)}
                          className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Blog Posts</h3>
                  <button 
                    onClick={() => openBlogForm()}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors"
                  >
                    <Plus size={16} /> New Post
                  </button>
                </div>
                <div className="grid gap-4">
                  {posts.map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                      <div>
                        <h4 className="text-white font-bold">{post.title}</h4>
                        <p className="text-xs text-zinc-500">{post.status} • {post.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openBlogForm(post)}
                          className="p-2 text-zinc-500 hover:text-white transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deletePost(post.id)}
                          className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Messages</h3>
                <div className="grid gap-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`p-6 border rounded-2xl transition-colors ${
                      msg.is_read ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-900 border-emerald-500/30'
                    }`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-white font-bold">{msg.subject}</h4>
                          <p className="text-xs text-zinc-500">From: {msg.name} ({msg.email})</p>
                        </div>
                        <div className="flex gap-2">
                          {!msg.is_read && (
                            <button 
                              onClick={() => markMessageRead(msg.id)}
                              className="p-2 text-emerald-500 hover:text-emerald-400 transition-colors"
                            >
                              <Check size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => deleteMessage(msg.id)}
                            className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Media Gallery</h3>
                <p className="text-zinc-500 text-sm">Upload images to use in your projects or blog posts.</p>
                <div className="max-w-md">
                  <ImageUpload 
                    value="" 
                    onChange={(url) => {
                      if (url) {
                        navigator.clipboard.writeText(window.location.origin + url);
                        alert('Image uploaded! URL copied to clipboard: ' + url);
                      }
                    }} 
                  />
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">About Settings</h3>
                <p className="text-zinc-500 text-sm">Update your profile information and tech stack.</p>
                
                <form onSubmit={handleAboutUpdate} className="space-y-6 max-w-2xl">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Name</label>
                        <input
                          value={aboutForm.name}
                          onChange={(e) => setAboutForm({ ...aboutForm, name: e.target.value })}
                          className="w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Title</label>
                        <input
                          value={aboutForm.title}
                          onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                          className="w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <ImageUpload 
                      label="Profile Picture"
                      value={aboutForm.avatar_url}
                      onChange={(url) => setAboutForm({ ...aboutForm, avatar_url: url })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">City / Region</label>
                      <input
                        value={aboutForm.location}
                        onChange={(e) => setAboutForm({ ...aboutForm, location: e.target.value })}
                        className="w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">WhatsApp</label>
                      <input
                        value={aboutForm.whatsapp}
                        onChange={(e) => setAboutForm({ ...aboutForm, whatsapp: e.target.value })}
                        className="w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="e.g. +1234567890"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Bio</label>
                    <textarea
                      value={aboutForm.bio}
                      onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                      rows={4}
                      className="w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>

                  {aboutError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                      {aboutError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isUpdatingAbout}
                    className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {isUpdatingAbout ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Blog Form Modal */}
      <AnimatePresence>
        {isBlogFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeBlogForm}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-4xl z-10">
              <BlogPostForm 
                post={editingPost} 
                onClose={closeBlogForm} 
                onSuccess={() => {
                  closeBlogForm();
                  fetchPosts();
                }} 
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Form Modal */}
      <AnimatePresence>
        {isProjectFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProjectForm}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-4xl z-10">
              <ProjectForm 
                project={editingProject} 
                onClose={closeProjectForm} 
                onSuccess={() => {
                  closeProjectForm();
                  fetchProjects();
                }} 
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
