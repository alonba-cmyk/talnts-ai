import { useMemo } from 'react';
import { motion } from 'motion/react';
import { AI_COMPANIES } from './aiCompanies';

const COLS_DESKTOP = 10;
const MAX_ROWS = 3;

export function FrameworksShowcase() {
  const visibleCompanies = useMemo(
    () => AI_COMPANIES.slice(0, COLS_DESKTOP * MAX_ROWS),
    [],
  );

  return (
    <section className="relative py-10 sm:py-20 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      <div className="relative max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white leading-snug max-w-[280px] sm:max-w-none mx-auto">
            Welcoming agents from {AI_COMPANIES.length}+ frameworks & platforms
          </h2>
        </motion.div>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5 sm:gap-3">
          {visibleCompanies.map((company, i) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.3, delay: i * 0.015 }}
              className="group flex flex-col items-center gap-1.5 sm:gap-2"
            >
              <div className="w-full aspect-square rounded-xl bg-[#141414] border border-[#1e1e1e] flex items-center justify-center p-4 sm:p-5 hover:border-[#2a2a2a] hover:bg-[#181818] transition-all duration-200">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-3/4 h-3/4 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                  loading="lazy"
                />
              </div>
              <span className="font-mono text-[9px] sm:text-[10px] text-white/70 group-hover:text-white text-center leading-tight transition-colors duration-200 truncate w-full px-0.5">
                {company.name}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-mono text-base px-8 py-3 rounded-lg border border-[#00D2D2]/50 text-[#00D2D2] bg-[#00D2D2]/5 hover:bg-[#00D2D2]/15 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,210,210,0.2)]"
          >
            <span className="text-[#00D2D2]/50 mr-2">$</span>
            monday signup --agent --free
          </button>
          <button
            onClick={() => document.getElementById('api')?.scrollIntoView({ behavior: 'smooth' })}
            className="hidden sm:flex font-mono text-sm px-6 py-3 rounded-lg border border-[#808080]/30 text-[#808080] hover:text-[#e0e0e0] hover:border-[#e0e0e0]/30 transition-all duration-300"
          >
            See monday API
          </button>
        </div>
      </div>
    </section>
  );
}
