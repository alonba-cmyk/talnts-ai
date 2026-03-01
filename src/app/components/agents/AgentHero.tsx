import { motion } from 'motion/react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';
import { v2HeroCopy, type HeroCopy } from './copy/heroCopy';
import { AI_COMPANIES, type AICompany } from './aiCompanies';
// ─── Brand palette ───────────────────────────────────────────
const BRAND = {
  dotRed: '#FF3D57',
  dotYellow: '#FFCB00',
  dotGreen: '#00CA72',
  purple: '#6161FF',
  teal: '#00D2D2',
  pink: '#FB275D',
  terminalGreen: '#00ff41',
} as const;

const BRAND_DOTS = [BRAND.dotRed, BRAND.dotYellow, BRAND.dotGreen];
const BRAND_PRODUCTS = [BRAND.purple, BRAND.teal, BRAND.pink, BRAND.dotGreen];

export type AgentHeroVariant = 'matrix' | 'radar' | 'mcp_connect' | 'orbital' | 'liquid' | 'depth_layers' | 'data_stream' | 'typography_kinetic' | 'ambient_orbs';
export type ViewerMode = 'agent' | 'human';
export type ContentStyle = 'v1' | 'v2';

interface AgentHeroProps {
  variant?: AgentHeroVariant;
  tone?: MessagingTone;
  viewerMode?: ViewerMode;
  contentStyle?: ContentStyle;
}

interface VariantProps {
  tone?: MessagingTone;
  viewerMode?: ViewerMode;
  contentStyle?: ContentStyle;
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
    filter: 'drop-shadow(0 0 20px rgba(0,255,65,0.15))',
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
        <span className="text-[#00ff41]"> now open to agents.</span>
      </p>
    </motion.div>
  );
}

function HeroCTAs({ show }: { show: boolean }) {
  const scrollToSignup = useCallback(() => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mt-6 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <button
        onClick={scrollToSignup}
        className="group font-mono text-base px-8 py-3 rounded-lg border border-[#00ff41]/50 text-[#00ff41] bg-[#00ff41]/5 hover:bg-[#00ff41]/15 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.2)]"
      >
        <span className="text-[#00ff41]/50 mr-2">$</span>
        monday signup --agent --free
      </button>
      <button
        onClick={() => document.getElementById('api')?.scrollIntoView({ behavior: 'smooth' })}
        className="hidden sm:flex font-mono text-sm px-6 py-3 rounded-lg border border-[#808080]/30 text-[#808080] hover:text-[#e0e0e0] hover:border-[#e0e0e0]/30 transition-all duration-300"
      >
        man monday-api
      </button>
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
        className="text-[#00ff41]/40 font-mono text-sm"
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
            <p className="text-sm sm:text-base" style={{ color: isHuman ? `${BRAND.dotRed}cc` : '#00ff41cc' }}>
              {line1}{!d1 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.dotRed : '#00ff41' }} />}
            </p>
          )}
          {d1 && (
            <p className="text-sm sm:text-base" style={{ color: isHuman ? `${BRAND.dotRed}99` : '#00d2d2e6' }}>
              {line2}{!d2 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.dotRed : '#00d2d2' }} />}
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
      const primary = isHuman ? BRAND.dotRed : BRAND.dotGreen;
      const secondary = isHuman ? '#ff6b6b' : BRAND.dotYellow;
      const tertiary = isHuman ? '#ff4444' : BRAND.dotRed;

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
        ctx.strokeStyle = i % 2 === 0 ? `${BRAND.purple}15` : `${isHuman ? BRAND.dotRed : BRAND.teal}12`;
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
        ? [BRAND.dotRed, '#ff6b6b', '#ff4444']
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
  const badgeColor = isHuman ? BRAND.dotRed : BRAND.terminalGreen;
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
              style={{ color: isHuman ? `${BRAND.dotRed}cc` : `${BRAND.terminalGreen}cc` }}>
              {typed1}{!d1 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.dotRed : BRAND.terminalGreen }} />}
            </p>
            {d1 && (
              <p className="text-sm sm:text-base"
                style={{ color: isHuman ? `${BRAND.dotRed}99` : `${BRAND.teal}cc` }}>
                {typed2}{!d2 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.dotRed : BRAND.teal }} />}
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
//  VARIANT 4 — Orbital Ecosystem
// ═══════════════════════════════════════════════════════════════

