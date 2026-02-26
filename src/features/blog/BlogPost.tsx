import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Tag, Clock } from 'lucide-react';
import { useBlogStore } from '../../store/blogStore';
import { formatDate } from '../../shared/utils';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentPost, fetchPostBySlug, isLoading } = useBlogStore();

  useEffect(() => {
    if (slug) fetchPostBySlug(slug);
    // Scroll to top when post loads
    window.scrollTo(0, 0);
  }, [slug, fetchPostBySlug]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!currentPost) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-white mb-4">Post not found</h2>
      <Link to="/blog" className="text-emerald-500 hover:underline">Return to blog</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link 
        to="/blog" 
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors mb-12 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to insights
      </Link>

      <article>
        {/* Header Metadata */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 mb-6">
            <time className="flex items-center gap-2">
              <Calendar size={16} className="text-emerald-500" />
              {formatDate(currentPost.published_at)}
            </time>
            <span className="flex items-center gap-2">
              <Tag size={16} className="text-emerald-500" />
              <div className="flex gap-2">
                {currentPost.tags?.map(tag => (
                  <span key={tag} className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {tag}
                  </span>
                ))}
              </div>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
            {currentPost.title}
          </h1>

          <p className="text-xl text-zinc-400 leading-relaxed italic border-l-4 border-emerald-500 pl-6 mb-10">
            {currentPost.excerpt}
          </p>

          {/* Hero Image */}
          {currentPost.cover_image && (
            <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-emerald-500/5">
              <img 
                src={currentPost.cover_image.startsWith('http') ? currentPost.cover_image : `/uploads/${currentPost.cover_image}`}
                alt={currentPost.title}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}
        </header>

        {/* Article Body */}
        <div className="prose prose-invert prose-emerald max-w-none">
          <div className="text-zinc-300 leading-relaxed text-lg whitespace-pre-wrap selection:bg-emerald-500/30">
            {currentPost.content}
          </div>
        </div>
        
        {/* Footer info */}
        <footer className="mt-20 pt-10 border-t border-zinc-900 text-zinc-500 text-sm">
          <p>Written by {currentPost.author || 'Ubaldino Ramos'}</p>
        </footer>
      </article>
    </div>
  );
};

export default BlogPost;