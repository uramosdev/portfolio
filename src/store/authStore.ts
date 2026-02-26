import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user) => set({ user }),
      logout: async () => {
        try {
          await axios.post('/api/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        }
        set({ user: null });
      },
      refreshAccessToken: async () => {
        try {
          const response = await axios.post('/api/auth/refresh');
          set({ user: response.data.user });
        } catch (error) {
          set({ user: null });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Axios Config
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await useAuthStore.getState().refreshAccessToken();
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
