import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { blogPosts as initialPosts } from '../mock/mockData';

const Admin = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    image: ''
  });

  // Simple authentication (mock)
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewPost = () => {
    setIsEditing(true);
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop'
    });
  };

  const handleEditPost = (post) => {
    setIsEditing(true);
    setEditingPost(post.id);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
      image: post.image
    });
  };

  const handleSavePost = (e) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      author: 'Ubaldino Ramos',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min'
    };

    if (editingPost) {
      // Update existing post
      setPosts(posts.map(post => 
        post.id === editingPost ? { ...post, ...postData } : post
      ));
      alert('Post actualizado con éxito');
    } else {
      // Create new post
      const newPost = {
        id: posts.length + 1,
        ...postData
      };
      setPosts([newPost, ...posts]);
      alert('Post creado con éxito');
    }

    setIsEditing(false);
    setEditingPost(null);
    setFormData({ title: '', excerpt: '', content: '', category: '', tags: '', image: '' });
  };

  const handleDeletePost = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      setPosts(posts.filter(post => post.id !== id));
      alert('Post eliminado');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPost(null);
    setFormData({ title: '', excerpt: '', content: '', category: '', tags: '', image: '' });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
            <h2 className="text-4xl font-bold text-white mb-6 text-center">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-white font-semibold mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="Ingresa la contraseña"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors"
              >
                Iniciar sesión
              </button>
              <p className="text-gray-400 text-sm text-center">
                Demo: usar "admin123"
              </p>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // Edit Form
  if (isEditing) {
    return (
      <section className="min-h-screen bg-[#0a0a0a] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-white">
              {editingPost ? 'Editar Post' : 'Nuevo Post'}
            </h2>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-[#1a1a1a] text-gray-400 rounded-lg hover:bg-[#2a2a2a] transition-colors flex items-center gap-2"
            >
              <X size={20} />
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSavePost} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Título</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Extracto</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Contenido</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="8"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Categoría</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Tags (separados por comas)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">URL de Imagen</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Guardar Post
            </button>
          </form>
        </div>
      </section>
    );
  }

  // Admin Dashboard
  return (
    <section className="min-h-screen bg-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">admin panel</h2>
            <div className="h-1 w-24 bg-emerald-500"></div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleNewPost}
              className="px-6 py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Nuevo Post
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-[#1a1a1a] text-gray-400 rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{post.title}</h3>
                  <p className="text-gray-400 mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{new Date(post.date).toLocaleDateString('es-ES')}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPost(post)}
                    className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Admin;