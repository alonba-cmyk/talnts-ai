import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';

export function PlatformHero() {
  const fullTitle = 'AI Work Platform';
  const fullSubtitle = 'for any business result';
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [phase, setPhase] = useState<'title' | 'subtitle' | 'done'>('title');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'title') {
      if (displayedTitle.length < fullTitle.length) {
        timeout = setTimeout(() => {
          setDisplayedTitle(fullTitle.slice(0, displayedTitle.length + 1));
        }, 60);
      } else {
        timeout = setTimeout(() => setPhase('subtitle'), 300);
      }
    } else if (phase === 'subtitle') {
      if (displayedSubtitle.length < fullSubtitle.length) {
        timeout = setTimeout(() => {
          setDisplayedSubtitle(fullSubtitle.slice(0, displayedSubtitle.length + 1));
        }, 50);
      } else {
        setPhase('done');
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedTitle, displayedSubtitle, phase]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        {/* Sidekick Star Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center mb-10"
        >
          <div className="relative">
            <img
              src={sidekickLogo}
              alt="Sidekick"
              className="w-16 h-16 object-contain"
            />
            {/* Writing sparkle effect */}
            <motion.div
              className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full bg-[#6161ff]"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Main Title with Typewriter */}
        <div className="mb-4 min-h-[3.5rem] md:min-h-[4.5rem]">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            {displayedTitle}
            {phase === 'title' && (
              <motion.span
                className="inline-block w-[3px] h-[1em] bg-[#6161ff] ml-1 align-baseline"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            )}
          </h1>
        </div>

        {/* Subtitle with Typewriter */}
        <div className="min-h-[2.5rem] md:min-h-[3rem] mb-6">
          <p className="text-2xl md:text-4xl font-light text-gray-500">
            {displayedSubtitle}
            {phase === 'subtitle' && (
              <motion.span
                className="inline-block w-[3px] h-[0.9em] bg-[#6161ff] ml-1 align-baseline"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            )}
          </p>
        </div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: phase === 'done' ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-24 h-[2px] bg-gradient-to-r from-[#6161ff] to-[#00d2d2] mx-auto mt-8"
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'done' ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-gray-400 font-medium tracking-wide">
          Explore the platform
        </p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
