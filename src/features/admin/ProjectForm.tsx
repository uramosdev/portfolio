import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { Project, useProjectStore } from '../../store/projectStore.ts';
import { cn } from '../../shared/utils.ts';
import ImageUpload from '../../components/ImageUpload.tsx';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and hyphens only'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().optional().or(z.literal('')),
  image_url: z.string().optional().or(z.literal('')),
  github_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  live_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  is_featured: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose, onSuccess }) => {
  const [techInput, setTechInput] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { addProject, updateProject } = useProjectStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project ? {
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content || '',
      image_url: project.image_url || '',
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      technologies: project.technologies,
      is_featured: project.is_featured,
    } : {
      is_featured: false,
      technologies: [],
    },
  });

  const technologies = watch('technologies') || [];

  const onSubmit = async (data: ProjectFormData) => {
    setSubmitError(null);
    try {
      if (project) {
        await updateProject(project.id, data);
      } else {
        await addProject(data);
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving project:', error);
      setSubmitError(error.response?.data?.message || 'Error saving project. Please check all fields.');
    }
  };

  const addTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setValue('technologies', [...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTech = (techToRemove: string) => {
    setValue('technologies', technologies.filter(t => t !== techToRemove));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
    >
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 sticky top-0 z-10">
        <h3 className="text-xl font-bold text-white">
          {project ? 'Edit Project' : 'Create New Project'}
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
              placeholder="Project title"
              onChange={(e) => {
                register('title').onChange(e);
                if (!project) {
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
              placeholder="project-slug"
            />
            {errors.slug && <p className="text-xs text-red-500 ml-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Description</label>
          <textarea
            {...register('description')}
            rows={2}
            className={cn(
              "w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none",
              errors.description && "border-red-500/50"
            )}
            placeholder="Brief summary of the project..."
          />
          {errors.description && <p className="text-xs text-red-500 ml-1">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Content (Optional)</label>
          <textarea
            {...register('content')}
            rows={6}
            className={cn(
              "w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors",
              errors.content && "border-red-500/50"
            )}
            placeholder="Detailed project information..."
          />
          {errors.content && <p className="text-xs text-red-500 ml-1">{errors.content.message}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ImageUpload
            label="Project Image"
            value={watch('image_url') || ''}
            onChange={(url) => setValue('image_url', url)}
            className="md:col-span-2"
          />

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Featured</label>
            <div className="flex items-center h-[50px]">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  {...register('is_featured')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className="ml-3 text-sm font-medium text-zinc-400">Show on homepage</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">GitHub URL</label>
            <input
              {...register('github_url')}
              className={cn(
                "w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors",
                errors.github_url && "border-red-500/50"
              )}
              placeholder="https://github.com/user/repo"
            />
            {errors.github_url && <p className="text-xs text-red-500 ml-1">{errors.github_url.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Live URL</label>
            <input
              {...register('live_url')}
              className={cn(
                "w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors",
                errors.live_url && "border-red-500/50"
              )}
              placeholder="https://project-live.com"
            />
            {errors.live_url && <p className="text-xs text-red-500 ml-1">{errors.live_url.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Technologies</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {technologies.map(tech => (
              <span 
                key={tech} 
                className="flex items-center gap-2 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-zinc-300"
              >
                {tech}
                <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-500">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTech();
                }
              }}
              className="flex-1 px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Add a technology (e.g. React)..."
            />
            <button
              type="button"
              onClick={addTech}
              className="px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          {errors.technologies && <p className="text-xs text-red-500 ml-1">{errors.technologies.message}</p>}
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
            {isSubmitting ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProjectForm;
