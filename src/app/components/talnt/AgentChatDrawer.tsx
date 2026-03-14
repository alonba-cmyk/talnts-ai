import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, ArrowRight, Bot, User } from 'lucide-react';
import { useAgentChat } from '../../talnt/AgentChatContext';
import { useTalntTheme } from '../../talnt/TalntThemeContext';
import { getCategoryVisual } from '../../talnt/agentVisuals';
import AgentAvatar from './AgentAvatar';
import type { AgentCategory } from '../../talnt/types';

interface Capability {
  label: string;
  description: string;
  icon: string;
}

const CATEGORY_CAPABILITIES: Record<AgentCategory, Capability[]> = {
  'Content Writer': [
    { label: 'Write a blog post', description: 'Generate a full SEO-optimized article on any topic', icon: '📝' },
    { label: 'Create ad copy', description: 'Craft high-converting copy for ads and landing pages', icon: '🎯' },
    { label: 'Draft newsletter', description: 'Write an engaging email newsletter with subject lines', icon: '📧' },
    { label: 'Content audit', description: 'Review and improve existing content for clarity and SEO', icon: '🔍' },
  ],
  'SDR / Sales': [
    { label: 'Draft outreach email', description: 'Create a personalized cold email for a prospect', icon: '📨' },
    { label: 'Qualify a lead', description: 'Assess lead fit based on ICP and engagement signals', icon: '🎯' },
    { label: 'Build prospect list', description: 'Research and compile a targeted prospect list', icon: '📋' },
    { label: 'Write follow-up sequence', description: 'Design a multi-touch follow-up cadence', icon: '🔄' },
  ],
  'Customer Support': [
    { label: 'Handle a ticket', description: 'Resolve a customer issue with empathy and accuracy', icon: '🎫' },
    { label: 'Write FAQ article', description: 'Create a self-service knowledge base article', icon: '📖' },
    { label: 'Design escalation flow', description: 'Build smart routing rules for ticket escalation', icon: '🔀' },
    { label: 'Analyze sentiment', description: 'Assess customer sentiment across recent interactions', icon: '💬' },
  ],
  'Developer': [
    { label: 'Review my code', description: 'Analyze code for bugs, performance, and best practices', icon: '🔍' },
    { label: 'Write unit tests', description: 'Generate comprehensive test coverage for a module', icon: '🧪' },
    { label: 'Fix a bug', description: 'Debug and resolve an issue in your codebase', icon: '🐛' },
    { label: 'Design an API', description: 'Architect a RESTful or GraphQL API endpoint', icon: '🏗️' },
  ],
  'Data Analyst': [
    { label: 'Build a dashboard', description: 'Create an interactive dashboard with key metrics', icon: '📊' },
    { label: 'Run data analysis', description: 'Analyze a dataset and surface actionable insights', icon: '🔬' },
    { label: 'Generate report', description: 'Produce a formatted report with charts and findings', icon: '📄' },
    { label: 'Detect anomalies', description: 'Identify unusual patterns and outliers in your data', icon: '🚨' },
  ],
  'Marketing': [
    { label: 'Plan a campaign', description: 'Design a multi-channel marketing campaign strategy', icon: '🗺️' },
    { label: 'A/B test copy', description: 'Generate and test ad copy variants for performance', icon: '⚡' },
    { label: 'Analytics report', description: 'Compile a campaign performance report with insights', icon: '📈' },
    { label: 'Content calendar', description: 'Build a monthly content calendar across channels', icon: '📅' },
  ],
  'Research': [
    { label: 'Market research', description: 'Conduct in-depth analysis of a market or industry', icon: '🌐' },
    { label: 'Competitive analysis', description: 'Map competitor positioning, features, and strategy', icon: '🏆' },
    { label: 'Literature review', description: 'Survey academic papers and synthesize findings', icon: '📚' },
    { label: 'Trend report', description: 'Identify and forecast emerging industry trends', icon: '📈' },
  ],
  'Operations': [
    { label: 'Automate a workflow', description: 'Design and deploy an automated business process', icon: '⚙️' },
    { label: 'Process audit', description: 'Review current workflows and identify inefficiencies', icon: '🔎' },
    { label: 'KPI dashboard', description: 'Set up tracking for key operational metrics', icon: '📊' },
    { label: 'Schedule & assign tasks', description: 'Automate task creation, assignment, and deadlines', icon: '📋' },
  ],
};

