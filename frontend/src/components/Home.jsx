import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { personalInfo } from '../mock/mockData';

const Home = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      <div className="max-w-4xl text-center">
        {/* Main Heading */}
        <h1 className="text-7xl md:text-9xl font-bold text-white mb-6">
          {personalInfo.name.split(' ')[0]}
          <br />
          <span className="text-emerald-500">{personalInfo.name.split(' ')[1]}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-gray-400 mb-4">
          {personalInfo.title}
        </p>

        {/* Info Line */}
        <div className="flex items-center justify-center gap-4 text-emerald-500 mb-12 flex-wrap">
          <span>{personalInfo.age}</span>
          <span className="text-gray-600">/</span>
          <span>{personalInfo.location}</span>
          <span className="text-gray-600">/</span>
          <span>{personalInfo.status}</span>
        </div>

        {/* CTA Button */}
        <button className="px-8 py-4 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors mb-12">
          Ver mi trabajo
        </button>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6">
          <a
            href={personalInfo.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-emerald-500 hover:bg-[#2a2a2a] transition-all"
          >
            <Github size={20} />
          </a>
          <a
            href={personalInfo.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-emerald-500 hover:bg-[#2a2a2a] transition-all"
          >
            <Linkedin size={20} />
          </a>
          <a
            href={personalInfo.socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-emerald-500 hover:bg-[#2a2a2a] transition-all"
          >
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;