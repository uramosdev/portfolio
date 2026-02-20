import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { personalInfo } from '../mock/mockData';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const nameVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl text-center"
      >
        {/* Main Heading */}
        <motion.div variants={nameVariants}>
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-6">
            {personalInfo.name.split(' ')[0]}
            <br />
            <span className="text-emerald-500">{personalInfo.name.split(' ')[1]}</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-2xl md:text-3xl text-gray-400 mb-4"
        >
          {personalInfo.title}
        </motion.p>

        {/* Info Line */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 text-emerald-500 mb-12 flex-wrap"
        >
          <span>{personalInfo.age}</span>
          <span className="text-gray-600">/</span>
          <span>{personalInfo.location}</span>
          <span className="text-gray-600">/</span>
          <span>{personalInfo.status}</span>
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(74, 222, 128, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors mb-12"
          >
            Ver mi trabajo
          </motion.button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-6"
        >
          <motion.a
            href={personalInfo.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-emerald-500 hover:bg-[#2a2a2a] transition-all"
          >
            <Github size={20} />
          </motion.a>
          <motion.a
            href={personalInfo.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-emerald-500 hover:bg-[#2a2a2a] transition-all"
          >
            <Linkedin size={20} />
          </motion.a>
          <motion.a
            href={personalInfo.socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-emerald-500 hover:bg-[#2a2a2a] transition-all"
          >
            <Twitter size={20} />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Home;