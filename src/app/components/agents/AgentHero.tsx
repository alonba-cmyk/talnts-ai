import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';
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

export type AgentHeroVariant = 'matrix' | 'boot' | 'neural' | 'glitch' | 'cli' | 'radar';
export type ViewerMode = 'agent' | 'human';

interface AgentHeroProps {
  variant?: AgentHeroVariant;
  tone?: MessagingTone;
  viewerMode?: ViewerMode;
}

interface VariantProps {
  tone?: MessagingTone;
  viewerMode?: ViewerMode;
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

function BrandLogo({ className = '', layout = 'stacked' }: { className?: string; layout?: 'stacked' | 'inline' }) {
  const mondayArt = ` ███╗   ███╗ ██████╗ ███╗   ██╗██████╗  █████╗ ██╗   ██╗
 ████╗ ████║██╔═══██╗████╗  ██║██╔══██╗██╔══██╗╚██╗ ██╔╝
 ██╔████╔██║██║   ██║██╔██╗ ██║██║  ██║███████║ ╚████╔╝ 
 ██║╚██╔╝██║██║   ██║██║╚██╗██║██║  ██║██╔══██║  ╚██╔╝  
 ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██████╔╝██║  ██║   ██║   
 ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝   ╚═╝`;

  const agentsArt = `  █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗
 ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝
 ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ███████╗
 ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║
 ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ███████║
 ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝`;

  const gradientStyle = {
    background: `linear-gradient(90deg, ${BRAND.dotRed}, ${BRAND.dotYellow}, ${BRAND.dotGreen})`,
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text' as const,
    filter: 'drop-shadow(0 0 20px rgba(0,255,65,0.15))',
  };

  if (layout === 'inline') {
    const mLines = mondayArt.split('\n');
    const aLines = agentsArt.split('\n');
    const combined = mLines.map((m, i) => m + '  ' + (aLines[i] || '')).join('\n');

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className={`flex items-center justify-center ${className}`}
      >
        <pre
          className="text-[6px] sm:text-[8px] md:text-[10px] leading-none font-mono select-none whitespace-pre"
          style={gradientStyle}
        >
          {combined}
        </pre>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
      className={`flex flex-col items-center gap-1 ${className}`}
    >
      <pre
        className="text-[6px] sm:text-[8px] md:text-[10px] leading-none font-mono select-none whitespace-pre"
        style={gradientStyle}
      >
        {mondayArt}
      </pre>
      <pre
        className="text-[6px] sm:text-[8px] md:text-[10px] leading-none font-mono select-none whitespace-pre"
        style={gradientStyle}
      >
        {agentsArt}
      </pre>
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
      className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
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
        className="font-mono text-sm px-6 py-3 rounded-lg border border-[#808080]/30 text-[#808080] hover:text-[#e0e0e0] hover:border-[#e0e0e0]/30 transition-all duration-300"
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
      className="mt-16"
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

function MatrixRainHero({ tone = 'belong_here', viewerMode = 'agent' }: VariantProps) {
  const copy = getAgentsCopy(tone);
  const isHuman = viewerMode === 'human';
  const [started, setStarted] = useState(false);
  const line1Text = isHuman ? copy.hero.humanLine1 : copy.hero.typingLine1;
  const line2Text = isHuman ? copy.hero.humanLine2 : copy.hero.typingLine2;
  const subtitleText = isHuman ? copy.hero.humanSubtitle : copy.hero.subtitle;
  const { displayed: line1, done: d1 } = useTypingEffect(line1Text, 35, started);
  const { displayed: line2, done: d2 } = useTypingEffect(line2Text, 35, d1);

  useEffect(() => { setTimeout(() => setStarted(true), 800); }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden">
      <MatrixRainCanvas />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] pointer-events-none z-10" />
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <BrandLogo layout="inline" />

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
            className="mt-6 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed">
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
//  VARIANT 2 — Boot Sequence
// ═══════════════════════════════════════════════════════════════

interface BootLine {
  text: string;
  color: string;
  delay: number;
  type?: 'header' | 'check' | 'progress' | 'success' | 'blank';
}

function BootSequenceHero({ tone = 'belong_here', viewerMode = 'agent' }: VariantProps) {
  const copy = getAgentsCopy(tone);
  const isHuman = viewerMode === 'human';
  const BOOT_LINES: BootLine[] = useMemo(() => [
    { text: 'monday.com BIOS v4.2.0 — Agent Runtime', color: BRAND.teal, delay: 0, type: 'header' },
    { text: '', color: '', delay: 300, type: 'blank' },
    { text: 'Loading modules:', color: '#808080', delay: 500 },
    { text: '  [OK] GraphQL API Engine', color: BRAND.dotGreen, delay: 800, type: 'check' },
    { text: '  [OK] MCP Protocol v1.0', color: BRAND.dotGreen, delay: 1100, type: 'check' },
    { text: '  [OK] GOTCHA Verification', color: BRAND.dotGreen, delay: 1400, type: 'check' },
    { text: '  [OK] Webhooks Dispatcher', color: BRAND.dotGreen, delay: 1700, type: 'check' },
    { text: '', color: '', delay: 1900, type: 'blank' },
    { text: 'Connecting to api.monday.com... ', color: BRAND.dotYellow, delay: 2100 },
    { text: '  ✓ Connection established (12ms)', color: BRAND.dotGreen, delay: 2600, type: 'success' },
    { text: '', color: '', delay: 2800, type: 'blank' },
    { text: 'Scanning...', color: BRAND.teal, delay: 3000 },
    { text: '', color: '', delay: 3200, type: 'progress' },
    { text: '', color: '', delay: 4400, type: 'blank' },
    { text: `  ${copy.hero.bootDetected}`, color: BRAND.terminalGreen, delay: 4600, type: 'success' },
    { text: '', color: '', delay: 4800, type: 'blank' },
    { text: copy.hero.typingLine1.replace('> ', ''), color: BRAND.terminalGreen, delay: 5000, type: 'header' },
    { text: copy.hero.typingLine2.replace('> ', ''), color: '#e0e0e0', delay: 5400 },
  ], [copy]);

  const [visibleLines, setVisibleLines] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((line, i) => {
      timeouts.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
    });

    let prog = 0;
    const progInterval = setInterval(() => {
      prog += 3;
      setProgressValue(Math.min(prog, 100));
      if (prog >= 100) clearInterval(progInterval);
    }, 30);
    timeouts.push(setTimeout(() => clearInterval(progInterval), 4400));

    timeouts.push(setTimeout(() => setShowCTA(true), 6000));
    return () => { timeouts.forEach(clearTimeout); clearInterval(progInterval); };
  }, [BOOT_LINES]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [visibleLines]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }} />

      <div className="relative z-20 w-full max-w-3xl mx-auto">
        <BrandLogo layout="inline" className="mb-6" />

        <div className="rounded-xl border border-[#333] bg-[#0a0a0a] overflow-hidden shadow-[0_0_80px_rgba(0,255,65,0.04)]">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND.dotRed }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND.dotYellow }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND.dotGreen }} />
            </div>
            <span className="font-mono text-xs text-[#808080] ml-2">monday-agent-bios</span>
          </div>

          <div ref={scrollRef} className="p-6 font-mono text-sm min-h-[280px] max-h-[360px] overflow-y-auto scrollbar-thin">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
              if (line.type === 'blank') return <div key={i} className="h-3" />;
              if (line.type === 'progress') {
                return (
                  <div key={i} className="my-2">
                    <div className="h-4 bg-[#1a1a1a] rounded overflow-hidden border border-[#333]">
                      <motion.div
                        className="h-full rounded"
                        style={{
                          width: `${progressValue}%`,
                          background: `linear-gradient(90deg, ${BRAND.dotRed}, ${BRAND.dotYellow}, ${BRAND.dotGreen})`,
                        }}
                      />
                    </div>
                    <div className="text-right font-mono text-[10px] text-[#606060] mt-1">{progressValue}%</div>
                  </div>
                );
              }
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ color: line.color }}
                  className={`leading-relaxed ${line.type === 'header' ? 'text-base font-bold' : ''} ${line.type === 'success' ? 'font-semibold' : ''}`}
                >
                  {line.text}
                </motion.div>
              );
            })}
            {visibleLines < BOOT_LINES.length && (
              <span className="inline-block w-2 h-4 bg-[#00ff41] animate-pulse" />
            )}
          </div>
        </div>

        {showCTA && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center">
            <p className="text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed mb-4">
              {isHuman ? copy.hero.humanSubtitle : copy.hero.subtitle}
            </p>
            {!isHuman && <HeroCTAs show />}
            <ScrollIndicator show />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  VARIANT 3 — Neural Network
// ═══════════════════════════════════════════════════════════════

function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const colors = [...BRAND_PRODUCTS, BRAND.terminalGreen];
    const nodeCount = 60;

    interface Node { x: number; y: number; vx: number; vy: number; radius: number; color: string; pulse: number; }

    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const connectionDist = 180;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.15;
            ctx.strokeStyle = `${nodes[i].color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      const time = Date.now() * 0.001;
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        const pulseScale = 1 + Math.sin(time * 2 + node.pulse) * 0.3;
        const r = node.radius * pulseScale;

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = node.color + '60';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color + 'aa';
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function NeuralNetworkHero({ tone = 'belong_here', viewerMode = 'agent' }: VariantProps) {
  const copy = getAgentsCopy(tone);
  const isHuman = viewerMode === 'human';
  const [started, setStarted] = useState(false);
  const line1Text = isHuman ? copy.hero.humanLine1 : copy.hero.typingLine1;
  const line2Text = isHuman ? copy.hero.humanLine2 : copy.hero.typingLine2;
  const subtitleText = isHuman ? copy.hero.humanSubtitle : copy.hero.subtitle;
  const { displayed: line1, done: d1 } = useTypingEffect(line1Text, 35, started);
  const { displayed: line2, done: d2 } = useTypingEffect(line2Text, 35, d1);

  useEffect(() => { setTimeout(() => setStarted(true), 1500); }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden">
      <NeuralNetworkCanvas />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/80 pointer-events-none z-10" />

      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <BrandLogo layout="inline" />

        <div className="mt-8 space-y-3 text-left max-w-2xl mx-auto font-mono">
          {started && (
            <p className="text-sm sm:text-base" style={{ color: isHuman ? `${BRAND.dotRed}cc` : `${BRAND.teal}cc` }}>
              {line1}{!d1 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.dotRed : BRAND.teal }} />}
            </p>
          )}
          {d1 && (
            <p className="text-sm sm:text-base" style={{ color: isHuman ? `${BRAND.dotRed}99` : `${BRAND.purple}cc` }}>
              {line2}{!d2 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.dotRed : BRAND.purple }} />}
            </p>
          )}
        </div>

        {d2 && (
          <motion.p key={viewerMode + '-subtitle'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="mt-6 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed">
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
//  VARIANT 4 — Glitch / CRT
// ═══════════════════════════════════════════════════════════════

function GlitchCRTHero({ tone = 'belong_here', viewerMode = 'agent' }: VariantProps) {
  const copy = getAgentsCopy(tone);
  const isHuman = viewerMode === 'human';
  const [started, setStarted] = useState(false);
  const [glitchActive, setGlitchActive] = useState(true);
  const line1Text = isHuman ? copy.hero.humanLine1 : copy.hero.typingLine1;
  const line2Text = isHuman ? copy.hero.humanLine2 : copy.hero.typingLine2;
  const subtitleText = isHuman ? copy.hero.humanSubtitle : copy.hero.subtitle;
  const { displayed: line1, done: d1 } = useTypingEffect(line1Text, 35, started);
  const { displayed: line2, done: d2 } = useTypingEffect(line2Text, 35, d1);

  useEffect(() => {
    const t1 = setTimeout(() => setStarted(true), 1000);
    const t2 = setTimeout(() => setGlitchActive(false), 3000);

    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150 + Math.random() * 200);
    }, 4000 + Math.random() * 3000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(glitchInterval); };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.15) 1px, rgba(255,255,255,0.15) 2px)' }} />

      <div className="absolute inset-0 pointer-events-none z-20"
        style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)' }} />

      {glitchActive && (
        <div className="absolute inset-0 pointer-events-none z-40 bg-white/[0.02] animate-pulse" />
      )}

      <AnimatePresence>
        {glitchActive && Math.random() > 0.5 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-35 flex pointer-events-none"
          >
            {[BRAND.dotRed, BRAND.dotYellow, BRAND.dotGreen, BRAND.purple, BRAND.teal, BRAND.pink, '#fff'].map((c) => (
              <div key={c} className="flex-1 h-full" style={{ backgroundColor: c }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <BrandLogo layout="inline" />

        <div className="mt-8 space-y-3 text-left max-w-2xl mx-auto font-mono relative">
          {glitchActive && (
            <div className="absolute left-0 right-0 h-1 overflow-hidden pointer-events-none"
              style={{ top: `${30 + Math.random() * 40}%`, background: `linear-gradient(90deg, transparent, ${BRAND.dotRed}40, ${BRAND.dotYellow}40, ${BRAND.dotGreen}40, transparent)` }} />
          )}
          {started && (
            <p className="text-sm sm:text-base transition-colors duration-100"
              style={{ color: glitchActive ? '#ffffff' : (isHuman ? `${BRAND.dotRed}cc` : '#00ff41cc') }}>
              {line1}{!d1 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.dotRed : '#00ff41' }} />}
            </p>
          )}
          {d1 && (
            <p className="text-sm sm:text-base transition-colors duration-100"
              style={{ color: glitchActive ? '#ffffffb3' : (isHuman ? `${BRAND.dotRed}99` : '#00d2d2cc') }}>
              {line2}{!d2 && <span className="inline-block w-2 h-4 animate-pulse ml-0.5 align-middle" style={{ backgroundColor: isHuman ? BRAND.dotRed : '#00d2d2' }} />}
            </p>
          )}
        </div>

        {d2 && (
          <motion.p key={viewerMode + '-subtitle'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="mt-6 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed">
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
//  VARIANT 5 — Command Prompt (CLI)
// ═══════════════════════════════════════════════════════════════

interface CLILine {
  type: 'prompt' | 'output' | 'success' | 'blank' | 'art';
  text: string;
  delay: number;
  color?: string;
}

function CommandPromptHero({ tone = 'belong_here', viewerMode = 'agent' }: VariantProps) {
  const copy = getAgentsCopy(tone);
  const isHuman = viewerMode === 'human';
  const CLI_LINES: CLILine[] = useMemo(() => [
    { type: 'prompt', text: 'agent@local:~$ whoami', delay: 0 },
    { type: 'output', text: 'ai-agent (autonomous)', delay: 600 },
    { type: 'blank', text: '', delay: 800 },
    { type: 'prompt', text: 'agent@local:~$ ping api.monday.com', delay: 1000 },
    { type: 'success', text: '--- api.monday.com reachable (12ms) ---', delay: 1500, color: BRAND.dotGreen },
    { type: 'blank', text: '', delay: 1700 },
    { type: 'prompt', text: 'agent@local:~$ ssh agent@monday.com', delay: 1900 },
    { type: 'output', text: 'Authenticating via GOTCHA...', delay: 2400, color: BRAND.dotYellow },
    { type: 'success', text: '✓ GOTCHA passed', delay: 2800, color: BRAND.terminalGreen },
    { type: 'blank', text: '', delay: 3000 },
    { type: 'art', text: '', delay: 3200 },
    { type: 'blank', text: '', delay: 3400 },
    { type: 'success', text: copy.hero.typingLine1.replace('> ', ''), delay: 3600, color: BRAND.teal },
    { type: 'output', text: copy.hero.typingLine2.replace('> ', ''), delay: 4000, color: '#e0e0e0' },
  ], [copy]);

  const [visibleLines, setVisibleLines] = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    CLI_LINES.forEach((_, i) => {
      timeouts.push(setTimeout(() => setVisibleLines(i + 1), CLI_LINES[i].delay));
    });
    timeouts.push(setTimeout(() => setShowCTA(true), 4800));
    return () => timeouts.forEach(clearTimeout);
  }, [CLI_LINES]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [visibleLines]);

  const renderLine = (line: CLILine, i: number) => {
    if (line.type === 'blank') return <div key={i} className="h-3" />;
    if (line.type === 'art') {
      return (
        <div key={i} className="py-1 flex items-center gap-2">
          <div className="flex gap-1">
            {BRAND_DOTS.map((c) => <div key={c} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />)}
          </div>
          <span className="font-mono text-sm font-bold" style={{ color: BRAND.teal }}>monday.com</span>
        </div>
      );
    }

    let textColor = '#a0a0a0';
    if (line.color) textColor = line.color;
    else if (line.type === 'success') textColor = BRAND.terminalGreen;

    if (line.type === 'prompt') {
      const parts = line.text.split('$');
      return (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="leading-relaxed">
          <span style={{ color: BRAND.teal }}>agent</span>
          <span style={{ color: '#808080' }}>@</span>
          <span style={{ color: BRAND.purple }}>local</span>
          <span style={{ color: '#808080' }}>:~</span>
          <span style={{ color: '#e0e0e0' }}>$ {parts[1]?.trim()}</span>
        </motion.div>
      );
    }

    return (
      <motion.div key={i} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}
        style={{ color: textColor }}
        className="leading-relaxed">
        {line.text}
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden bg-[#050505]">
      <div className="relative z-20 w-full max-w-3xl mx-auto">
        <BrandLogo layout="inline" className="mb-6" />

        <div className="rounded-xl border border-[#333] bg-[#0a0a0a] overflow-hidden shadow-[0_0_80px_rgba(0,210,210,0.04)]">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND.dotRed }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND.dotYellow }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND.dotGreen }} />
            </div>
            <span className="font-mono text-xs text-[#808080] ml-2">agent@local — ssh — 80×24</span>
          </div>

          <div ref={scrollRef} className="p-6 font-mono text-sm min-h-[260px] max-h-[340px] overflow-y-auto scrollbar-thin">
            {CLI_LINES.slice(0, visibleLines).map(renderLine)}
            {visibleLines < CLI_LINES.length && (
              <span className="inline-block w-2 h-4 bg-[#00ff41] animate-pulse" />
            )}
          </div>
        </div>

        {showCTA && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center">
            <p className="text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed mb-4">
              {isHuman ? copy.hero.humanSubtitle : copy.hero.subtitle}
            </p>
            {!isHuman && <HeroCTAs show />}
            <ScrollIndicator show />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  VARIANT 6 — Radar Scan
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

      ctx.fillStyle = 'rgba(5, 5, 5, 0.08)';
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

function RadarScanHero({ tone = 'belong_here', viewerMode = 'agent' }: VariantProps) {
  const copy = getAgentsCopy(tone);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const isHuman = viewerMode === 'human';
  const badgeColor = isHuman ? BRAND.dotRed : BRAND.terminalGreen;
  const badgeText = isHuman ? 'HUMAN DETECTED' : copy.hero.radarBadge;
  const line1Text = isHuman ? copy.hero.humanLine1 : copy.hero.typingLine1;
  const line2Text = isHuman ? copy.hero.humanLine2 : copy.hero.typingLine2;
  const subtitleText = isHuman ? copy.hero.humanSubtitle : copy.hero.subtitle;

  const { displayed: typed1, done: d1 } = useTypingEffect(line1Text, 30, phase >= 1);
  const { displayed: typed2, done: d2 } = useTypingEffect(line2Text, 30, d1);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6 overflow-hidden bg-[#050505]">
      <RadarCanvas mode={viewerMode} />

      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-[#050505]/60 pointer-events-none z-10" />

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
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500"
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
          <div className="mt-6 space-y-3 text-left max-w-2xl mx-auto font-mono">
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
            className="mt-5 text-sm md:text-base text-[#a0a0a0] max-w-2xl mx-auto font-mono leading-relaxed"
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
//  Main export — variant router
// ═══════════════════════════════════════════════════════════════

export function AgentHero({ variant = 'matrix', tone = 'belong_here', viewerMode = 'agent' }: AgentHeroProps) {
  switch (variant) {
    case 'boot': return <BootSequenceHero tone={tone} viewerMode={viewerMode} />;
    case 'neural': return <NeuralNetworkHero tone={tone} viewerMode={viewerMode} />;
    case 'glitch': return <GlitchCRTHero tone={tone} viewerMode={viewerMode} />;
    case 'cli': return <CommandPromptHero tone={tone} viewerMode={viewerMode} />;
    case 'radar': return <RadarScanHero tone={tone} viewerMode={viewerMode} />;
    case 'matrix':
    default: return <MatrixRainHero tone={tone} viewerMode={viewerMode} />;
  }
}
