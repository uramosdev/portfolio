import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { LogIn, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore.ts';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/login', data);
      setAuth(response.data.user);
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection or if the server is running.');
      } else {
        setError(err.response?.data?.message || 'Invalid credentials or server error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 rounded-2xl mb-4">
            <LogIn className="text-emerald-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          <p className="text-zinc-500">Access your portfolio dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email</label>
            <input
              {...register('email')}
              className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="admin@example.com"
            />
            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
