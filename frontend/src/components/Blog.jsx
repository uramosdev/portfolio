import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Tag } from 'lucide-react';
import { blogPosts as mockPosts } from '../mock/mockData';
import blogService from '../services/blogService';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await blogService.getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Error al cargar los posts');
      // Fallback to mock data if API fails
      setPosts(mockPosts);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#0a0a0a] py-20 px-6 flex items-center justify-center">
        <div className="text-gray-400">Cargando posts...</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">blog</h2>
          <div className="h-1 w-24 bg-emerald-500"></div>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all group"
            >
              {/* Post Image */}
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-emerald-500 text-black text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-500 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{post.excerpt}</p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    <span>{new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#2a2a2a] text-gray-400 text-xs rounded-full flex items-center gap-1"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Read More Button */}
                <button className="mt-6 text-emerald-500 font-semibold hover:text-emerald-400 transition-colors">
                  Leer más →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;