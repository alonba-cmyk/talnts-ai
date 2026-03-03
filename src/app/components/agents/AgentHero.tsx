import { motion } from 'motion/react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';
import { v2HeroCopy, type HeroCopy } from './copy/heroCopy';
import { AI_COMPANIES, type AICompany } from './aiCompanies';
import { useSiteSettings } from '@/hooks/useSupabase';
import { HeroDemoElement, BgStreamOverlay, AGENT_TYPING_LINES, type HeroDemoStyle } from './HeroDemoElements';
// HeroLogo removed — BrandedHero now uses inline SVG mark + wordmark
// ─── Brand palette ───────────────────────────────────────────
const BRAND = {
  dotRed: '#FF3D57',
  dotYellow: '#FFCB00',
  dotGreen: '#00D2D2',
  purple: '#6161FF',
  teal: '#00D2D2',
  pink: '#FB275D',
  terminalGreen: '#00D2D2',
  humanWarm: '#FFB224',
} as const;

const BRAND_DOTS = [BRAND.dotRed, BRAND.dotYellow, BRAND.dotGreen];

// ─── ASCII art title ─────────────────────────────────────────
const ASCII_TITLE_LINES = [
  ` ███╗   ███╗ ██████╗ ███╗   ██╗██████╗  █████╗ ██╗   ██╗    ███████╗ ██████╗ ██████╗      █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗`,
  `████╗ ████║██╔═══██╗████╗  ██║██╔══██╗██╔══██╗╚██╗ ██╔╝    ██╔════╝██╔═══██╗██╔══██╗    ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝`,
  `██╔████╔██║██║   ██║██╔██╗ ██║██║  ██║███████║ ╚████╔╝     █████╗  ██║   ██║██████╔╝    ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ███████╗`,
  `██║╚██╔╝██║██║   ██║██║╚██╗██║██║  ██║██╔══██║  ╚██╔╝      ██╔══╝  ██║   ██║██╔══██╗    ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║`,
  `██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██████╔╝██║  ██║   ██║       ██║     ╚██████╔╝██║  ██║    ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ███████║`,
  `╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝   ╚═╝       ╚═╝      ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝`,
];

const ASCII_MOBILE_LINE1 = [
  ` ███╗   ███╗ ██████╗ ███╗   ██╗██████╗  █████╗ ██╗   ██╗`,
  `████╗ ████║██╔═══██╗████╗  ██║██╔══██╗██╔══██╗╚██╗ ██╔╝`,
  `██╔████╔██║██║   ██║██╔██╗ ██║██║  ██║███████║ ╚████╔╝ `,
  `██║╚██╔╝██║██║   ██║██║╚██╗██║██║  ██║██╔══██║  ╚██╔╝  `,
  `██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██████╔╝██║  ██║   ██║   `,
  `╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   `,
];

const ASCII_MOBILE_LINE2 = [
  `███████╗ ██████╗ ██████╗      █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗`,
  `██╔════╝██╔═══██╗██╔══██╗    ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝`,
  `█████╗  ██║   ██║██████╔╝    ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ███████╗`,
  `██╔══╝  ██║   ██║██╔══██╗    ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║`,
  `██║     ╚██████╔╝██║  ██║    ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ███████║`,
  `╚═╝      ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝`,
];

const GLITCH_BURSTS = [
  { start: 0, end: 120 },
  { start: 250, end: 350 },
  { start: 500, end: 580 },
  { start: 750, end: 800 },
  { start: 950, end: 970 },
];

function MobileTitleFallback() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="sm:hidden text-center"
    >
      <h1 className="text-4xl font-bold leading-tight flex flex-col">
        <span className="text-white">monday</span>
        <span
          style={{
            background: 'linear-gradient(90deg, #80d8d8, #00D2D2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          for agents
        </span>
      </h1>
    </motion.div>
  );
}

function AsciiGlitchTitle() {
  const [phase, setPhase] = useState<'hidden' | 'glitching' | 'stable'>('hidden');
  const [, setTick] = useState(0);
  const glitchData = useRef({ offsets: [0, 0, 0, 0, 0, 0], flicker: false, chromatic: 0 });
  const startRef = useRef(0);

  useEffect(() => {
    const t1 = setTimeout(() => {
      startRef.current = performance.now();
      setPhase('glitching');
    }, 1000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== 'glitching') return;
    let rafId: number;

    const tick = () => {
      const elapsed = performance.now() - startRef.current;

      if (elapsed > 1100) {
        glitchData.current = { offsets: [0, 0, 0, 0, 0, 0], flicker: false, chromatic: 0 };
        setPhase('stable');
        return;
      }

      const inBurst = GLITCH_BURSTS.some(b => elapsed >= b.start && elapsed <= b.end);

      if (inBurst) {
        glitchData.current = {
          offsets: ASCII_TITLE_LINES.map(() =>
            Math.random() > 0.6 ? (Math.random() - 0.5) * 10 : 0
          ),
          flicker: Math.random() > 0.82,
          chromatic: (Math.random() - 0.5) * 4,
        };
      } else {
        glitchData.current = { offsets: [0, 0, 0, 0, 0, 0], flicker: false, chromatic: 0 };
      }

      setTick(t => t + 1);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  if (phase === 'hidden') {
    return <div className="h-[34px] sm:h-[30px] md:h-[42px]" />;
  }

  const { offsets, flicker, chromatic } = glitchData.current;

  const preStyle = {
    background: `linear-gradient(90deg, #ffffff 0%, #ffffff 45%, #b0e0e8 65%, #00D2D2 90%)`,
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text' as const,
    filter: `drop-shadow(0 0 20px rgba(0,210,210,0.10))${
      phase === 'glitching' && chromatic
        ? ` drop-shadow(${chromatic}px 0 rgba(97,97,255,0.5))`
        : ''
    }`,
    opacity: flicker ? 0.15 : 1,
  };

  return (
    <>
      {/* Desktop: single line */}
      <pre
        className="hidden sm:block text-[6.5px] md:text-[9px] leading-none font-mono select-none whitespace-pre"
        style={preStyle}
      >
        {ASCII_TITLE_LINES.map((line, i) => (
          <div key={i} style={{ transform: offsets[i] ? `translateX(${offsets[i]}px)` : undefined }}>
            {line}
          </div>
        ))}
      </pre>
      {/* Mobile: two lines stacked */}
      <div className="sm:hidden flex flex-col items-center gap-1.5">
        <pre
          className="text-[5.2px] leading-none font-mono select-none whitespace-pre"
          style={preStyle}
        >
          {ASCII_MOBILE_LINE1.map((line, i) => (
            <div key={i} style={{ transform: offsets[i] ? `translateX(${offsets[i]}px)` : undefined }}>
              {line}
            </div>
          ))}
        </pre>
        <pre
          className="text-[5.2px] leading-none font-mono select-none whitespace-pre"
          style={preStyle}
        >
          {ASCII_MOBILE_LINE2.map((line, i) => (
            <div key={i} style={{ transform: offsets[i] ? `translateX(${offsets[i]}px)` : undefined }}>
              {line}
            </div>
          ))}
        </pre>
      </div>
    </>
  );
}
const BRAND_PRODUCTS = [BRAND.purple, BRAND.teal, BRAND.pink, BRAND.dotGreen];

export type AgentHeroVariant = 'matrix' | 'matrix_v2' | 'radar' | 'mcp_connect' | 'branded';
export type ViewerMode = 'agent' | 'human';
export type ContentStyle = 'v1' | 'v2';

interface AgentHeroProps {
  variant?: AgentHeroVariant;
  tone?: MessagingTone;
  viewerMode?: ViewerMode;
  contentStyle?: ContentStyle;
  onViewerModeChange?: (mode: ViewerMode) => void;
}

interface VariantProps {
  tone?: MessagingTone;
  viewerMode?: ViewerMode;
  contentStyle?: ContentStyle;
  onViewerModeChange?: (mode: ViewerMode) => void;
}

function useHeroCopy(tone: MessagingTone = 'belong_here', contentStyle: ContentStyle = 'v1'): HeroCopy {
  if (contentStyle === 'v2') return v2HeroCopy;
  return getAgentsCopy(tone).hero;
}

// ─── Shared hooks ────────────────────────────────────────────

function useTypingEffect(text: string, speed = 50, startWhen = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startWhen) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const type = () => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
        timeout = setTimeout(type, speed);
      } else {
        setDone(true);
      }
    };
    type();
    return () => clearTimeout(timeout);
  }, [text, speed, startWhen]);

  return { displayed, done };
}

