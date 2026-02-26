import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink, Filter } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore.ts';
import { cn } from '../../shared/utils.ts';

const Projects = () => {
  const { projects, fetchProjects, isLoading } = useProjectStore();
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const allTechs = ['All', ...new Set(projects.flatMap(p => p.technologies))];
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.technologies.includes(filter));

  return (
    <div className="max-w-6xl">
      <header className="mb-12">
        <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Selected Works</h2>
        <p className="text-zinc-400 max-w-xl">
          A collection of projects that demonstrate my technical expertise and design sensibility.
        </p>
      </header>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        {allTechs.map((tech) => (
          <button
            key={tech}
            onClick={() => setFilter(tech)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              filter === tech 
                ? "bg-white text-black" 
                : "bg-zinc-900 text-zinc-500 hover:text-zinc-200 border border-zinc-800"
            )}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: index * 0.05 
              }}
              className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-colors"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={project.image_url || `https://picsum.photos/seed/${project.slug}/800/450`} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map(tech => (
                    <span key={tech} className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                      {tech}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-sm line-clamp-2 mb-6">
                  {project.description}
                </p>
                
                <div className="flex items-center gap-4">
                  {project.github_url && (
                    <a href={project.github_url} className="text-zinc-500 hover:text-white transition-colors">
                      <Github size={20} />
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} className="text-zinc-500 hover:text-white transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Projects;