function OrbitalHero({ tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1' }: VariantProps) {
  const hero = useHeroCopy(tone, contentStyle);
  const isHuman = viewerMode === 'human';
  const [started, setStarted] = useState(false);
  const line1Text = isHuman ? hero.humanLine1 : hero.typingLine1;
  const line2Text = isHuman ? hero.humanLine2 : hero.typingLine2;
  const subtitleText = isHuman ? hero.humanSubtitle : hero.subtitle;
  const colors = [BRAND.dotRed, BRAND.dotYellow, BRAND.dotGreen, BRAND.purple, BRAND.teal];
  const orbits = 3;
  const dotsPerOrbit = 8;

  const { displayed: line1, done: d1 } = useTypingEffect(line1Text, 35, started);
  const { displayed: line2, done: d2 } = useTypingEffect(line2Text, 35, d1);
  useEffect(() => { setTimeout(() => setStarted(true), 1000); }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Orbiting dots */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {Array.from({ length: orbits }).map((_, orbitIdx) => (
          <motion.div
            key={orbitIdx}
            className="absolute w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 12 + orbitIdx * 4, repeat: Infinity, ease: 'linear' }}
            style={{ width: 120 + orbitIdx * 80, height: 120 + orbitIdx * 80 }}
          >
            {Array.from({ length: dotsPerOrbit }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 4 + orbitIdx,
                  height: 4 + orbitIdx,
                  left: '50%',
                  top: 0,
                  marginLeft: -2 - orbitIdx / 2,
                  marginTop: -2 - orbitIdx / 2,
                  backgroundColor: colors[(orbitIdx + i) % colors.length],
                  boxShadow: `0 0 8px ${colors[(orbitIdx + i) % colors.length]}60`,
                  transform: `rotate(${i * (360 / dotsPerOrbit)}deg) translateY(${-60 - orbitIdx * 40}px)`,
                }}
              />
            ))}
          </motion.div>
        ))}
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="orbitalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              {colors.map((c, i) => (
                <stop key={i} offset={`${i * 25}%`} stopColor={c} />
              ))}
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <BrandLogo />
        <div className="mt-8 space-y-3 text-left max-w-2xl mx-auto font-mono">
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
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 sm:mt-6 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed hidden sm:block">
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
//  VARIANT 5 — Liquid / Fluid Morphism
// ═══════════════════════════════════════════════════════════════