function useSequentialLines(lines: string[], speed = 40, delayBetween = 200) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          setIsInView(true);
          started.current = true;
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timeouts.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          if (i === lines.length - 1) {
            setTimeout(() => setAllDone(true), 500);
          }
        }, i * (speed * 20 + delayBetween))
      );
    });
    return () => timeouts.forEach(clearTimeout);
  }, [isInView, lines.length, speed, delayBetween]);

  return { ref, visibleCount, allDone, isInView };
}

// ─── Shared components ───────────────────────────────────────

function BrandLogo({ className = '' }: { className?: string }) {
  const mondayArt = ` \u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2557   \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557   \u2588\u2588\u2557
 \u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u255a\u2588\u2588\u2557 \u2588\u2588\u2554\u255d
 \u2588\u2588\u2554\u2588\u2588\u2588\u2588\u2554\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2554\u2588\u2588\u2557 \u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u255a\u2588\u2588\u2588\u2588\u2554\u255d 
 \u2588\u2588\u2551\u255a\u2588\u2588\u2554\u255d\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551\u255a\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551  \u255a\u2588\u2588\u2554\u255d  
 \u2588\u2588\u2551 \u255a\u2550\u255d \u2588\u2588\u2551\u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2551 \u255a\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2551  \u2588\u2588\u2551   \u2588\u2588\u2551   
 \u255a\u2550\u255d     \u255a\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u2550\u2550\u255d\u255a\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u255d   \u255a\u2550\u255d`;

  const gradientStyle = {
    background: `linear-gradient(90deg, ${BRAND.dotRed}, ${BRAND.dotYellow}, ${BRAND.dotGreen})`,
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text' as const,
    filter: 'drop-shadow(0 0 20px rgba(0,210,210,0.15))',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
      className={`flex flex-col items-center gap-3 ${className}`}
    >
      <div className="relative inline-block">
        <pre
          className="text-[6px] sm:text-[8px] md:text-[10px] leading-none font-mono select-none whitespace-pre"
          style={gradientStyle}
        >
          {mondayArt}
        </pre>
        <span
          className="absolute -bottom-1 -right-1 sm:-right-2 font-mono text-xs sm:text-sm md:text-base font-bold select-none"
          style={{ color: BRAND.dotGreen }}
        >
          .com
        </span>
      </div>
      <p className="font-mono text-sm sm:text-base md:text-lg text-[#808080] tracking-wide hidden sm:block">
        <span className="text-[#606060]">// </span>
        <span className="text-[#a0a0a0]">built for humans.</span>
        <span className="text-[#00D2D2]"> now open to agents.</span>
      </p>
    </motion.div>
  );
}

function HeroCTAs({ show }: { show: boolean }) {
  const scrollToSignup = useCallback(() => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 20 }}
      transition={{ delay: show ? 0.5 : 0, duration: 0.6 }}
      className="mt-6 sm:mt-12 flex flex-col items-center"
      style={{ pointerEvents: show ? 'auto' : 'none' }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          data-agent-target="cta"
          onClick={scrollToSignup}
          className="group font-mono text-sm sm:text-base px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg border border-[#00D2D2]/50 text-[#00D2D2] bg-[#00D2D2]/5 hover:bg-[#00D2D2]/15 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,210,210,0.2)]"
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
      <p className="mt-3 text-xs font-mono text-[#808080]">No credit card needed ✦ Unlimited time on Free plan</p>
    </motion.div>
  );
}

function ScrollIndicator({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="mt-8 sm:mt-16 hidden sm:block"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="text-[#00D2D2]/40 font-mono text-sm"
      >
        ↓ scroll to explore ↓
      </motion.div>
    </motion.div>
  );
}

function BrandDots({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {BRAND_DOTS.map((color, i) => (
        <motion.div
          key={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300 }}
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  VARIANT 1 — Matrix Rain (enhanced with brand colors)
// ═══════════════════════════════════════════════════════════════

function MatrixRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>/\\|=+*monday';
    const fontSize = 14;
    const brandColors = [`${BRAND.dotRed}18`, `${BRAND.dotYellow}18`, `${BRAND.dotGreen}18`, `${BRAND.terminalGreen}15`];
    const brightColors = [`${BRAND.dotRed}40`, `${BRAND.dotYellow}40`, `${BRAND.dotGreen}40`, `${BRAND.terminalGreen}40`];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100);
    const colColors: number[] = Array(columns).fill(0).map(() => Math.floor(Math.random() * brandColors.length));

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const colorIdx = colColors[i];
        ctx.fillStyle = Math.random() > 0.97 ? brightColors[colorIdx] : brandColors[colorIdx];
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          colColors[i] = Math.floor(Math.random() * brandColors.length);
        }
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }} />;
}

