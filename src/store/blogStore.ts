import { create } from 'zustand';
import axios from 'axios';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author?: string;
  cover_image?: string;
  tags: string[];
  status: 'draft' | 'published';
  published_at: string;
}

interface BlogState {
  posts: Post[];
  currentPost: Post | null;
  total: number;
  isLoading: boolean;
  fetchPosts: (page?: number, limit?: number) => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<void>;
  addPost: (post: Omit<Post, 'id' | 'published_at'>) => Promise<void>;
  updatePost: (id: string, post: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}
export const useBlogStore = create<BlogState>((set, get) => ({ // Add 'get' here
  posts: [],
  currentPost: null, // Initialize as null
  total: 0,
  isLoading: false,

  fetchPostBySlug: async (slug: string) => {
    set({ isLoading: true });
    try {
      // Logic: If we already have the posts loaded, find it locally first
      const existingPost = get().posts.find((p) => p.slug === slug);
      
      if (existingPost) {
        set({ currentPost: existingPost, isLoading: false });
      } else {
        // If user refreshed the page or shared a link, fetch from API
        const response = await axios.get(`/api/blog/${slug}`);
        set({ currentPost: response.data, isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      set({ currentPost: null, isLoading: false });
    }
  },

  fetchPosts: async (page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/api/blog?page=${page}&limit=${limit}`);
      set({ posts: response.data.posts, total: response.data.total, isLoading: false });
    } catch (error) {
      console.error("Error fetching posts:", error);
      set({ isLoading: false });
    }
  },

  addPost: async (post) => {
    set({ isLoading: true });
    try {
      const response = await axios.post('/api/blog', post);
      set((state) => ({ posts: [...state.posts, response.data], isLoading: false }));
    } catch (error) {
      console.error("Error adding post:", error);
      set({ isLoading: false });
    }
  },

  updatePost: async (id, post) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(`/api/blog/${id}`, post);
      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? response.data : p)),
        currentPost: state.currentPost?.id === id ? response.data : state.currentPost,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating post:", error);
      set({ isLoading: false });
    }
  },

  deletePost: async (id) => {
    set({ isLoading: true });
    try {
      await axios.delete(`/api/blog/${id}`);
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        currentPost: state.currentPost?.id === id ? null : state.currentPost,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting post:", error);
      set({ isLoading: false });
    }
  },
}));