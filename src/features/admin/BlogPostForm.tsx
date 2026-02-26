import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { Save, X, Eye, Edit3, Plus, Trash2 } from 'lucide-react';
import MarkdownIt from 'markdown-it';
import { Post, useBlogStore } from '../../store/blogStore.ts';
import { cn } from '../../shared/utils.ts';
import ImageUpload from '../../components/ImageUpload.tsx';

const md = new MarkdownIt();

const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and hyphens only'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  cover_image: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  status: z.enum(['draft', 'published']),
});

type PostFormData = z.infer<typeof postSchema>;

interface BlogPostFormProps {
  post?: Post;
  onClose: () => void;
  onSuccess: () => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ post, onClose, onSuccess }) => {
  const [isPreview, setIsPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { addPost, updatePost } = useBlogStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: post ? {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image || '',
      tags: post.tags,
      status: post.status,
    } : {
      status: 'draft',
      tags: [],
    },
  });

  const content = watch('content');
  const tags = watch('tags') || [];

  const onSubmit = async (data: PostFormData) => {
    setSubmitError(null);
    try {
      if (post) {
        await updatePost(post.id, data);
      } else {
        await addPost(data);
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving post:', error);
      setSubmitError(error.response?.data?.message || 'Error saving post. Please check all fields.');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(t => t !== tagToRemove));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
    >
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 sticky top-0 z-10">
        <h3 className="text-xl font-bold text-white">
          {post ? 'Edit Post' : 'Create New Post'}
        </h3>
        <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 overflow-y-auto flex-1">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Title</label>
            <input
              {...register('title')}
              className={cn(
                "w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors",
                errors.title && "border-red-500/50"
              )}
              placeholder="Post title"
              onChange={(e) => {
                register('title').onChange(e);
                if (!post) {
                  setValue('slug', e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                }
              }}
            />
            {errors.title && <p className="text-xs text-red-500 ml-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Slug</label>
            <input
              {...register('slug')}
              className={cn(
                "w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors",
                errors.slug && "border-red-500/50"
              )}
              placeholder="post-slug"
            />
            {errors.slug && <p className="text-xs text-red-500 ml-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Excerpt</label>
          <textarea
            {...register('excerpt')}
            rows={2}
            className={cn(
              "w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none",
              errors.excerpt && "border-red-500/50"
            )}
            placeholder="Brief summary of the post..."
          />
          {errors.excerpt && <p className="text-xs text-red-500 ml-1">{errors.excerpt.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Content (Markdown)</label>
            <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsPreview(false)}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-md transition-all",
                  !isPreview ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setIsPreview(true)}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-md transition-all",
                  isPreview ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                Preview
              </button>
            </div>
          </div>
          
          {isPreview ? (
            <div 
              className="w-full min-h-[300px] p-6 bg-zinc-950 border border-zinc-800 rounded-xl markdown-body overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: md.render(content || '') }}
            />
          ) : (
            <textarea
              {...register('content')}
              rows={12}
              className={cn(
                "w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors",
                errors.content && "border-red-500/50"
              )}
              placeholder="# Your markdown content here..."
            />
          )}
          {errors.content && <p className="text-xs text-red-500 ml-1">{errors.content.message}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ImageUpload
            label="Cover Image"
            value={watch('cover_image') || ''}
            onChange={(url) => setValue('cover_image', url)}
            className="md:col-span-2"
          />

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Status</label>
            <select
              {...register('status')}
              className="w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(tag => (
              <span 
                key={tag} 
                className="flex items-center gap-2 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-zinc-300"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          {errors.tags && <p className="text-xs text-red-500 ml-1">{errors.tags.message}</p>}
        </div>

        {submitError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
            {submitError}
          </div>
        )}

        <div className="pt-6 border-t border-zinc-800 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-zinc-500 font-bold hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-white text-black rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BlogPostForm;
