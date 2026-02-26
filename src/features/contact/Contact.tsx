import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, MapPin, Phone } from 'lucide-react';
import axios from 'axios';
import { useAboutStore } from '../../store/aboutStore.ts';
import { cn } from '../../shared/utils.ts';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject is too short'),
  message: z.string().min(10, 'Message is too short'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');
  const { about, fetchAbout } = useAboutStore();

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    try {
      await axios.post('/api/contact', data);
      setStatus('success');
      reset();
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-zinc-900/40 border border-zinc-800/60 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-sm">
        <header className="mb-10 text-center">
          <div className="mb-6">
            <span className="text-emerald-500 font-mono text-xs tracking-[0.2em] uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Contact</span>
            <h1 className="text-3xl font-bold text-white mt-4">{about?.name}</h1>
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Get in touch</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Have a project in mind or just want to say hi? I'm always open to discussing new opportunities.
          </p>

          <div className="flex flex-col gap-3 mt-8">
            {about?.location && (
              <div className="flex items-center justify-center gap-3 text-zinc-400 bg-zinc-950/50 px-4 py-3 rounded-2xl border border-zinc-800/50">
                <MapPin size={16} className="text-emerald-500" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">City / Region</span>
                  <span className="text-xs font-medium text-zinc-200">{about.location}</span>
                </div>
              </div>
            )}
            {about?.whatsapp && (
              <div className="flex items-center justify-center gap-3 text-zinc-400 bg-zinc-950/50 px-4 py-3 rounded-2xl border border-zinc-800/50">
                <Phone size={16} className="text-emerald-500" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">WhatsApp</span>
                  <a 
                    href={`https://wa.me/${about.whatsapp.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-zinc-200 hover:text-emerald-400 transition-colors"
                  >
                    {about.whatsapp}
                  </a>
                </div>
              </div>
            )}
          </div>
        </header>

        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-center"
          >
            <CheckCircle2 className="mx-auto mb-4 text-emerald-500" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
            <p className="text-zinc-400 mb-6 text-sm">Thank you for reaching out. I'll get back to you as soon as possible.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors text-sm"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Name</label>
                <input
                  {...register('name')}
                  className={cn(
                    "w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors",
                    errors.name && "border-red-500/50"
                  )}
                  placeholder="Your name"
                />
                {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email</label>
                <input
                  {...register('email')}
                  className={cn(
                    "w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors",
                    errors.email && "border-red-500/50"
                  )}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Subject</label>
              <input
                {...register('subject')}
                className={cn(
                  "w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors",
                  errors.subject && "border-red-500/50"
                )}
                placeholder="What's this about?"
              />
              {errors.subject && <p className="text-[10px] text-red-500 ml-1">{errors.subject.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Message</label>
              <textarea
                {...register('message')}
                rows={4}
                className={cn(
                  "w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none",
                  errors.message && "border-red-500/50"
                )}
                placeholder="Tell me more..."
              />
              {errors.message && <p className="text-[10px] text-red-500 ml-1">{errors.message.message}</p>}
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs">
                <AlertCircle size={16} />
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-8 py-3.5 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50 text-sm"
            >
              {status === 'loading' ? 'Sending...' : (
                <>
                  Send Message <Send size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
