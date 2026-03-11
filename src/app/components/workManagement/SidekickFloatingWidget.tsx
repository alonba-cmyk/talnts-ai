import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import sidekickIcon from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';

const ACCENT = '#A25DDC';
const ACCENT_LIGHT = '#C084FC';
const BUBBLE_TEXT = 'What is your job? I can help with that today.';

const ACTION_OPTIONS = [
  { id: 'automate', label: 'Automate a workflow', icon: '⚡' },
  { id: 'dashboard', label: 'Build a dashboard', icon: '📊' },
  { id: 'project', label: 'Manage a project', icon: '📋' },
  { id: 'report', label: 'Generate a report', icon: '📈' },
  { id: 'organize', label: "Organize my team's tasks", icon: '🗂️' },
];

function useTypingEffect(text: string, speed = 35, active = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(startDelay);
  }, [text, speed, active]);

  return { displayed, done };
}

function PulseRing() {
  return (
    <>
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ border: `1.5px solid ${ACCENT}` }}
        animate={{ scale: [1, 1.45], opacity: [0.35, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ border: `1px solid ${ACCENT}` }}
        animate={{ scale: [1, 1.7], opacity: [0.2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1 }}
      />
    </>
  );
}

function AnimatedBorder({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-60 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}60, transparent 40%, transparent 60%, ${ACCENT_LIGHT}40)`,
          backgroundSize: '300% 300%',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative rounded-2xl overflow-hidden" style={{ backgroundColor: '#111111' }}>
        {children}
      </div>
    </div>
  );
}

export function SidekickFloatingWidget() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { displayed, done } = useTypingEffect(BUBBLE_TEXT, 35, visible && !isOpen && !dismissed);

  const dismiss = () => {
    setDismissed(true);
    setVisible(false);
    setIsOpen(false);
  };

  useEffect(() => {
    if (dismissed) return;
    let triggered = false;
    function onScroll() {
      if (triggered) return;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY > 400) {
        triggered = true;
        setVisible(true);
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    const t = setTimeout(() => document.addEventListener('click', handleClickOutside), 100);
    return () => {
      clearTimeout(t);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedAction(null);
      setShowResponse(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!selectedAction) return;
    setShowResponse(false);
    const t = setTimeout(() => setShowResponse(true), 800);
    return () => clearTimeout(t);
  }, [selectedAction]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50" ref={panelRef}>
      {/* ─── Expanded chat panel ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', damping: 22, stiffness: 240, mass: 0.8 }}
            className="absolute bottom-[76px] right-0 w-[340px] sm:w-[380px]"
          >
            <AnimatedBorder>
              {/* Header */}
              <div
                className="flex items-center gap-3 px-5 py-4"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}12, transparent)`,
                  borderBottom: `1px solid ${ACCENT}18`,
                }}
              >
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(145deg, ${ACCENT}35, ${ACCENT}15)`,
                      boxShadow: `0 0 20px ${ACCENT}20`,
                    }}
                  >
                    <img src={sidekickIcon} alt="Sidekick" className="w-6 h-6 object-contain" />
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                    style={{ backgroundColor: '#10b981', borderColor: '#111111' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-white">Sidekick</span>
                    <Sparkles size={12} style={{ color: ACCENT_LIGHT }} />
                  </div>
                  <span className="text-[11px] text-gray-500">AI Work Assistant</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Chat body */}
              <div className="px-5 py-5 space-y-5 max-h-[420px] overflow-y-auto">
                {/* Sidekick message */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      background: `linear-gradient(135deg, ${ACCENT}30, ${ACCENT}10)`,
                    }}
                  >
                    <img src={sidekickIcon} alt="" className="w-4 h-4 object-contain" />
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-md px-4 py-3 text-[13px] text-gray-200 leading-[1.6]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                      border: '1px solid rgba(255,255,255,0.08)',
                      maxWidth: '280px',
                    }}
                  >
                    {BUBBLE_TEXT}
                  </div>
                </motion.div>

                {/* Action options */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex flex-wrap gap-2 pl-10"
                >
                  {ACTION_OPTIONS.map((opt, i) => (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.07, duration: 0.3 }}
                      whileHover={{ scale: 1.04, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedAction(opt.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all duration-200 cursor-pointer"
                      style={{
                        backgroundColor:
                          selectedAction === opt.id ? `${ACCENT}20` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selectedAction === opt.id ? `${ACCENT}50` : 'rgba(255,255,255,0.07)'}`,
                        color: selectedAction === opt.id ? ACCENT_LIGHT : '#999',
                        boxShadow: selectedAction === opt.id ? `0 0 16px ${ACCENT}15` : 'none',
                      }}
                    >
                      <span className="text-[13px]">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Response after selection */}
                <AnimatePresence>
                  {selectedAction && showResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                        style={{
                          background: `linear-gradient(135deg, ${ACCENT}30, ${ACCENT}10)`,
                        }}
                      >
                        <img src={sidekickIcon} alt="" className="w-4 h-4 object-contain" />
                      </div>
                      <div
                        className="rounded-2xl rounded-tl-md px-4 py-3 text-[13px] leading-[1.6]"
                        style={{
                          background: `linear-gradient(135deg, ${ACCENT}18, ${ACCENT}08)`,
                          border: `1px solid ${ACCENT}25`,
                          color: '#e0d0f0',
                          maxWidth: '280px',
                          boxShadow: `0 4px 20px ${ACCENT}10`,
                        }}
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles size={12} style={{ color: ACCENT_LIGHT }} />
                          On it! Setting that up for you right now.
                        </span>
                      </div>
                    </motion.div>
                  )}
                  {selectedAction && !showResponse && (
                    <motion.div
                      key="typing-indicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                        style={{
                          background: `linear-gradient(135deg, ${ACCENT}30, ${ACCENT}10)`,
                        }}
                      >
                        <img src={sidekickIcon} alt="" className="w-4 h-4 object-contain" />
                      </div>
                      <div
                        className="rounded-2xl rounded-tl-md px-4 py-3"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <span className="inline-flex items-center gap-[4px]">
                          {[0, 1, 2].map(i => (
                            <motion.span
                              key={i}
                              animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1, 0.85] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                              className="w-[6px] h-[6px] rounded-full"
                              style={{ backgroundColor: ACCENT_LIGHT }}
                            />
                          ))}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div
                className="px-5 py-3 flex items-center gap-2"
                style={{
                  borderTop: `1px solid ${ACCENT}12`,
                  background: 'rgba(255,255,255,0.015)',
                }}
              >
                <div
                  className="flex-1 rounded-xl px-3.5 py-2.5 text-[12px] text-gray-600"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  Type a message...
                </div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT}, #7C3AED)`,
                    opacity: 0.5,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </div>
              </div>
            </AnimatedBorder>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Collapsed bubble ─── */}
      <div className="flex items-end gap-3 justify-end">
        {/* Speech bubble */}
        <AnimatePresence>
          {!isOpen && displayed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="hidden sm:block max-w-[260px] px-4 py-3 rounded-2xl rounded-br-md cursor-pointer relative group"
              style={{
                background: 'linear-gradient(135deg, rgba(20,20,20,0.95), rgba(16,16,16,0.98))',
                border: `1px solid ${ACCENT}30`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${ACCENT}10`,
                backdropFilter: 'blur(16px)',
              }}
              onClick={() => setIsOpen(true)}
            >
              <button
                onClick={(e) => { e.stopPropagation(); dismiss(); }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                style={{ backgroundColor: '#222', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <X size={10} />
              </button>
              <p className="text-[13px] text-gray-300 leading-[1.55]">
                {displayed}
                {!done && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: 'steps(2)' }}
                    className="inline-block w-[2px] h-[14px] ml-[2px] align-middle rounded-full"
                    style={{ backgroundColor: ACCENT_LIGHT }}
                  />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidekick icon button */}
        <motion.button
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
            y: isOpen ? 0 : [0, -4, 0, 4, 0],
          }}
          transition={
            isOpen
              ? { duration: 0.2 }
              : {
                  opacity: { duration: 0.5 },
                  scale: { type: 'spring', stiffness: 300, damping: 18, duration: 0.6 },
                  rotate: { type: 'spring', stiffness: 200, damping: 15 },
                  y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
                }
          }
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-[60px] h-[60px] rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer relative"
          style={{
            background: `linear-gradient(145deg, #2a2040, #1a1530)`,
            border: `1.5px solid ${ACCENT}60`,
            boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 35px ${ACCENT}30`,
          }}
        >
          {!isOpen && <PulseRing />}

          <motion.img
            src={sidekickIcon}
            alt="Sidekick"
            className="w-8 h-8 object-contain relative z-10"
            animate={isOpen ? { rotate: 0 } : {}}
          />

          {!isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full border-[2.5px] z-20"
              style={{ backgroundColor: '#10b981', borderColor: '#0a0a0a' }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}
