import React, { useEffect, useState, useMemo } from 'react';
import { MapPin, Phone } from 'lucide-react';
import { useAboutStore } from '../../store/aboutStore.ts';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
  </div>
);

const About = () => {
  const { about, fetchAbout, isLoading } = useAboutStore();
  const [displayText, setDisplayText] = useState('');
  
  // The strings you want to cycle through
  const phrases = useMemo(() => [
    'Web Developer',
    'Full-Stack',
    'Passionate Coder',
    'Problem Solver',
    'Tech Enthusiast'
  ], [about?.title]);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  useEffect(() => {
    if (isLoading || !about) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];
      
      setDisplayText(currentPhrase.slice(0, charIndex));

      let speed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex < currentPhrase.length) {
        charIndex++;
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
      } else if (charIndex === currentPhrase.length) {
        isDeleting = true;
        speed = 2000; // Pause at full word
      } else if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length; // Move to next phrase
        speed = 500;
      }

      timeoutId = setTimeout(type, speed);
    };

    type();
    return () => clearTimeout(timeoutId);
  }, [isLoading, about, phrases]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="relative -mt-24 -mx-6 lg:-mt-12 lg:-mx-12">
        <header className="relative min-h-[95vh] lg:min-h-[85vh] w-full overflow-hidden mb-12 sm:mb-16 flex flex-col justify-center">
          <img
            src="/uploads/about-bg.jpg"
            alt="Code Background"
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.15]"
            referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950 lg:bg-gradient-to-r lg:from-zinc-950 lg:via-zinc-950/60 lg:to-transparent" />

          <div className="relative h-full flex flex-col justify-center pt-24 pb-12 lg:py-0 px-6 lg:px-12 max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <div className="mb-4 sm:mb-6">
                <p className="text-emerald-500 font-mono mb-4 text-lg">Hello, I'm</p>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 tracking-tight">{about?.name}</h1>
              </div>
              {/* The Bracket Container */}
              <div className="flex items-center font-mono text-2xl md:text-3xl mb-10">
                <span className="text-emerald-500 mr-2">{'{'}</span>
                <span className="text-zinc-300">{displayText}</span>
                <span className="w-2 h-8 ml-1 bg-emerald-500 animate-pulse" />
                <span className="text-emerald-500 ml-2">{'}'}</span>
              </div>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-prose">
                {about?.bio}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8">
                {about?.location && (
                  <div className="flex items-center gap-3 text-zinc-400 group">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900/50 flex items-center justify-center border border-zinc-800 group-hover:border-emerald-500/50 transition-colors">
                      <MapPin size={14} className="text-emerald-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Location</span>
                      <span className="text-xs font-medium text-zinc-200">{about.location}</span>
                    </div>
                  </div>
                )}
                {about?.whatsapp && (
                  <div className="flex items-center gap-3 text-zinc-400 group">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900/50 flex items-center justify-center border border-zinc-800 group-hover:border-emerald-500/50 transition-colors">
                      <Phone size={14} className="text-emerald-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">WhatsApp</span>
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
            </div>
          </div>
        </header>

        <div className="max-w-5xl px-6 lg:px-12 mx-auto">
          <section className="mb-16 sm:mb-24">
            <div className="flex items-center gap-4 mb-8 sm:mb-12">
              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-emerald-500 whitespace-nowrap">
                Tech Stack
              </h3>
              <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 to-transparent" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {about?.tech_stack.map((tech) => (
                <div
                  key={tech}
                  className="px-4 py-3 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all cursor-default group text-center"
                >
                  <span className="text-xs sm:text-sm font-medium text-zinc-400 group-hover:text-emerald-400 transition-colors">
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="pb-20">
            <div className="flex items-center gap-4 mb-8 sm:mb-12">
              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-emerald-500 whitespace-nowrap">
                Philosophy
              </h3>
              <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 to-transparent" />
            </div>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-10">
              <div className="p-6 sm:p-8 bg-zinc-900/20 border border-zinc-800/40 rounded-[2rem] hover:border-zinc-700/50 transition-colors">
                <h4 className="text-white text-base sm:text-lg font-bold mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Clean Architecture
                </h4>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  I believe in building software that is easy to maintain, test, and scale. Decoupling business logic from infrastructure is key to long-term success.
                </p>
              </div>
              <div className="p-6 sm:p-8 bg-zinc-900/20 border border-zinc-800/40 rounded-[2rem] hover:border-zinc-700/50 transition-colors">
                <h4 className="text-white text-base sm:text-lg font-bold mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  User-Centric Design
                </h4>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Performance and accessibility are not features; they are requirements. Every pixel should serve a purpose and enhance the user experience.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
};

export default About;
