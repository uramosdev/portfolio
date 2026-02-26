import { create } from 'zustand';
import axios from 'axios';

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
}

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  isLoading: false,
  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('/api/projects');
      set({ projects: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
  addProject: async (data) => {
    const response = await axios.post('/api/projects', data);
    set((state) => ({ projects: [response.data, ...state.projects] }));
  },
  updateProject: async (id, data) => {
    const response = await axios.put(`/api/projects/${id}`, data);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? response.data : p)),
    }));
  },
  deleteProject: async (id) => {
    await axios.delete(`/api/projects/${id}`);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));
  },
}));