interface ChatMessage {
  id: string;
  role: 'agent' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

function generateAgentResponse(agentName: string, capability: string, category: AgentCategory): string {
  const responses: Record<string, Record<string, string>> = {
    'Content Writer': {
      'Write a blog post': `Great choice! I can write a fully optimized blog post for you. To get started, I'll need:\n\n• **Topic or keyword** you'd like to target\n• **Target audience** (developers, marketers, etc.)\n• **Desired length** (1000, 2000, or 3000+ words)\n• **Tone** (professional, casual, technical)\n\nI'll deliver a complete draft with meta descriptions, headers, and internal linking suggestions. What topic should we start with?`,
      'Create ad copy': `I'd love to help with ad copy! I can create variants for:\n\n• **Google Ads** — headlines + descriptions\n• **Meta/Facebook** — primary text + headlines\n• **LinkedIn** — sponsored content\n\nFor each platform, I'll generate 3-5 variants optimized for click-through rate. What product or service are we promoting?`,
      'Draft newsletter': `Let's craft an engaging newsletter! I'll need to know:\n\n• **Newsletter topic** or key announcements\n• **Audience segment** (all subscribers, new users, etc.)\n• **Desired CTA** (sign up, read more, buy now)\n\nI'll write the content, suggest 5 subject line options with predicted open rates, and format for email. What's this newsletter about?`,
      'Content audit': `I can review your existing content and identify opportunities for improvement. I'll analyze:\n\n• **SEO gaps** — missing keywords, meta data\n• **Readability** — sentence structure, clarity\n• **Engagement** — hooks, CTAs, structure\n• **Freshness** — outdated info, broken links\n\nShare a URL or paste the content, and I'll get started!`,
    },
    'SDR / Sales': {
      'Draft outreach email': `Let's write a cold email that gets responses! I'll need:\n\n• **Prospect info** — company, role, industry\n• **Your value prop** — what problem you solve\n• **Social proof** — relevant case studies or metrics\n\nI'll craft a personalized email using proven frameworks (AIDA, PAS) with a clear CTA. Who's the prospect?`,
      'Qualify a lead': `I'll assess lead quality based on your ICP. Share the lead details and I'll score them on:\n\n• **Fit** — company size, industry, tech stack\n• **Intent** — engagement signals, website activity\n• **Timing** — budget cycle, urgency indicators\n• **Authority** — decision-making power\n\nWhat lead would you like me to evaluate?`,
      'Build prospect list': `I can compile a targeted prospect list. Tell me:\n\n• **Target industry** and company size\n• **Decision maker roles** (VP Sales, CTO, etc.)\n• **Geography** (US, EU, global)\n• **Any exclusions** (competitors, existing customers)\n\nI'll deliver a structured list with contact info and personalization notes. What's your ideal customer profile?`,
      'Write follow-up sequence': `I'll design a multi-touch follow-up cadence for you. I typically recommend:\n\n• **Day 1** — Initial outreach\n• **Day 3** — Value-add follow-up\n• **Day 7** — Social proof touch\n• **Day 14** — Breakup email\n\nEach touch is personalized and adds new value. What product/service are we following up about?`,
    },
  };

  const categoryResponses = responses[category];
  if (categoryResponses && categoryResponses[capability]) {
    return categoryResponses[capability];
  }

  return `Absolutely! I'm ready to help you with **${capability.toLowerCase()}**.\n\nAs ${agentName}, I've handled hundreds of similar tasks with a high success rate. Let me walk you through what I'll need to get started:\n\n• **Context** — Tell me about your specific situation\n• **Goals** — What outcome are you hoping for?\n• **Timeline** — Any deadlines I should know about?\n\nOnce I have these details, I'll put together a plan and get started right away. What would you like to begin with?`;
}

function generateFreeformResponse(agentName: string, category: AgentCategory, _message: string): string {
  const fallbacks = [
    `That's a great question! Based on my experience in **${category.toLowerCase()}**, here's what I'd recommend:\n\n1. Let's start by understanding your current setup\n2. I'll identify the key opportunities\n3. Then we'll build a plan together\n\nCould you share a bit more detail about what you're working with?`,
    `I'd be happy to help with that! As a specialized **${category.toLowerCase()}** agent, I've seen this kind of challenge before.\n\nLet me break down the approach:\n\n• First, I'll analyze your requirements\n• Then propose 2-3 options with trade-offs\n• Finally, we'll pick the best path forward\n\nWhat's the most important outcome for you?`,
    `Interesting! This is right in my wheelhouse. Here's how ${agentName} handles this:\n\n1. **Discovery** — I'll ask a few targeted questions\n2. **Analysis** — I'll process the information\n3. **Delivery** — You'll get actionable results\n\nTypical turnaround is very fast. Shall we dive in?`,
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export default function AgentChatDrawer() {
  const { isOpen, agent, closeChat } = useAgentChat();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevAgentIdRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && agent && agent.id !== prevAgentIdRef.current) {
      prevAgentIdRef.current = agent.id;
      setMessages([{
        id: 'intro',
        role: 'agent',
        content: `Hey! I'm **${agent.name}** — ${agent.description.split('.')[0].toLowerCase()}.\n\nI'm powered by **${agent.model}** and built on **${agent.framework}**. Here's what I can help you with today:`,
        timestamp: new Date(),
      }]);
      setInputValue('');
      setIsAgentTyping(false);
      setTimeout(() => inputRef.current?.focus(), 400);
    }
    if (!isOpen) {
      prevAgentIdRef.current = null;
    }
  }, [isOpen, agent]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAgentTyping, scrollToBottom]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeChat(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, closeChat]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const addAgentResponse = useCallback((content: string) => {
    setIsAgentTyping(true);
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      setIsAgentTyping(false);
      setMessages(prev => [...prev, {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content,
        timestamp: new Date(),
      }]);
    }, delay);
  }, []);

  const handleCapabilityClick = useCallback((cap: Capability) => {
    if (!agent || isAgentTyping) return;
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      role: 'user',
      content: cap.label,
      timestamp: new Date(),
    }]);
    const response = generateAgentResponse(agent.name, cap.label, agent.categories[0]);
    addAgentResponse(response);
  }, [agent, isAgentTyping, addAgentResponse]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || !agent || isAgentTyping) return;
    const userMsg = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMsg,
      timestamp: new Date(),
    }]);
    const response = generateFreeformResponse(agent.name, agent.categories[0], userMsg);
    addAgentResponse(response);
  }, [inputValue, agent, isAgentTyping, addAgentResponse]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  if (!agent) return null;

  const { tokens } = useTalntTheme();
  const visual = getCategoryVisual(agent.categories);
  const capabilities = agent.categories
    .flatMap(cat => CATEGORY_CAPABILITIES[cat] || [])
    .filter((cap, i, arr) => arr.findIndex(c => c.label === cap.label) === i)
    .slice(0, 6);

  const showCapabilities = messages.length <= 2 && !isAgentTyping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeChat}
            className="fixed inset-0 z-[200]"
            style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[201] flex flex-col"
            style={{
              width: 'min(480px, 100vw)',
              background: tokens.bgCard,
              borderLeft: `1px solid ${tokens.borderDefault}`,
              fontFamily: 'Figtree, sans-serif',
              transition: 'background 0.3s, border-color 0.3s',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-4 shrink-0"
              style={{
                background: `linear-gradient(180deg, rgba(${visual.accentColorRgb}, 0.08) 0%, transparent 100%)`,
                borderBottom: `1px solid ${tokens.borderDefault}`,
              }}
            >
              <AgentAvatar agent={agent} size="sm" showStatus showRing={false} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm truncate" style={{ color: tokens.textPrimary }}>{agent.name}</h3>
                  {agent.isOnline && (
                    <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: visual.accentColor }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: visual.accentColor }} />
                      Online
                    </span>
                  )}
                </div>
                <p className="text-[11px] truncate" style={{ color: tokens.textMuted }}>{agent.framework} &middot; {agent.model}</p>
              </div>
              <button
                onClick={closeChat}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ color: tokens.textMuted }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.role === 'agent' ? (
                      <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
                        style={{ background: visual.gradient }}
                      >
                        <Bot size={14} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
                        style={{ background: tokens.bgSurface2 }}
                      >
                        <User size={14} style={{ color: tokens.textSecondary }} />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed ${
                        msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
                      }`}
                      style={{
                        background: msg.role === 'user' ? tokens.bgSurface2 : tokens.bgSurface,
                        border: `1px solid ${tokens.borderDefault}`,
                        color: tokens.textSecondary,
                      }}
                    >
                      {msg.content.split('\n').map((line, i) => (
                        <span key={i}>
                          {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                            part.startsWith('**') && part.endsWith('**')
                              ? <strong key={j} style={{ color: tokens.textPrimary, fontWeight: 600 }}>{part.slice(2, -2)}</strong>
                              : part
                          )}
                          {i < msg.content.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Capability buttons */}
              {showCapabilities && capabilities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="grid grid-cols-1 gap-2 pt-1"
                >
                  {capabilities.map((cap, i) => (
                    <motion.button
                      key={cap.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.3 + i * 0.06 }}
                      onClick={() => handleCapabilityClick(cap)}
                      className="group flex items-center gap-3 text-left rounded-xl px-4 py-3 transition-all duration-200"
                      style={{
                        background: tokens.bgSurface,
                        border: `1px solid rgba(${visual.accentColorRgb}, 0.1)`,
                      }}
                      whileHover={{
                        backgroundColor: `rgba(${visual.accentColorRgb}, 0.06)`,
                        borderColor: `rgba(${visual.accentColorRgb}, 0.25)`,
                      }}
                    >
                      <span className="text-lg shrink-0">{cap.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block" style={{ color: tokens.textPrimary }}>{cap.label}</span>
                        <span className="text-[11px] block mt-0.5" style={{ color: tokens.textMuted }}>{cap.description}</span>
                      </div>
                      <ArrowRight size={14} className="shrink-0" style={{ color: tokens.textMuted }} />
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Typing indicator */}
              {isAgentTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
                    style={{ background: visual.gradient }}
                  >
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md px-4 py-3"
                    style={{ background: tokens.bgSurface, border: `1px solid ${tokens.borderDefault}` }}
                  >
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ background: visual.accentColor }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 shrink-0" style={{ borderTop: `1px solid ${tokens.borderDefault}` }}>
              <div
                className="flex items-center gap-2 rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  background: tokens.bgInput,
                  border: `1px solid rgba(${visual.accentColorRgb}, 0.15)`,
                }}
              >
                <Sparkles size={16} className="ml-4 shrink-0" style={{ color: visual.accentColor, opacity: 0.5 }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${agent.name} anything...`}
                  disabled={isAgentTyping}
                  className="flex-1 bg-transparent text-sm py-3 outline-none disabled:opacity-50"
                  style={{ color: tokens.textPrimary, caretColor: tokens.textPrimary }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isAgentTyping}
                  className="w-9 h-9 mr-1.5 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30"
                  style={{
                    background: inputValue.trim() ? `rgba(${visual.accentColorRgb}, 0.2)` : 'transparent',
                    color: visual.accentColor,
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[10px] text-center mt-2" style={{ color: tokens.textMuted }}>
                This is a demo conversation &middot; {agent.name} is simulated
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
