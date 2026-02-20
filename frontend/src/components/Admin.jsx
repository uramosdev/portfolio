import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import blogService from '../services/blogService';
import contactService from '../services/contactService';

const Admin = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'messages'
  const [isLoading, setIsLoading] = useState(false);
  
  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    image: '',
    readTime: '5 min'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
      fetchMessages();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      const data = await blogService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await contactService.getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      await login(username, password);
      setUsername('');
      setPassword('');
    } catch (error) {
      setLoginError(typeof error === 'string' ? error : 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsEditing(false);
    setEditingPost(null);
    setPosts([]);
    setMessages([]);
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
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
      readTime: '5 min'
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
      image: post.image,
      readTime: post.readTime
    });
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingPost) {
        await blogService.updatePost(editingPost, postData);
        alert('Post actualizado con éxito');
      } else {
        await blogService.createPost(postData);
        alert('Post creado con éxito');
      }

      await fetchPosts();
      setIsEditing(false);
      setEditingPost(null);
      setFormData({ title: '', excerpt: '', content: '', category: '', tags: '', image: '', readTime: '5 min' });
    } catch (error) {
      alert('Error al guardar el post: ' + (error.response?.data?.detail || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      try {
        await blogService.deletePost(id);
        await fetchPosts();
        alert('Post eliminado');
      } catch (error) {
        alert('Error al eliminar el post');
      }
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      try {
        await contactService.deleteMessage(id);
        await fetchMessages();
        alert('Mensaje eliminado');
      } catch (error) {
        alert('Error al eliminar el mensaje');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPost(null);
    setFormData({ title: '', excerpt: '', content: '', category: '', tags: '', image: '', readTime: '5 min' });
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
                <label htmlFor="username" className="block text-white font-semibold mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="Ingresa tu usuario"
                />
              </div>
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
              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
              <p className="text-gray-400 text-sm text-center">
                Credenciales por defecto: admin / admin123
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
                <label className="block text-white font-semibold mb-2">Tiempo de lectura</label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="5 min"
                />
              </div>
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
              disabled={isLoading}
              className="w-full px-6 py-4 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              {isLoading ? 'Guardando...' : 'Guardar Post'}
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
            {activeTab === 'posts' && (
              <button
                onClick={handleNewPost}
                className="px-6 py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Nuevo Post
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-[#1a1a1a] text-gray-400 rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'posts'
                ? 'bg-emerald-500 text-black'
                : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'
            }`}
          >
            Posts del Blog
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-emerald-500 text-black'
                : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'
            }`}
          >
            <Mail size={20} />
            Mensajes ({messages.length})
          </button>
        </div>

        {/* Posts List */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                No hay posts todavía. ¡Crea el primero!
              </div>
            ) : (
              posts.map((post) => (
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
              ))
            )}
          </div>
        )}

        {/* Messages List */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                No hay mensajes todavía.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{msg.name}</h3>
                        <span className="text-emerald-500 text-sm">{msg.email}</span>
                      </div>
                      <h4 className="text-lg text-gray-300 mb-2">{msg.subject}</h4>
                      <p className="text-gray-400 mb-3">{msg.message}</p>
                      <div className="text-sm text-gray-500">
                        {new Date(msg.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Admin;
