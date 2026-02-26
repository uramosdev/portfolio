import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react'; // Correct for Motion 12+
import { ArrowRight, Loader2 } from 'lucide-react';
import { useBlogStore } from '../../store/blogStore.ts';
import { formatDate } from '../../shared/utils.ts';

const Blog = () => {
  const { posts, fetchPosts, isLoading } = useBlogStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 1. Handle Loading State
  if (isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
        <p>Fetching the latest insights...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <header className="mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4">
            Insights & Thoughts
          </h2>
          <p className="text-zinc-400 max-w-xl">
            Writing about software architecture, development workflows, and the future of technology.
          </p>
        </motion.div>
      </header>

      <div className="space-y-12">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: index * 0.1 // Increased slightly for better visual rhythm
              }}
              className="group relative"
            >
              <Link to={`/blog/${post.slug}`} className="group block relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <time className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        {formatDate(post.published_at)}
                      </time>
                      <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                      <div className="flex flex-wrap gap-2">
                        {post.tags?.map(tag => (
                          <span key={tag} className="text-xs text-emerald-500/80 font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-zinc-400 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-4 transition-all">
                      Read Article <ArrowRight size={16} className="text-emerald-500" />
                    </div>
                  </div>

                  {post.cover_image && (
                    <div className="w-full md:w-48 aspect-video md:aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
                      <img 
                        src={post.cover_image} 
                        alt={post.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                        loading="lazy" // Performance boost
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              </Link>
              {/* Subtle hover background effect */}
              <div className="absolute -inset-x-6 -inset-y-6 bg-zinc-900/0 group-hover:bg-zinc-800/20 rounded-3xl -z-0 transition-all duration-300" />
            </motion.article>
          ))
        ) : (
          <p className="text-zinc-500 text-center py-20">No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default Blog;
