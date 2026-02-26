import { create } from 'zustand';
import axios from 'axios';

interface About {
  name: string;
  title: string;
  bio: string;
  location?: string;
  whatsapp?: string;
  avatar_url?: string;
  tech_stack: string[];
  social_links: { platform: string; url: string }[];
}

interface AboutState {
  about: About | null;
  isLoading: boolean;
  fetchAbout: () => Promise<void>;
  updateAbout: (data: Partial<About>) => Promise<void>;
}

export const useAboutStore = create<AboutState>((set) => ({
  about: null,
  isLoading: false,
  fetchAbout: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('/api/about');
      set({ about: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
  updateAbout: async (data) => {
    try {
      const response = await axios.put('/api/about', data);
      set({ about: response.data });
    } catch (error) {
      console.error('Error updating about:', error);
    }
  },
}));
