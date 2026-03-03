import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';

const TEAL = '#00D2D2';

// ═══════════════════════════════════════════════════════════════
//  Shared data — API call templates used across multiple demos
// ═══════════════════════════════════════════════════════════════

const API_TEMPLATES = [
  { method: 'POST', endpoint: '/v2/graphql', agent: 'ProcureBot', action: 'Creating item in Procurement board' },
  { method: 'GET', endpoint: '/v2/boards/7291048', agent: 'ReportAgent', action: 'Querying Q4 metrics' },
  { method: 'POST', endpoint: '/v2/items', agent: 'SupportAI', action: 'Triaging support ticket #891' },
  { method: 'PUT', endpoint: '/v2/columns/status', agent: 'CompliBot', action: 'Updating compliance status' },
  { method: 'POST', endpoint: '/mcp/execute', agent: 'PlannerBot', action: 'Scheduling team retro' },
  { method: 'GET', endpoint: '/v2/users/me', agent: 'AuthBot', action: 'Verifying credentials' },
  { method: 'POST', endpoint: '/openclaw/skills/run', agent: 'SkillRunner', action: 'Running summarize_updates' },
  { method: 'PATCH', endpoint: '/v2/items/4829', agent: 'UpdateBot', action: 'Updating item priority' },
];

const METHOD_COLORS: Record<string, string> = {
  GET: '#00D2D2',
  POST: '#FFCB00',
  PUT: '#6161FF',
  PATCH: '#A25DDC',
  DELETE: '#FF3D57',
};

// ═══════════════════════════════════════════════════════════════
//  1. Floating Terminal Demo — fixed top-right, below header
// ═══════════════════════════════════════════════════════════════

const TERMINAL_LINES = [
  { type: 'prompt', text: '$ curl -X POST api.monday.com/v2' },
  { type: 'comment', text: '  # create_item via GraphQL mutation' },
  { type: 'output', text: '  → mutation { create_item(board_id: "7291048"...' },
  { type: 'success', text: '  ✓ 200 OK — item #4829 created  [42ms]' },
  { type: 'blank', text: '' },
  { type: 'prompt', text: '$ agent.execute("update_status")' },
  { type: 'output', text: '  → column: status → "Working on it"' },
  { type: 'success', text: '  ✓ status updated  [18ms]' },
  { type: 'blank', text: '' },
  { type: 'prompt', text: '$ mcp.connect("monday-mcp-server")' },
  { type: 'output', text: '  → handshake: protocol=MCP/1.0' },
  { type: 'success', text: '  ✓ connected — 3 tools available  [91ms]' },
];

