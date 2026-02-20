import React, { useState, useEffect } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { projects as mockProjects } from '../mock/mockData';
import projectService from '../services/projectService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Error al cargar los proyectos');
      // Fallback to mock data if API fails
      setProjects(mockProjects);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#1a1a1a] py-20 px-6 flex items-center justify-center">
        <div className="text-gray-400">Cargando proyectos...</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#1a1a1a] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">mis proyectos</h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-emerald-500"
          ></motion.div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all group"
            >
              {/* Project Image */}
              <div className="relative overflow-hidden aspect-video">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-400 transition-colors"
                  >
                    <ExternalLink size={20} className="text-black" />
                  </motion.a>
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Github size={20} className="text-black" />
                  </motion.a>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-3 py-1 bg-[#2a2a2a] text-emerald-500 text-xs rounded-full"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;