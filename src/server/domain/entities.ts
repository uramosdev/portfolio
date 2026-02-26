export interface User {
  id: string;
  email: string;
  password?: string;
  role: string;
  created_at: string;
}

export interface About {
  id: string;
  name: string;
  title: string;
  bio: string;
  location?: string;
  whatsapp?: string;
  avatar_url?: string;
  tech_stack: string[];
  social_links: {
    platform: string;
    url: string;
  }[];
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image_url?: string;
  github_url?: string;
  live_url?: string;
  technologies: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

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
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