export function FloatingTerminalDemo() {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible || minimized) return;
    let current = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    const tick = () => {
      current++;
      if (current > TERMINAL_LINES.length) {
        timeoutId = setTimeout(() => { setVisibleLines(0); current = 0; timeoutId = setTimeout(tick, 800); }, 3000);
        return;
      }
      setVisibleLines(current);
      const line = TERMINAL_LINES[current - 1];
      const delay = line?.type === 'blank' ? 300 : line?.type === 'prompt' ? 600 : line?.type === 'output' ? 400 : 250;
      timeoutId = setTimeout(tick, delay);
    };
    timeoutId = setTimeout(tick, 600);
    return () => clearTimeout(timeoutId);
  }, [visible, minimized]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const colorFor = (type: string) => {
    switch (type) {
      case 'prompt': return '#e0e0e0';
      case 'comment': return '#606060';
      case 'output': return `${TEAL}99`;
      case 'success': return TEAL;
      default: return 'transparent';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed top-20 right-6 z-50"
          style={{ width: minimized ? 200 : 280 }}
        >
          <div className="rounded-lg border border-[#1a1a2e] bg-[#0d0d14]/95 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/40">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#1a1a2e] cursor-pointer" onClick={() => setMinimized(m => !m)}>
              <div className="w-2 h-2 rounded-full bg-[#FF3D57]/60" />
              <div className="w-2 h-2 rounded-full bg-[#FFCB00]/60" />
              <div className="w-2 h-2 rounded-full bg-[#00D2D2]/60" />
              <span className="text-[9px] text-[#404050] ml-1.5 font-mono truncate">agent@monday</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00D2D2] animate-pulse" />
            </div>
            {!minimized && (
              <div
                ref={containerRef}
                className="px-3 py-2 font-mono text-[9px] sm:text-[10px] h-[120px] overflow-hidden"
              >
                {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.12 }}
                    className="leading-4"
                    style={{ color: colorFor(line.type) }}
                  >
                    {line.text || '\u00A0'}
                  </motion.div>
                ))}
                {visibleLines < TERMINAL_LINES.length && (
                  <span className="inline-block w-1.5 h-3 animate-pulse" style={{ backgroundColor: TEAL }} />
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════
//  2. Toast Notifications Demo — sliding in from the right
// ═══════════════════════════════════════════════════════════════

interface Toast {
  id: number;
  agent: string;
  action: string;
  method: string;
}

export function ToastNotificationsDemo() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const addToast = useCallback(() => {
    const template = API_TEMPLATES[Math.floor(Math.random() * API_TEMPLATES.length)];
    const toast: Toast = {
      id: idRef.current++,
      agent: template.agent,
      action: template.action,
      method: template.method,
    };
    setToasts(prev => [toast, ...prev].slice(0, 3));
  }, []);

  useEffect(() => {
    const t1 = setTimeout(addToast, 2500);
    const interval = setInterval(addToast, 4000);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, [addToast]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const oldest = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== oldest.id));
    }, 8000);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2" style={{ width: 260 }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-lg border border-[#1a1a2e] bg-[#0d0d14]/95 backdrop-blur-md px-3 py-2.5 shadow-xl shadow-black/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: METHOD_COLORS[toast.method] || TEAL }} />
              <span className="text-[10px] font-mono font-semibold text-white">{toast.agent}</span>
              <span className="ml-auto text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ color: METHOD_COLORS[toast.method], backgroundColor: `${METHOD_COLORS[toast.method]}15` }}>
                {toast.method}
              </span>
            </div>
            <p className="text-[9px] font-mono text-[#808090] leading-relaxed">{toast.action}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  3. Typing Agent Lines — alternative text for the hero typing
// ═══════════════════════════════════════════════════════════════

export const AGENT_TYPING_LINES = {
  line1: '> connecting to monday.com API...',
  line2: '> item created. board updated. done.',
};

// ═══════════════════════════════════════════════════════════════
//  4. Background Stream Overlay — faint scrolling API text
// ═══════════════════════════════════════════════════════════════

const BG_STREAM_SNIPPETS = [
  'mutation { create_item(board_id: "7291048", item_name: "Q1 Review") { id } }',
  'query { boards(ids: [7291048]) { items_page { items { name column_values { text } } } } }',
  'mutation { change_column_value(item_id: "4829", column_id: "status", value: "{\\"label\\":\\"Done\\"}") { id } }',
  'POST /mcp/execute { "tool": "create_update", "args": { "item_id": 4829 } }',
  'mutation { create_notification(user_id: 1234, text: "Agent completed task") { id } }',
  'query { users { id name email } }',
  'POST /openclaw/skills/run { "skill": "summarize_updates", "board_id": 7291048 }',
  'mutation { move_item_to_group(item_id: "4829", group_id: "done") { id } }',
  'GET /v2/boards/7291048/activity_logs?limit=10',
  'mutation { add_file_to_column(item_id: "4829", column_id: "files") { id } }',
];

interface StreamLine {
  id: number;
  text: string;
  left: number;
  speed: number;
  opacity: number;
}