function MatrixRainHero({ tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1' }: VariantProps) {
  const hero = useHeroCopy(tone, contentStyle);
  const isHuman = viewerMode === 'human';
  const [started, setStarted] = useState(false);
  const line1Text = isHuman ? hero.humanLine1 : hero.typingLine1;
  const line2Text = isHuman ? hero.humanLine2 : hero.typingLine2;
  const subtitleText = isHuman ? hero.humanSubtitle : hero.subtitle;
  const { displayed: line1, done: d1 } = useTypingEffect(line1Text, 35, started);
  const { displayed: line2, done: d2 } = useTypingEffect(line2Text, 35, d1);

  useEffect(() => { setTimeout(() => setStarted(true), 800); }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden">
      <MatrixRainCanvas />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] pointer-events-none z-10" />
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <BrandLogo />

        <div className="mt-8 space-y-3 text-left max-w-2xl mx-auto font-mono">
          {started && (
            <p className="text-sm sm:text-base" style={{ color: isHuman ? `${BRAND.humanWarm}cc` : '#00D2D2cc' }}>
              {line1}{!d1 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.humanWarm : '#00D2D2' }} />}
            </p>
          )}
          {d1 && (
            <p className="text-sm sm:text-base" style={{ color: isHuman ? `${BRAND.humanWarm}99` : '#00d2d2e6' }}>
              {line2}{!d2 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.humanWarm : '#00d2d2' }} />}
            </p>
          )}
        </div>

        {d2 && (
          <motion.p key={viewerMode + '-subtitle'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="mt-4 sm:mt-6 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed hidden sm:block">
            {subtitleText}
          </motion.p>
        )}

        {!isHuman && <HeroCTAs show={d2} />}
        <ScrollIndicator show={d2} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  VARIANT 2 — Radar Scan
// ═══════════════════════════════════════════════════════════════

function RadarCanvas({ mode = 'agent' }: { mode?: 'agent' | 'human' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const isHuman = modeRef.current === 'human';
      const primary = isHuman ? BRAND.humanWarm : BRAND.dotGreen;
      const secondary = isHuman ? '#FFCB00' : BRAND.dotYellow;
      const tertiary = isHuman ? '#FF9500' : BRAND.dotRed;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxR = Math.min(cx, cy) * 0.85;
      const time = Date.now() * 0.001;
      const angle = (time * 0.8) % (Math.PI * 2);

      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 1; i <= 4; i++) {
        const r = (maxR / 4) * i;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0 ? `${BRAND.purple}15` : `${isHuman ? BRAND.humanWarm : BRAND.teal}12`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      ctx.strokeStyle = '#ffffff08';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR); ctx.stroke();

      const gradient = ctx.createConicGradient(angle, cx, cy);
      gradient.addColorStop(0, `${primary}00`);
      gradient.addColorStop(0.03, `${primary}30`);
      gradient.addColorStop(0.08, `${secondary}15`);
      gradient.addColorStop(0.15, `${tertiary}08`);
      gradient.addColorStop(0.3, 'transparent');
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      const lineX = cx + Math.cos(angle) * maxR;
      const lineY = cy + Math.sin(angle) * maxR;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(lineX, lineY);
      ctx.strokeStyle = `${primary}80`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = primary;
      ctx.fill();

      const blipColors = isHuman
        ? [BRAND.humanWarm, '#FFCB00', '#FF9500']
        : BRAND_DOTS;
      const blipSeed = Math.floor(time * 2);
      for (let i = 0; i < 5; i++) {
        const blipAngle = ((blipSeed * 137.5 + i * 72) % 360) * (Math.PI / 180);
        const blipR = ((i + 1) / 5) * maxR * 0.9;
        const bx = cx + Math.cos(blipAngle) * blipR;
        const by = cy + Math.sin(blipAngle) * blipR;
        const angleDiff = ((angle - blipAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (angleDiff < 1.5) {
          const alpha = 1 - angleDiff / 1.5;
          const color = blipColors[i % 3];
          ctx.beginPath();
          ctx.arc(bx, by, 3, 0, Math.PI * 2);
          ctx.fillStyle = color + Math.round(alpha * 180).toString(16).padStart(2, '0');
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function RadarScanHero({ tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1' }: VariantProps) {
  const hero = useHeroCopy(tone, contentStyle);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const isHuman = viewerMode === 'human';
  const badgeColor = isHuman ? BRAND.humanWarm : BRAND.terminalGreen;
  const badgeText = isHuman ? 'HUMAN DETECTED' : hero.radarBadge;
  const line1Text = isHuman ? hero.humanLine1 : hero.typingLine1;
  const line2Text = isHuman ? hero.humanLine2 : hero.typingLine2;
  const subtitleText = isHuman ? hero.humanSubtitle : hero.subtitle;

  const { displayed: typed1, done: d1 } = useTypingEffect(line1Text, 30, phase >= 1);
  const { displayed: typed2, done: d2 } = useTypingEffect(line2Text, 30, d1);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden bg-[#0a0a0a]">
      <RadarCanvas mode={viewerMode} />

      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/60 pointer-events-none z-10" />

      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <BrandLogo />

        {phase >= 1 && (
          <motion.div
            key={viewerMode + '-badge'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="mt-3 sm:mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500"
              style={{
                borderColor: `${badgeColor}30`,
                backgroundColor: `${badgeColor}08`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse transition-colors duration-500"
                style={{ backgroundColor: badgeColor }}
              />
              <span className="font-mono text-xs transition-colors duration-500" style={{ color: badgeColor }}>
                {badgeText}
              </span>
            </div>
          </motion.div>
        )}

        {phase >= 1 && (
          <div className="mt-4 sm:mt-6 space-y-3 text-left max-w-2xl mx-auto font-mono">
            <p className="text-sm sm:text-base"
              style={{ color: isHuman ? `${BRAND.humanWarm}cc` : `${BRAND.terminalGreen}cc` }}>
              {typed1}{!d1 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.humanWarm : BRAND.terminalGreen }} />}
            </p>
            {d1 && (
              <p className="text-sm sm:text-base"
                style={{ color: isHuman ? `${BRAND.humanWarm}99` : `${BRAND.teal}cc` }}>
                {typed2}{!d2 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.humanWarm : BRAND.teal }} />}
              </p>
            )}
          </div>
        )}

        {d2 && (
          <motion.p
            key={viewerMode + '-subtitle'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-3 sm:mt-5 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed hidden sm:block"
          >
            {subtitleText}
          </motion.p>
        )}

        {!isHuman && <HeroCTAs show={d2} />}
        <ScrollIndicator show={d2} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CompanyLogo — simple logo for MCP Connect "Works with" strip
// ═══════════════════════════════════════════════════════════════

function CompanyLogoStrip({ company, size = 48 }: { company: AICompany; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const c = company.color;

  return (
    <div
      className="rounded-lg overflow-hidden border shrink-0 transition-transform hover:scale-105"
      style={{
        width: size,
        height: size,
        borderColor: `${c}40`,
        backgroundColor: '#141414',
      }}
      title={company.name}
    >
      {!imgError ? (
        <img
          src={company.logo}
          alt={company.name}
          className="w-full h-full object-contain p-2"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-mono text-lg font-bold"
          style={{ color: c }}
        >
          {company.name.charAt(0)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  VARIANT 3 — MCP Connect (with Works with logos strip)
// ═══════════════════════════════════════════════════════════════

const MCP_LOGOS = AI_COMPANIES.slice(0, 10);

function McpConnectHero({ tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1' }: VariantProps) {
  const hero = useHeroCopy(tone, contentStyle);
  const isHuman = viewerMode === 'human';
  const [started, setStarted] = useState(false);
  const line1Text = isHuman ? hero.humanLine1 : hero.typingLine1;
  const line2Text = isHuman ? hero.humanLine2 : hero.typingLine2;
  const subtitleText = isHuman ? hero.humanSubtitle : hero.subtitle;

  const { displayed: line1, done: d1 } = useTypingEffect(line1Text, 35, started);
  const { displayed: line2, done: d2 } = useTypingEffect(line2Text, 35, d1);

  useEffect(() => { setTimeout(() => setStarted(true), 800); }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden bg-[#0a0a0a]">
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <BrandLogo />

        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6161FF]/30 bg-[#6161FF]/10">
          <span className="font-mono text-xs" style={{ color: BRAND.purple }}>MCP READY</span>
        </div>

        <div className="mt-6 sm:mt-8 space-y-3 text-left max-w-2xl mx-auto font-mono">
          <p className="text-sm sm:text-base" style={{ color: `${BRAND.terminalGreen}cc` }}>
            {line1}{!d1 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: BRAND.terminalGreen }} />}
          </p>
          {d1 && (
            <p className="text-sm sm:text-base" style={{ color: `${BRAND.teal}cc` }}>
              {line2}{!d2 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: BRAND.teal }} />}
            </p>
          )}
        </div>

        {d2 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-4 sm:mt-6 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed hidden sm:block"
          >
            {subtitleText}
          </motion.p>
        )}

        {d2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 sm:mt-8"
          >
            <p className="font-mono text-xs text-[#606060] mb-3">Works with</p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {MCP_LOGOS.map((c) => (
                <CompanyLogoStrip key={c.id} company={c} size={48} />
              ))}
            </div>
          </motion.div>
        )}

        {!isHuman && <HeroCTAs show={d2} />}
        <ScrollIndicator show={d2} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  VARIANT — Matrix V2 (Improved)
// ═══════════════════════════════════════════════════════════════

function MatrixRainCanvasV2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>/\\|=+*monday';
    const fontSize = 14;
    const brandColors = [`${BRAND.dotRed}12`, `${BRAND.dotYellow}12`, `${BRAND.dotGreen}12`, `${BRAND.terminalGreen}10`];
    const brightColors = [`${BRAND.dotRed}30`, `${BRAND.dotYellow}30`, `${BRAND.dotGreen}30`, `${BRAND.terminalGreen}28`];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100);
    const colColors: number[] = Array(columns).fill(0).map(() => Math.floor(Math.random() * brandColors.length));

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const colorIdx = colColors[i];

        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const fadeFactor = Math.min(1, dist / (maxDist * 0.4));

        if (fadeFactor > 0.15) {
          ctx.globalAlpha = fadeFactor;
          ctx.fillStyle = Math.random() > 0.97 ? brightColors[colorIdx] : brandColors[colorIdx];
          ctx.fillText(char, x, y);
          ctx.globalAlpha = 1;
        }

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          colColors[i] = Math.floor(Math.random() * brandColors.length);
        }
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block" style={{ opacity: 0.5 }} />;
}

function MatrixRainHeroV2({ tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1' }: VariantProps) {
  const hero = useHeroCopy(tone, contentStyle);
  const isHuman = viewerMode === 'human';
  const [started, setStarted] = useState(false);
  const line1Text = isHuman ? hero.humanLine1 : hero.typingLine1;
  const line2Text = isHuman ? hero.humanLine2 : hero.typingLine2;
  const subtitleText = isHuman ? hero.humanSubtitle : hero.subtitle;
  const { displayed: line1, done: d1 } = useTypingEffect(line1Text, 35, started);
  const { displayed: line2, done: d2 } = useTypingEffect(line2Text, 35, d1);

  const scrollToSignup = useCallback(() => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { setTimeout(() => setStarted(true), 800); }, []);

  const headlineGradient = {
    background: `linear-gradient(90deg, ${BRAND.dotRed}, ${BRAND.dotYellow}, ${BRAND.dotGreen})`,
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text' as const,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden bg-[#0a0a0a]">
      <MatrixRainCanvasV2 />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] pointer-events-none z-10" />

      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center">
        <BrandLogo />

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
          style={headlineGradient}
        >
          Built for humans. Open to agents.
        </motion.h1>

        <div className="mt-6 sm:mt-8 space-y-3 text-left max-w-2xl mx-auto font-mono min-h-[3.5rem]">
          {started && (
            <p className="text-sm sm:text-base" style={{ color: isHuman ? `${BRAND.humanWarm}cc` : '#00D2D2cc' }}>
              {line1}{!d1 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.humanWarm : '#00D2D2' }} />}
            </p>
          )}
          {d1 && (
            <p className="text-sm sm:text-base" style={{ color: isHuman ? `${BRAND.humanWarm}99` : '#00d2d2e6' }}>
              {line2}{!d2 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.humanWarm : '#00d2d2' }} />}
            </p>
          )}
        </div>

        {d2 && (
          <motion.p key={viewerMode + '-subtitle'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="mt-4 sm:mt-6 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed hidden sm:block">
            {subtitleText}
          </motion.p>
        )}

        {!isHuman && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={scrollToSignup}
              className="font-mono text-lg px-10 py-4 rounded-lg border-2 border-[#00D2D2]/60 text-[#00D2D2] bg-[#00D2D2]/5 hover:bg-[#00D2D2]/15 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,210,210,0.25)] hover:border-[#00D2D2]/80"
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
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-6 font-mono text-xs text-[#606060] tracking-wider"
        >
          Trusted by 225,000+ organizations worldwide
        </motion.p>

        <ScrollIndicator show={d2} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  VARIANT — Branded (clean product hero)
// ═══════════════════════════════════════════════════════════════

function UnifiedDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mutedColors = ['#343866', '#3a4a80', '#2a6666', '#3a5060', '#4a3a70'];
    const vibrantColors = ['#6161FF', '#00D2D2', '#00CA72', '#A25AFF'];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw();
    };

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2;
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
      const spacing = 32;
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil(h / spacing);

      const accentCX = w * 0.85;
      const accentCY = h * 0.22;
      const accentInner = Math.min(w, h) * 0.08;
      const accentOuter = Math.min(w, h) * 0.22;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing + spacing / 2;
          const y = r * spacing + spacing / 2;

          const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          const normCenter = distFromCenter / maxDist;
          if (normCenter < 0.2) continue;

          const distFromAccent = Math.sqrt((x - accentCX) ** 2 + (y - accentCY) ** 2);

          let blend = 0;
          if (distFromAccent < accentInner) {
            blend = 1;
          } else if (distFromAccent < accentOuter) {
            blend = 1 - (distFromAccent - accentInner) / (accentOuter - accentInner);
            blend = blend * blend;
          }

          const hash = (r * 7 + c * 13) % 20;
          const radius = 1.2 + blend * 1.3;

          let color: string;
          let alpha: number;

          if (blend > 0.5) {
            const vi = hash % vibrantColors.length;
            color = vibrantColors[vi];
            alpha = 0.35 + blend * 0.3;
          } else if (blend > 0.05) {
            const useBright = hash % 3 === 0;
            if (useBright) {
              const vi = hash % vibrantColors.length;
              color = vibrantColors[vi];
              alpha = 0.15 + blend * 0.25;
            } else {
              const mi = hash % mutedColors.length;
              color = mutedColors[mi];
              alpha = 0.2 + blend * 0.2;
            }
          } else {
            const mi = hash % mutedColors.length;
            color = mutedColors[mi];
            alpha = Math.min(0.35, normCenter * 0.45);
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
          ctx.fill();
        }
      }
    }

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block" />;
}

function ViewerTogglePills({ mode, onChange }: { mode: ViewerMode; onChange?: (mode: ViewerMode) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm p-1"
    >
      {(['agent', 'human'] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange?.(m)}
          className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
            mode === m
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          {m === 'agent' ? 'Agent' : 'Human'}
        </button>
      ))}
    </motion.div>
  );
}

function BrandedGlow({ variant = 'wide' }: { variant?: 'wide' | 'logo' }) {
  if (variant === 'logo') {
    return (
      <img
        src="/small-flare.png"
        alt=""
        className="absolute pointer-events-none max-w-none w-[400px] sm:w-[500px]"
        style={{
          height: 'auto',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          mixBlendMode: 'screen',
          opacity: 0.7,
        }}
      />
    );
  }
  return (
    <img
      src="/small-flare.png"
      alt=""
      className="absolute pointer-events-none max-w-none w-[120vw]"
      style={{
        height: 'auto',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        mixBlendMode: 'screen',
        opacity: 0.75,
        WebkitMaskImage: 'linear-gradient(to bottom, white 40%, transparent 85%)',
        maskImage: 'linear-gradient(to bottom, white 40%, transparent 85%)',
      }}
    />
  );
}

function BrandedAmbientGlow() {
  return (
    <img
      src="/flare.png"
      alt=""
      className="absolute pointer-events-none w-[140vw] max-w-none"
      style={{
        height: 'auto',
        top: '15%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        mixBlendMode: 'screen',
        opacity: 0.6,
        WebkitMaskImage: 'linear-gradient(to bottom, white 30%, transparent 80%)',
        maskImage: 'linear-gradient(to bottom, white 30%, transparent 80%)',
      }}
    />
  );
}

function MondayGlowMark({ className = '' }: { className?: string }) {
  return (
    <img
      src="/monday-mark.png"
      alt="monday.com"
      className={className}
      style={{ opacity: 0.85 }}
    />
  );
}

function MondayWordmark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 610 89" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M48.4767 30.032C52.8287 30.032 56.3273 31.376 58.9727 34.064C61.6607 36.7093 63.0047 40.4213 63.0047 45.2V66H54.0447V46.416C54.0447 43.6427 53.3407 41.5307 51.9327 40.08C50.5247 38.5867 48.6047 37.84 46.1727 37.84C43.7407 37.84 41.7993 38.5867 40.3487 40.08C38.9407 41.5307 38.2367 43.6427 38.2367 46.416V66H29.2767V46.416C29.2767 43.6427 28.5727 41.5307 27.1647 40.08C25.7567 38.5867 23.8367 37.84 21.4047 37.84C18.93 37.84 16.9673 38.5867 15.5167 40.08C14.1087 41.5307 13.4047 43.6427 13.4047 46.416V66H4.44466V30.544H13.4047V34.832C14.5567 33.3387 16.0287 32.1653 17.8207 31.312C19.6553 30.4587 21.6607 30.032 23.8367 30.032C26.61 30.032 29.0847 30.6293 31.2607 31.824C33.4367 32.976 35.122 34.64 36.3167 36.816C37.4687 34.768 39.1327 33.1253 41.3087 31.888C43.5273 30.6507 45.9167 30.032 48.4767 30.032ZM86.1079 66.576C82.6946 66.576 79.6226 65.8293 76.8919 64.336C74.1613 62.8 72.0066 60.6453 70.4279 57.872C68.8919 55.0987 68.1239 51.8987 68.1239 48.272C68.1239 44.6453 68.9133 41.4453 70.4919 38.672C72.1133 35.8987 74.3106 33.7653 77.0839 32.272C79.8573 30.736 82.9506 29.968 86.3639 29.968C89.7773 29.968 92.8706 30.736 95.6439 32.272C98.4173 33.7653 100.593 35.8987 102.172 38.672C103.793 41.4453 104.604 44.6453 104.604 48.272C104.604 51.8987 103.772 55.0987 102.108 57.872C100.487 60.6453 98.2679 62.8 95.4519 64.336C92.6786 65.8293 89.5639 66.576 86.1079 66.576ZM86.1079 58.768C87.7293 58.768 89.2439 58.384 90.6519 57.616C92.1026 56.8053 93.2546 55.6107 94.1079 54.032C94.9613 52.4533 95.3879 50.5333 95.3879 48.272C95.3879 44.9013 94.4919 42.32 92.6999 40.528C90.9506 38.6933 88.7959 37.776 86.2359 37.776C83.6759 37.776 81.5213 38.6933 79.7719 40.528C78.0653 42.32 77.2119 44.9013 77.2119 48.272C77.2119 51.6427 78.0439 54.2453 79.7079 56.08C81.4146 57.872 83.5479 58.768 86.1079 58.768ZM129.681 30.032C133.905 30.032 137.319 31.376 139.921 34.064C142.524 36.7093 143.825 40.4213 143.825 45.2V66H134.865V46.416C134.865 43.6 134.161 41.4453 132.753 39.952C131.345 38.416 129.425 37.648 126.993 37.648C124.519 37.648 122.556 38.416 121.105 39.952C119.697 41.4453 118.993 43.6 118.993 46.416V66H110.033V30.544H118.993V34.96C120.188 33.424 121.703 32.2293 123.537 31.376C125.415 30.48 127.463 30.032 129.681 30.032ZM148.898 48.144C148.898 44.56 149.602 41.3813 151.01 38.608C152.461 35.8347 154.424 33.7013 156.898 32.208C159.373 30.7147 162.125 29.968 165.154 29.968C167.458 29.968 169.656 30.48 171.746 31.504C173.837 32.4853 175.501 33.808 176.738 35.472V18.64H185.826V66H176.738V60.752C175.629 62.5013 174.072 63.9093 172.066 64.976C170.061 66.0427 167.736 66.576 165.09 66.576C162.104 66.576 159.373 65.808 156.898 64.272C154.424 62.736 152.461 60.5813 151.01 57.808C149.602 54.992 148.898 51.7707 148.898 48.144ZM176.802 48.272C176.802 46.096 176.376 44.24 175.522 42.704C174.669 41.1253 173.517 39.9307 172.066 39.12C170.616 38.2667 169.058 37.84 167.394 37.84C165.73 37.84 164.194 38.2453 162.786 39.056C161.378 39.8667 160.226 41.0613 159.33 42.64C158.477 44.176 158.05 46.0107 158.05 48.144C158.05 50.2773 158.477 52.1547 159.33 53.776C160.226 55.3547 161.378 56.5707 162.786 57.424C164.237 58.2773 165.773 58.704 167.394 58.704C169.058 58.704 170.616 58.2987 172.066 57.488C173.517 56.6347 174.669 55.44 175.522 53.904C176.376 52.3253 176.802 50.448 176.802 48.272ZM191.13 48.144C191.13 44.56 191.834 41.3813 193.242 38.608C194.693 35.8347 196.634 33.7013 199.066 32.208C201.541 30.7147 204.293 29.968 207.322 29.968C209.968 29.968 212.272 30.5013 214.234 31.568C216.24 32.6347 217.84 33.9787 219.034 35.6V30.544H228.058V66H219.034V60.816C217.882 62.48 216.282 63.8667 214.234 64.976C212.229 66.0427 209.904 66.576 207.258 66.576C204.272 66.576 201.541 65.808 199.066 64.272C196.634 62.736 194.693 60.5813 193.242 57.808C191.834 54.992 191.13 51.7707 191.13 48.144ZM219.034 48.272C219.034 46.096 218.608 44.24 217.754 42.704C216.901 41.1253 215.749 39.9307 214.298 39.12C212.848 38.2667 211.29 37.84 209.626 37.84C207.962 37.84 206.426 38.2453 205.018 39.056C203.61 39.8667 202.458 41.0613 201.562 42.64C200.709 44.176 200.282 46.0107 200.282 48.144C200.282 50.2773 200.709 52.1547 201.562 53.776C202.458 55.3547 203.61 56.5707 205.018 57.424C206.469 58.2773 208.005 58.704 209.626 58.704C211.29 58.704 212.848 58.2987 214.298 57.488C215.749 56.6347 216.901 55.44 217.754 53.904C218.608 52.3253 219.034 50.448 219.034 48.272ZM269.586 30.544L247.634 82.768H238.098L245.778 65.104L231.57 30.544H241.618L250.77 55.312L260.05 30.544H269.586Z" fill="white"/>
      <g clipPath="url(#paint0_angular_branded_clip)">
        <g transform="matrix(0.056416 0.2545 -0.195672 0.101678 451.639 17.5)">
          <foreignObject x="-835.347" y="-835.347" width="1670.69" height="1670.69">
            <div style={{ background: 'conic-gradient(from 90deg, rgba(35,207,254,1) 0deg, rgba(26,213,255,1) 9.19695deg, rgba(51,213,142,1) 178.719deg, rgba(195,103,242,1) 193.783deg, rgba(35,207,254,1) 360deg)', height: '100%', width: '100%', opacity: 1 }} />
          </foreignObject>
        </g>
      </g>
      <defs>
        <clipPath id="paint0_angular_branded_clip">
          <path d="M308.672 37.904H302.464V66H293.376V37.904H289.344V30.544H293.376V28.752C293.376 24.4 294.613 21.2 297.088 19.152C299.563 17.104 303.296 16.144 308.288 16.272V23.824C306.112 23.7813 304.597 24.144 303.744 24.912C302.891 25.68 302.464 27.0667 302.464 29.072V30.544H308.672V37.904ZM329.079 66.576C325.666 66.576 322.594 65.8293 319.863 64.336C317.133 62.8 314.978 60.6453 313.399 57.872C311.863 55.0987 311.095 51.8987 311.095 48.272C311.095 44.6453 311.885 41.4453 313.463 38.672C315.085 35.8987 317.282 33.7653 320.055 32.272C322.829 30.736 325.922 29.968 329.335 29.968C332.749 29.968 335.842 30.736 338.615 32.272C341.389 33.7653 343.565 35.8987 345.143 38.672C346.765 41.4453 347.575 44.6453 347.575 48.272C347.575 51.8987 346.743 55.0987 345.079 57.872C343.458 60.6453 341.239 62.8 338.423 64.336C335.65 65.8293 332.535 66.576 329.079 66.576ZM329.079 58.768C330.701 58.768 332.215 58.384 333.623 57.616C335.074 56.8053 336.226 55.6107 337.079 54.032C337.933 52.4533 338.359 50.5333 338.359 48.272C338.359 44.9013 337.463 42.32 335.671 40.528C333.922 38.6933 331.767 37.776 329.207 37.776C326.647 37.776 324.493 38.6933 322.743 40.528C321.037 42.32 320.183 44.9013 320.183 48.272C320.183 51.6427 321.015 54.2453 322.679 56.08C324.386 57.872 326.519 58.768 329.079 58.768ZM361.965 36.048C363.117 34.1707 364.61 32.6987 366.445 31.632C368.322 30.5653 370.455 30.032 372.845 30.032V39.44H370.477C367.661 39.44 365.527 40.1013 364.077 41.424C362.669 42.7467 361.965 45.0507 361.965 48.336V66H353.005V30.544H361.965V36.048ZM389.539 48.144C389.539 44.56 390.243 41.3813 391.651 38.608C393.102 35.8347 395.043 33.7013 397.475 32.208C399.95 30.7147 402.702 29.968 405.731 29.968C408.376 29.968 410.68 30.5013 412.643 31.568C414.648 32.6347 416.248 33.9787 417.443 35.6V30.544H426.467V66H417.443V60.816C416.291 62.48 414.691 63.8667 412.643 64.976C410.638 66.0427 408.312 66.576 405.667 66.576C402.68 66.576 399.95 65.808 397.475 64.272C395.043 62.736 393.102 60.5813 391.651 57.808C390.243 54.992 389.539 51.7707 389.539 48.144ZM417.443 48.272C417.443 46.096 417.016 44.24 416.163 42.704C415.31 41.1253 414.158 39.9307 412.707 39.12C411.256 38.2667 409.699 37.84 408.035 37.84C406.371 37.84 404.835 38.2453 403.427 39.056C402.019 39.8667 400.867 41.0613 399.971 42.64C399.118 44.176 398.691 46.0107 398.691 48.144C398.691 50.2773 399.118 52.1547 399.971 53.776C400.867 55.3547 402.019 56.5707 403.427 57.424C404.878 58.2773 406.414 58.704 408.035 58.704C409.699 58.704 411.256 58.2987 412.707 57.488C414.158 56.6347 415.31 55.44 416.163 53.904C417.016 52.3253 417.443 50.448 417.443 48.272ZM447.963 29.968C450.608 29.968 452.934 30.5013 454.939 31.568C456.944 32.592 458.523 33.936 459.675 35.6V30.544H468.699V66.256C468.699 69.5413 468.038 72.464 466.715 75.024C465.392 77.6267 463.408 79.6747 460.763 81.168C458.118 82.704 454.918 83.472 451.163 83.472C446.128 83.472 441.99 82.2987 438.747 79.952C435.547 77.6053 433.734 74.4053 433.307 70.352H442.203C442.672 71.9733 443.675 73.2533 445.211 74.192C446.79 75.1733 448.688 75.664 450.907 75.664C453.51 75.664 455.622 74.8747 457.243 73.296C458.864 71.76 459.675 69.4133 459.675 66.256V60.752C458.523 62.416 456.923 63.8027 454.875 64.912C452.87 66.0213 450.566 66.576 447.963 66.576C444.976 66.576 442.246 65.808 439.771 64.272C437.296 62.736 435.334 60.5813 433.883 57.808C432.475 54.992 431.771 51.7707 431.771 48.144C431.771 44.56 432.475 41.3813 433.883 38.608C435.334 35.8347 437.275 33.7013 439.707 32.208C442.182 30.7147 444.934 29.968 447.963 29.968ZM459.675 48.272C459.675 46.096 459.248 44.24 458.395 42.704C457.542 41.1253 456.39 39.9307 454.939 39.12C453.488 38.2667 451.931 37.84 450.267 37.84C448.603 37.84 447.067 38.2453 445.659 39.056C444.251 39.8667 443.099 41.0613 442.203 42.64C441.35 44.176 440.923 46.0107 440.923 48.144C440.923 50.2773 441.35 52.1547 442.203 53.776C443.099 55.3547 444.251 56.5707 445.659 57.424C447.11 58.2773 448.646 58.704 450.267 58.704C451.931 58.704 453.488 58.2987 454.939 57.488C456.39 56.6347 457.542 55.44 458.395 53.904C459.248 52.3253 459.675 50.448 459.675 48.272ZM509.267 47.504C509.267 48.784 509.181 49.936 509.011 50.96H483.091C483.304 53.52 484.2 55.5253 485.779 56.976C487.357 58.4267 489.299 59.152 491.603 59.152C494.931 59.152 497.299 57.7227 498.707 54.864H508.371C507.347 58.2773 505.384 61.0933 502.483 63.312C499.581 65.488 496.019 66.576 491.795 66.576C488.381 66.576 485.309 65.8293 482.579 64.336C479.891 62.8 477.779 60.6453 476.243 57.872C474.749 55.0987 474.003 51.8987 474.003 48.272C474.003 44.6027 474.749 41.3813 476.243 38.608C477.736 35.8347 479.827 33.7013 482.515 32.208C485.203 30.7147 488.296 29.968 491.795 29.968C495.165 29.968 498.173 30.6933 500.819 32.144C503.507 33.5947 505.576 35.664 507.027 38.352C508.52 40.9973 509.267 44.048 509.267 47.504ZM499.987 44.944C499.944 42.64 499.112 40.8053 497.491 39.44C495.869 38.032 493.885 37.328 491.539 37.328C489.32 37.328 487.443 38.0107 485.907 39.376C484.413 40.6987 483.496 42.5547 483.155 44.944H499.987ZM534.311 30.032C538.535 30.032 541.949 31.376 544.551 34.064C547.154 36.7093 548.455 40.4213 548.455 45.2V66H539.495V46.416C539.495 43.6 538.791 41.4453 537.383 39.952C535.975 38.416 534.055 37.648 531.623 37.648C529.149 37.648 527.186 38.416 525.735 39.952C524.327 41.4453 523.623 43.6 523.623 46.416V66H514.663V30.544H523.623V34.96C524.818 33.424 526.333 32.2293 528.167 31.376C530.045 30.48 532.093 30.032 534.311 30.032ZM566.265 37.904V55.056C566.265 56.2507 566.542 57.1253 567.097 57.68C567.694 58.192 568.675 58.448 570.041 58.448H574.201V66H568.569C561.017 66 557.241 62.3307 557.241 54.992V37.904H553.017V30.544H557.241V21.776H566.265V30.544H574.201V37.904H566.265ZM593.07 66.576C590.169 66.576 587.566 66.064 585.262 65.04C582.958 63.9733 581.123 62.544 579.758 60.752C578.435 58.96 577.71 56.976 577.582 54.8H586.606C586.777 56.1653 587.438 57.296 588.59 58.192C589.785 59.088 591.257 59.536 593.006 59.536C594.713 59.536 596.035 59.1947 596.974 58.512C597.955 57.8293 598.446 56.9547 598.446 55.888C598.446 54.736 597.849 53.8827 596.654 53.328C595.502 52.7307 593.646 52.0907 591.086 51.408C588.441 50.768 586.265 50.1067 584.558 49.424C582.894 48.7413 581.443 47.696 580.206 46.288C579.011 44.88 578.414 42.9813 578.414 40.592C578.414 38.6293 578.969 36.8373 580.078 35.216C581.23 33.5947 582.851 32.3147 584.942 31.376C587.075 30.4373 589.571 29.968 592.43 29.968C596.654 29.968 600.025 31.0347 602.542 33.168C605.059 35.2587 606.446 38.096 606.702 41.68H598.126C597.998 40.272 597.401 39.1627 596.334 38.352C595.31 37.4987 593.923 37.072 592.174 37.072C590.553 37.072 589.294 37.3707 588.398 37.968C587.545 38.5653 587.118 39.3973 587.118 40.464C587.118 41.6587 587.715 42.576 588.91 43.216C590.105 43.8133 591.961 44.432 594.478 45.072C597.038 45.712 599.15 46.3733 600.814 47.056C602.478 47.7387 603.907 48.8053 605.102 50.256C606.339 51.664 606.979 53.5413 607.022 55.888C607.022 57.936 606.446 59.7707 605.294 61.392C604.185 63.0133 602.563 64.2933 600.43 65.232C598.339 66.128 595.886 66.576 593.07 66.576Z"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function BrandedHero({ tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1', onViewerModeChange }: VariantProps) {
  const hero = useHeroCopy(tone, contentStyle);
  const { settings } = useSiteSettings();
  const titleStyle = settings?.agents_branded_title_style || 'ascii';
  const glowStyle = settings?.agents_branded_glow_style || 'wide';
  const heroDemoStyle = (settings?.agents_hero_demo || 'none') as HeroDemoStyle;
  const isHuman = viewerMode === 'human';
  const [started, setStarted] = useState(false);
  const taglineText = '// built for humans. now open to agents.';
  const defaultLine1 = isHuman ? hero.humanLine1 : hero.typingLine1;
  const defaultLine2 = isHuman ? hero.humanLine2 : hero.typingLine2;
  const line1Text = heroDemoStyle === 'typing_agent' && !isHuman ? AGENT_TYPING_LINES.line1 : defaultLine1;
  const line2Text = heroDemoStyle === 'typing_agent' && !isHuman ? AGENT_TYPING_LINES.line2 : defaultLine2;
  const subtitleText = isHuman ? hero.humanSubtitle : hero.subtitle;
  const { displayed: tagline, done: dTag } = useTypingEffect(taglineText, 30, started);
  const { displayed: line1, done: d1 } = useTypingEffect(line1Text, 35, dTag);
  const { displayed: line2, done: d2 } = useTypingEffect(line2Text, 35, d1);

  useEffect(() => { setTimeout(() => setStarted(true), 1000); }, []);

  return (
    <div className="relative min-h-0 sm:min-h-screen flex flex-col items-center pt-14 pb-10 sm:pb-0 px-6 bg-[#0a0a0a]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <UnifiedDotGrid />
        {heroDemoStyle === 'bg_stream' && <BgStreamOverlay />}
        {glowStyle === 'wide' && <BrandedAmbientGlow />}
      </div>

      <div data-agent-text-done={d2 ? '' : undefined} className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center mt-[3vh] sm:mt-[8vh]">
        {titleStyle === 'svg' ? (
          <>
            <motion.div
              data-agent-target="logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative mb-2"
            >
              <BrandedGlow variant={glowStyle} />
              <MondayGlowMark className="relative z-10 w-[100px] sm:w-[120px] md:w-[140px] h-auto mx-auto" />
            </motion.div>

            <motion.div
              data-agent-target="title"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <MondayWordmark className="w-[85vw] sm:w-[480px] md:w-[640px] h-auto mx-auto" />
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              data-agent-target="logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative mb-4"
            >
              <BrandedGlow variant={glowStyle} />
              <MondayGlowMark className="relative z-10 w-[100px] sm:w-[120px] md:w-[140px] h-auto mx-auto" />
            </motion.div>

            <div data-agent-target="title"><AsciiGlitchTitle /></div>
          </>
        )}

        <div className="flex flex-col items-center">

          {onViewerModeChange && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-4 sm:hidden flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm p-1"
            >
              {(['agent', 'human'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => onViewerModeChange(m)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium font-mono transition-all duration-300 ${
                    viewerMode === m
                      ? m === 'agent' ? 'bg-[#00D2D2]/20 text-[#00D2D2]' : 'bg-[#FF3D57]/20 text-[#FF3D57]'
                      : 'text-white/40'
                  }`}
                >
                  {m === 'agent' ? 'AGENT' : 'HUMAN'}
                </button>
              ))}
            </motion.div>
          )}

          <div className="mt-6 sm:mt-10 space-y-2 text-center max-w-[90vw] sm:max-w-2xl mx-auto font-mono">
            <p
              data-agent-target="tagline"
              className="text-[11px] sm:text-sm md:text-base transition-opacity duration-500"
              style={{ opacity: started ? 1 : 0 }}
            >
              {tagline ? (
                <>
                  <span className="text-[#606060]">{tagline.slice(0, Math.min(tagline.length, 3))}</span>
                  {tagline.length > 3 && (() => {
                    const rest = tagline.slice(3);
                    const splitIdx = rest.indexOf(' now open to agents.');
                    if (splitIdx === -1) return <span className="text-[#a0a0a0]">{rest}</span>;
                    return (
                      <>
                        <span className="text-[#a0a0a0]">{rest.slice(0, splitIdx)}</span>
                        <span style={{ color: BRAND.teal }}>{rest.slice(splitIdx)}</span>
                      </>
                    );
                  })()}
                </>
              ) : '\u00A0'}
              {!dTag && started && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: '#a0a0a0' }} />}
            </p>
            <p
              data-agent-target="line1"
              className="text-xs sm:text-base transition-opacity duration-500"
              style={{
                color: isHuman ? `${BRAND.humanWarm}cc` : `${BRAND.teal}cc`,
                opacity: dTag ? 1 : 0,
              }}
            >
              {line1 || '\u00A0'}{!d1 && dTag && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.humanWarm : BRAND.teal }} />}
            </p>
            <p
              data-agent-target="line2"
              className="text-xs sm:text-base transition-opacity duration-500"
              style={{
                color: isHuman ? `${BRAND.humanWarm}99` : '#ffffffaa',
                opacity: d1 ? 1 : 0,
              }}
            >
              {line2 || '\u00A0'}{!d2 && d1 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.humanWarm : '#ffffff' }} />}
            </p>
          </div>

          <p
            data-agent-target="subtitle"
            className="mt-6 sm:mt-10 text-[10px] sm:text-sm text-[#808080] max-w-[85vw] sm:max-w-xl mx-auto font-mono leading-relaxed transition-opacity duration-800"
            style={{ opacity: d2 ? 1 : 0 }}
          >
            {subtitleText}
          </p>

          {((heroDemoStyle === 'floating_terminal' || heroDemoStyle === 'toasts') && d2) || heroDemoStyle === 'agent_cursor' ? (
            <HeroDemoElement style={heroDemoStyle} />
          ) : null}

          {!isHuman && <HeroCTAs show={d2} />}

          <div
            data-agent-target="scroll"
            className="mt-8 sm:mt-16 hidden sm:block transition-opacity duration-1000"
            style={{ opacity: d2 ? 1 : 0 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[#00D2D2]/40 font-mono text-sm"
            >
              // keep parsing ↓
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  Main export — variant router
// ═══════════════════════════════════════════════════════════════

const DEPRECATED_VARIANTS = new Set(['boot', 'neural', 'glitch', 'cli', 'agents_grid', 'agents_marquee', 'hatcha_gate', 'api_blueprint', 'signup_60s', 'openclaw', 'orbital', 'liquid', 'depth_layers', 'data_stream', 'typography_kinetic', 'ambient_orbs']);

export function AgentHero({ variant = 'matrix', tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1', onViewerModeChange }: AgentHeroProps) {
  const v = DEPRECATED_VARIANTS.has(variant ?? '') ? 'matrix' : variant;

  switch (v) {
    case 'branded': return <BrandedHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} onViewerModeChange={onViewerModeChange} />;
    case 'matrix_v2': return <MatrixRainHeroV2 tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
    case 'radar': return <RadarScanHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
    case 'mcp_connect': return <McpConnectHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
    case 'matrix':
    default: return <MatrixRainHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
  }
}
