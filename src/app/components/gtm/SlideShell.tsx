import { motion } from 'motion/react';
import { type ReactNode } from 'react';

interface SlideShellProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export default function SlideShell({ children, className = '', dark = true }: SlideShellProps) {
  const isDark = dark;

  return (
    <section
      className={`relative min-h-screen w-full snap-start flex flex-col items-center justify-center overflow-hidden ${
        isDark ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]'
      } ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24"
      >
        {children}
      </motion.div>
    </section>
  );
}

export function SlideTitle({
  children,
  className = '',
  dark,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  const isDark = dark ?? false;
  return (
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className={`text-3xl md:text-4xl font-semibold leading-tight mb-3 tracking-tight ${
        isDark ? 'text-white' : 'text-[#1a1a1a]'
      } ${className}`}
    >
      {children}
    </motion.h2>
  );
}

export function SlideSubtitle({
  children,
  className = '',
  dark,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  const isDark = dark ?? false;
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`text-base md:text-lg mb-10 max-w-2xl leading-relaxed ${
        isDark ? 'text-white/50' : 'text-[#6b6b6b]'
      } ${className}`}
    >
      {children}
    </motion.p>
  );
}

export function StaggerChild({
  children,
  index = 0,
  className = '',
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.08 + index * 0.06 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideBadge({
  children,
  dark,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  const isDark = dark ?? false;
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`inline-block text-[10px] font-semibold tracking-wider uppercase mb-4 px-3 py-1 rounded-full border ${
        isDark
          ? 'text-white/30 bg-white/[0.04] border-white/[0.06]'
          : 'text-[#8a8a8a] bg-[#f0f0f0] border-[#e8e8e8]'
      }`}
    >
      {children}
    </motion.span>
  );
}