function LiquidHero({ tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1' }: VariantProps) {
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
      {/* Fluid blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {[BRAND.dotRed, BRAND.dotGreen, BRAND.purple].map((color, i) => (
          <motion.div
            key={i}
            className="absolute rounded-[45%] blur-3xl opacity-20"
            animate={{
              x: [0, 80, -40, 0],
              y: [0, -60, 40, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 300 + i * 80,
              height: 300 + i * 80,
              backgroundColor: color,
              left: `${20 + i * 25}%`,
              top: `${30 + i * 15}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <BrandLogo />
        <div className="mt-8 space-y-3 text-left max-w-2xl mx-auto font-mono">
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
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 sm:mt-6 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed hidden sm:block">
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
//  VARIANT 6 — Depth Layers (Parallax Glass)
// ═══════════════════════════════════════════════════════════════

function DepthLayersHero({ tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1' }: VariantProps) {
  const hero = useHeroCopy(tone, contentStyle);
  const isHuman = viewerMode === 'human';
  const [started, setStarted] = useState(false);
  const line1Text = isHuman ? hero.humanLine1 : hero.typingLine1;
  const line2Text = isHuman ? hero.humanLine2 : hero.typingLine2;
  const subtitleText = isHuman ? hero.humanSubtitle : hero.subtitle;
  const { displayed: line1, done: d1 } = useTypingEffect(line1Text, 35, started);
  const { displayed: line2, done: d2 } = useTypingEffect(line2Text, 35, d1);
  useEffect(() => { setTimeout(() => setStarted(true), 600); }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Glass layers */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-3xl border border-white/5 backdrop-blur-xl"
            style={{
              width: 400 - i * 80,
              height: 300 - i * 60,
              background: `linear-gradient(135deg, rgba(97,97,255,${0.03 - i * 0.008}) 0%, rgba(0,202,114,${0.02 - i * 0.005}) 100%)`,
              marginLeft: (i - 1) * 30,
              marginTop: (i - 1) * 20,
            }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <BrandLogo />
        <div className="mt-8 space-y-3 text-left max-w-2xl mx-auto font-mono">
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
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 sm:mt-6 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed hidden sm:block">
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
//  VARIANT 7 — Data Stream
// ═══════════════════════════════════════════════════════════════

const STREAM_SNIPPETS = ['query { boards', 'create_item(', 'column_values', 'webhook', 'MCP', 'GraphQL'];

function DataStreamHero({ tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1' }: VariantProps) {
  const hero = useHeroCopy(tone, contentStyle);
  const isHuman = viewerMode === 'human';
  const [started, setStarted] = useState(false);
  const line1Text = isHuman ? hero.humanLine1 : hero.typingLine1;
  const line2Text = isHuman ? hero.humanLine2 : hero.typingLine2;
  const subtitleText = isHuman ? hero.humanSubtitle : hero.subtitle;
  const { displayed: line1, done: d1 } = useTypingEffect(line1Text, 35, started);
  const { displayed: line2, done: d2 } = useTypingEffect(line2Text, 35, d1);
  useEffect(() => { setTimeout(() => setStarted(true), 1000); }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Flowing data lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2].map((row) => (
          <motion.div
            key={row}
            className="absolute flex gap-8 font-mono text-xs opacity-15"
            style={{
              top: `${25 + row * 25}%`,
              left: 0,
              color: [BRAND.teal, BRAND.purple, BRAND.dotGreen][row],
            }}
            animate={{ x: [0, -800] }}
            transition={{ duration: 12 + row * 4, repeat: Infinity, ease: 'linear' }}
          >
            {[...STREAM_SNIPPETS, ...STREAM_SNIPPETS].map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <BrandLogo />
        <div className="mt-8 space-y-3 text-left max-w-2xl mx-auto font-mono">
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
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 sm:mt-6 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed hidden sm:block">
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
//  VARIANT 8 — Typography Kinetic
// ═══════════════════════════════════════════════════════════════

function TypographyKineticHero({ tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1' }: VariantProps) {
  const hero = useHeroCopy(tone, contentStyle);
  const isHuman = viewerMode === 'human';
  const [started, setStarted] = useState(false);
  const line1Text = isHuman ? hero.humanLine1 : hero.typingLine1;
  const line2Text = isHuman ? hero.humanLine2 : hero.typingLine2;
  const subtitleText = isHuman ? hero.humanSubtitle : hero.subtitle;
  const { displayed: line1, done: d1 } = useTypingEffect(line1Text, 35, started);
  const { displayed: line2, done: d2 } = useTypingEffect(line2Text, 35, d1);
  useEffect(() => { setTimeout(() => setStarted(true), 800); }, []);

  const gradientStyle = {
    background: `linear-gradient(90deg, ${BRAND.dotRed}, ${BRAND.dotYellow}, ${BRAND.dotGreen})`,
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text' as const,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden bg-[#0a0a0a]">
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2"
          style={gradientStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          monday<span className="text-[#00ff41]">.com</span>
        </motion.h1>
        <motion.p
          className="text-2xl sm:text-3xl font-mono mb-2"
          style={{ color: BRAND.terminalGreen }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          agents
        </motion.p>
        <p className="font-mono text-sm text-[#606060] mb-8 hidden sm:block">// built for humans. now open to agents.</p>

        <div className="mt-4 space-y-3 text-left max-w-2xl mx-auto font-mono">
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
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 sm:mt-6 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed hidden sm:block">
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
//  VARIANT 9 — Ambient Gradient Orbs
// ═══════════════════════════════════════════════════════════════

function AmbientOrbsHero({ tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1' }: VariantProps) {
  const hero = useHeroCopy(tone, contentStyle);
  const isHuman = viewerMode === 'human';
  const [started, setStarted] = useState(false);
  const line1Text = isHuman ? hero.humanLine1 : hero.typingLine1;
  const line2Text = isHuman ? hero.humanLine2 : hero.typingLine2;
  const subtitleText = isHuman ? hero.humanSubtitle : hero.subtitle;
  const { displayed: line1, done: d1 } = useTypingEffect(line1Text, 35, started);
  const { displayed: line2, done: d2 } = useTypingEffect(line2Text, 35, d1);
  useEffect(() => { setTimeout(() => setStarted(true), 600); }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 overflow-hidden">
        {[
          { color: BRAND.purple, size: 400, x: '10%', y: '20%' },
          { color: BRAND.teal, size: 320, x: '70%', y: '60%' },
          { color: BRAND.dotGreen, size: 280, x: '50%', y: '80%' },
          { color: BRAND.dotRed, size: 200, x: '80%', y: '15%' },
        ].map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-[100px] opacity-25"
            style={{
              width: orb.size,
              height: orb.size,
              backgroundColor: orb.color,
              left: orb.x,
              top: orb.y,
              marginLeft: -orb.size / 2,
              marginTop: -orb.size / 2,
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <BrandLogo />
        <div className="mt-8 space-y-3 text-left max-w-2xl mx-auto font-mono">
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
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 sm:mt-6 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed hidden sm:block">
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
//  Main export — variant router
// ═══════════════════════════════════════════════════════════════

const DEPRECATED_VARIANTS = new Set(['boot', 'neural', 'glitch', 'cli', 'agents_grid', 'agents_marquee', 'gotcha_gate', 'api_blueprint', 'signup_60s']);

export function AgentHero({ variant = 'matrix', tone = 'belong_here', viewerMode = 'agent', contentStyle = 'v1' }: AgentHeroProps) {
  const v = DEPRECATED_VARIANTS.has(variant ?? '') ? 'matrix' : variant;

  switch (v) {
    case 'radar': return <RadarScanHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
    case 'mcp_connect': return <McpConnectHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
    case 'orbital': return <OrbitalHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
    case 'liquid': return <LiquidHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
    case 'depth_layers': return <DepthLayersHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
    case 'data_stream': return <DataStreamHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
    case 'typography_kinetic': return <TypographyKineticHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
    case 'ambient_orbs': return <AmbientOrbsHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
    case 'matrix':
    default: return <MatrixRainHero tone={tone} viewerMode={viewerMode} contentStyle={contentStyle} />;
  }
}
