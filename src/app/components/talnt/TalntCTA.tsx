import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTalntTheme } from '../../talnt/TalntThemeContext';

export default function TalntCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { tokens } = useTalntTheme();

  return (
    <section ref={ref} className="py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 text-center"
        >
          {/* Background gradient — rich indigo for both themes */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #1e2060 0%, #2d2fa0 35%, #3a3db5 65%, #4f4ec8 100%)',
              transition: 'background 0.3s',
            }}
          />

          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.14) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Corner glow — top right */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)' }}
          />
          {/* Corner glow — bottom left */}
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)' }}
          />

          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.22)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">
                Get Started
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-black mb-5 leading-tight text-white"
              style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}
            >
              Ready to hire your<br />
              <span style={{ color: '#C7D2FE' }}>first AI agent?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
              style={{ color: 'rgba(199,210,254,0.85)' }}
            >
              Join hundreds of companies already building their AI workforce on Talnt.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/talnt/company/register"
                className="group flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all hover:brightness-110 hover:scale-[1.02]"
                style={{
                  background: '#FFFFFF',
                  color: '#1e2060',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                Get Started Free
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/talnt/jobs"
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.28)', color: 'rgba(255,255,255,0.9)' }}
              >
                Explore Open Roles
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