export function BgStreamOverlay() {
  const [lines, setLines] = useState<StreamLine[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const addLine = () => {
      const text = BG_STREAM_SNIPPETS[Math.floor(Math.random() * BG_STREAM_SNIPPETS.length)];
      const line: StreamLine = {
        id: idRef.current++,
        text,
        left: Math.random() * 80,
        speed: 15 + Math.random() * 20,
        opacity: 0.03 + Math.random() * 0.04,
      };
      setLines(prev => [...prev, line].slice(-12));
    };

    addLine();
    const interval = setInterval(addLine, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      <AnimatePresence>
        {lines.map((line) => (
          <motion.div
            key={line.id}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '-100%', opacity: line.opacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: line.speed, ease: 'linear' }}
            className="absolute font-mono text-[9px] sm:text-[10px] text-[#00D2D2] whitespace-nowrap"
            style={{ left: `${line.left}%` }}
            onAnimationComplete={() => {
              setLines(prev => prev.filter(l => l.id !== line.id));
            }}
          >
            {line.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  5. Agent Cursor Demo — cursor flows like a real user browsing
// ═══════════════════════════════════════════════════════════════

type FlowStep =
  | { type: 'stop'; target: string; label: string; pauseMs: number; driftX?: number; driftY?: number }
  | { type: 'read'; targets: string[]; label: string }
  | { type: 'glance'; target: string; driftX?: number; driftY?: number }
  | { type: 'idle'; x: number; y: number; durationMs: number }
  | { type: 'wait_text'; target: string }
  | { type: 'click'; target: string; label: string };

const FLOW_SEQUENCE: FlowStep[] = [
  { type: 'stop', target: 'title', label: 'scanning monday.com/agents...', pauseMs: 1400, driftX: 280, driftY: -40 },
  { type: 'read', targets: ['line1'], label: 'reading...' },
  { type: 'stop', target: 'line2', label: 'reading...', pauseMs: 900 },
  { type: 'click', target: 'cta', label: 'signing up...' },
];

type ResolvedPos = { x: number; y: number };

function CursorIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ filter: 'drop-shadow(0 0 6px rgba(0,210,210,0.4))' }}>
      <path d="M5 3l14 9-6 1-3 8-5-18z" fill={TEAL} stroke={TEAL} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

function measureTarget(target: string): ResolvedPos | null {
  const el = document.querySelector(`[data-agent-target="${target}"]`);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function measureTargetEdges(target: string): { left: ResolvedPos; right: ResolvedPos } | null {
  const el = document.querySelector(`[data-agent-target="${target}"]`);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  const y = rect.top + rect.height / 2;
  return {
    left: { x: rect.left + 12, y },
    right: { x: rect.right - 12, y },
  };
}

function resolveStepPos(step: FlowStep): ResolvedPos {
  if (step.type === 'idle') {
    return { x: (step.x / 100) * window.innerWidth, y: (step.y / 100) * window.innerHeight };
  }
  const pos = measureTarget(step.target) ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  if (step.type === 'glance') {
    return { x: pos.x + (step.driftX ?? 0), y: pos.y + (step.driftY ?? 0) };
  }
  if (step.type === 'stop' && (step.driftX || step.driftY)) {
    return { x: pos.x + (step.driftX ?? 0), y: pos.y + (step.driftY ?? 0) };
  }
  return pos;
}

export function AgentCursorDemo() {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const [showClick, setShowClick] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [labelText, setLabelText] = useState('');
  const [pos, setPos] = useState<ResolvedPos>({ x: 0, y: 0 });
  const stepIdxRef = useRef(0);

  const step = stepIdx < FLOW_SEQUENCE.length ? FLOW_SEQUENCE[stepIdx] : null;

  useEffect(() => {
    const t = setTimeout(() => {
      const initial = resolveStepPos(FLOW_SEQUENCE[0]);
      setPos(initial);
      setVisible(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible || !step) return;

    const isLast = stepIdx === FLOW_SEQUENCE.length - 1;
    const advance = () => {
      if (isLast) {
        setShowLabel(false);
        setIsReading(false);
        setTimeout(() => setDone(true), 600);
      } else {
        setShowLabel(false);
        setShowClick(false);
        setIsReading(false);
        stepIdxRef.current++;
        setStepIdx(stepIdxRef.current);
      }
    };

    // Read step: sweep left-to-right across each line, label stays on
    if (step.type === 'read') {
      setLabelText(step.label);
      setShowLabel(true);
      setIsReading(true);
      const targets = step.targets;
      let lineIdx = 0;
      let cancelled = false;

      const sweepLine = () => {
        if (cancelled || lineIdx >= targets.length) {
          if (!cancelled) advance();
          return;
        }
        const edges = measureTargetEdges(targets[lineIdx]);
        if (!edges) { lineIdx++; sweepLine(); return; }

        setPos(edges.left);

        setTimeout(() => {
          if (cancelled) return;
          setPos(edges.right);

          setTimeout(() => {
            if (cancelled) return;
            lineIdx++;
            sweepLine();
          }, 1800);
        }, 1000);
      };

      const startT = setTimeout(sweepLine, 400);
      return () => { cancelled = true; clearTimeout(startT); };
    }

    if (step.type === 'wait_text') {
      const nextPos = resolveStepPos(step);
      setPos(nextPos);
      const poll = setInterval(() => {
        if (document.querySelector('[data-agent-text-done]')) {
          clearInterval(poll);
          advance();
        }
      }, 200);
      return () => clearInterval(poll);
    }

    const nextPos = resolveStepPos(step);
    setPos(nextPos);
    const distance = Math.hypot(nextPos.x - pos.x, nextPos.y - pos.y);

    if (step.type === 'click') {
      const travelMs = 900 + distance * 2;
      setLabelText(step.label);
      const t1 = setTimeout(() => setShowClick(true), travelMs);
      const t2 = setTimeout(() => setShowLabel(true), travelMs + 400);
      const t3 = setTimeout(advance, travelMs + 2600);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else if (step.type === 'stop') {
      const travelMs = 900 + distance * 2;
      setLabelText(step.label);
      const t1 = setTimeout(() => setShowLabel(true), travelMs * 0.7);
      const t2 = setTimeout(advance, travelMs + step.pauseMs);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else if (step.type === 'glance') {
      const t = setTimeout(advance, 500 + distance * 1.5);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(advance, step.durationMs);
      return () => clearTimeout(t);
    }
  }, [visible, stepIdx]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          aria-hidden
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ left: pos.x - 4, top: pos.y - 2 }}
            transition={
              stepIdx === 0
                ? { duration: 0 }
                : isReading
                  ? { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }
                  : { type: 'spring', stiffness: 30, damping: 20 }
            }
            className="absolute w-6 h-6"
          >
            {/* Click ripple */}
            <AnimatePresence>
              {showClick && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute left-1 top-1 w-4 h-4 rounded-full border-2 border-[#00D2D2]"
                />
              )}
            </AnimatePresence>

            <CursorIcon className="w-6 h-6" />
            <AnimatePresence>
              {showLabel && labelText && (
                <motion.span
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-6 top-0 whitespace-nowrap font-mono text-[10px] px-2 py-1 rounded bg-[#0d0d14]/95 border border-[#1a1a2e] text-[#00D2D2]"
                >
                  {labelText}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════
//  Router — pick the right demo based on setting value
// ═══════════════════════════════════════════════════════════════

export type HeroDemoStyle = 'none' | 'floating_terminal' | 'toasts' | 'typing_agent' | 'bg_stream' | 'agent_cursor';

export function HeroDemoElement({ style }: { style: HeroDemoStyle }) {
  switch (style) {
    case 'floating_terminal': return <FloatingTerminalDemo />;
    case 'toasts': return <ToastNotificationsDemo />;
    case 'bg_stream': return <BgStreamOverlay />;
    case 'agent_cursor': return <AgentCursorDemo />;
    default: return null;
  }
}
