import React from 'react';
import { Code, Search, Database, Shield } from 'lucide-react';
import { personalInfo, services } from '../mock/mockData';

const iconMap = {
  code: Code,
  search: Search,
  database: Database,
  shield: Shield
};

const About = () => {
  return (
    <section className="min-h-screen bg-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">sobre mí</h2>
          <div className="h-1 w-24 bg-emerald-500"></div>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Profile Image */}
          <div className="lg:col-span-1">
            <div className="relative">
              <img
                src={personalInfo.profileImage}
                alt={personalInfo.name}
                className="w-full aspect-[3/4] object-cover rounded-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                <h3 className="text-2xl font-bold text-white mb-1">{personalInfo.name}</h3>
                <p className="text-emerald-500">{personalInfo.title}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-emerald-500 mb-6 flex-wrap">
              <span>{personalInfo.age}</span>
              <span className="text-gray-600">/</span>
              <span>{personalInfo.location}</span>
              <span className="text-gray-600">/</span>
              <span>{personalInfo.status}</span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">
              {personalInfo.bio}
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h3 className="text-5xl md:text-6xl font-bold text-white mb-12">mis servicios</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <div
                  key={service.id}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 hover:border-emerald-500/50 transition-all group"
                >
                  <div className="w-14 h-14 bg-[#2a2a2a] rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 transition-colors">
                    <Icon size={28} className="text-emerald-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3">{service.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;