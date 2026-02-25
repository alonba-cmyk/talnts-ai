import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';
import {
  Database,
  Shield,
  Brain,
  Globe,
  Plug,
  ArrowUp,
  ArrowRight,
  Layers,
  Lock,
  Sparkles,
  LayoutGrid,
  ListChecks,
  BarChart3,
  Boxes,
  FileText,
  Plus,
  X,
  Cpu,
} from 'lucide-react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';

// ─── Shared Data ───────────────────────────────────────────────────

const integrationTools = [
  { name: 'Slack', domain: 'slack.com' },
  { name: 'Salesforce', domain: 'salesforce.com' },
  { name: 'Jira', domain: 'atlassian.com' },
  { name: 'Google', domain: 'google.com' },
  { name: 'GitHub', domain: 'github.com' },
  { name: 'Zoom', domain: 'zoom.us' },
  { name: 'HubSpot', domain: 'hubspot.com' },
  { name: 'Figma', domain: 'figma.com' },
  { name: 'Notion', domain: 'notion.so' },
  { name: 'Teams', domain: 'microsoft.com' },
  { name: 'Asana', domain: 'asana.com' },
  { name: 'Dropbox', domain: 'dropbox.com' },
  { name: 'Zendesk', domain: 'zendesk.com' },
  { name: 'Cursor', domain: 'cursor.com' },
  { name: 'Shopify', domain: 'shopify.com' },
  { name: 'Claude', domain: 'claude.ai' },
];

const EXTRA_INTEGRATIONS = [
  { name: 'Twilio', domain: 'twilio.com' },
  { name: 'Mailchimp', domain: 'mailchimp.com' },
  { name: 'Intercom', domain: 'intercom.com' },
  { name: 'Confluence', domain: 'confluence.atlassian.com' },
  { name: 'Airtable', domain: 'airtable.com' },
  { name: 'Monday Dev', domain: 'monday.com' },
  { name: 'PagerDuty', domain: 'pagerduty.com' },
  { name: 'Datadog', domain: 'datadoghq.com' },
];

const LOGO = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

// ─── Animated Flow Arrows ──────────────────────────────────────────

function FlowArrows({ direction = 'up', color = '#6161ff' }: { direction?: 'up' | 'down'; color?: string }) {
  const rotation = direction === 'up' ? 0 : 180;
  return (
    <div className="flex justify-center gap-2.5 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: direction === 'up' ? [0, -5, 0] : [0, 5, 0] }}
          transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowUp
            className="w-4 h-4"
            style={{ color: `${color}50`, transform: `rotate(${rotation}deg)` }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Bidirectional Flow Arrows ─────────────────────────────────────

function BiDirectionalFlowArrows({ color = '#6161ff' }: { color?: string }) {
  return (
    <div className="flex justify-center gap-2.5 py-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col items-center gap-0">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowUp className="w-4 h-4" style={{ color: `${color}50` }} />
          </motion.div>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, delay: i * 0.2 + 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowUp className="w-4 h-4 rotate-180" style={{ color: `${color}50` }} />
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// ─── Horizontal Flow Arrows (for side layout) ─────────────────────

function HorizontalFlowArrows({ color = '#10b981', direction = 'right' }: { color?: string; direction?: 'left' | 'right' }) {
  const animateX = direction === 'left' ? [0, -4, 0] : [0, 4, 0];
  const rotation = direction === 'left' ? 180 : 0;
  return (
    <div className="flex flex-col justify-center items-center gap-2 px-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ x: animateX }}
          transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowRight
            className="w-4 h-4"
            style={{ color: `${color}50`, transform: `rotate(${rotation}deg)` }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Layer Hover Tooltip ───────────────────────────────────────────

function LayerTooltip({ text, visible }: { text: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap"
        >
          <div className="bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-lg">
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  CLASSIC VARIANT (original layout)
// ═══════════════════════════════════════════════════════════════════

function PlatformArchitectureClassic() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-28 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Platform Capabilities
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Enterprise-grade infrastructure that powers every AI experience
          </p>
        </motion.div>

        {/* Concentric Architecture Visualization */}
        <div className="relative">
          {/* Outer Layer - Open Ecosystem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="relative rounded-3xl border-2 border-dashed border-gray-200 bg-white p-6 md:p-8"
          >
            {/* Open Ecosystem Label */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-gray-200">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-gray-700">Open Ecosystem</span>
              </div>
            </div>

            {/* Integration icons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6 pt-4">
              {integrationTools.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.06 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
                >
                  <img src={LOGO(tool.domain)} alt={tool.name} className="w-4 h-4 rounded-sm" />
                  <span className="text-xs text-gray-600 font-medium">{tool.name}</span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 1.3 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200"
              >
                <Plug className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs text-emerald-700 font-semibold">MCP</span>
              </motion.div>
            </div>

            <div className="text-center mb-6">
              <p className="text-xs text-gray-400">
                Integrations, MCP, and APIs connect your entire tool ecosystem
              </p>
            </div>

            {/* Middle Layer - Context */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative rounded-2xl border border-[#6161ff]/20 bg-gradient-to-br from-[#6161ff]/[0.03] to-purple-50/50 p-6 md:p-8"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-[#6161ff]/20">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#6161ff]" />
                  <span className="text-sm font-semibold text-[#6161ff]">Context</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-2">
                <div className="text-center md:text-left">
                  <p className="text-sm font-medium text-gray-700 mb-1">Understands your work</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Sits on your data and deeply understands your business context, workflows, and relationships
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">Feeds</p>
                  <div className="flex justify-center gap-3">
                    {[
                      { logo: agentsLogo, label: 'Agents' },
                      { logo: sidekickLogo, label: 'Sidekick' },
                      { logo: vibeLogo, label: 'Vibe' },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col items-center gap-1">
                        <img src={item.logo} alt={item.label} className="w-8 h-8 object-contain" />
                        <span className="text-[10px] text-gray-500 font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm font-medium text-gray-700 mb-1">Accurate & Relevant</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Delivers precise, high-quality results tailored to your specific jobs to be done
                  </p>
                </div>
              </div>

              {/* Animated flow arrows */}
              <div className="flex justify-center gap-2 mb-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowUp className="w-4 h-4 text-[#6161ff]/30 rotate-180" />
                  </motion.div>
                ))}
              </div>

              {/* Inner Layer - System of Records */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0 }}
                className="relative rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-gray-700" />
                    <span className="text-sm font-semibold text-gray-700">System of Records</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <Layers className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Your Organization Data</p>
                      <p className="text-xs text-gray-500">CRM, projects, tasks, communications, docs</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-px h-10 bg-gray-200" />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Enterprise Grade Secure</p>
                      <p className="text-xs text-gray-500">SOC 2, GDPR, HIPAA compliant</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-px h-10 bg-gray-200" />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Permission Aware</p>
                      <p className="text-xs text-gray-500">AI respects your data access policies</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  RESTRUCTURED VARIANT (new layer order)
// ═══════════════════════════════════════════════════════════════════

const PRODUCTS = [
  {
    logo: agentsLogo,
    name: 'Agents',
    description: 'AI agents that execute your jobs to be done autonomously',
  },
  {
    logo: sidekickLogo,
    name: 'Sidekick',
    description: 'Your personal AI assistant across every workflow',
  },
  {
    logo: vibeLogo,
    name: 'Vibe',
    description: 'Build custom apps for any use case — no code needed',
  },
];

function PlatformArchitectureRestructured() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [addedIntegrations, setAddedIntegrations] = useState<typeof EXTRA_INTEGRATIONS>([]);
  const [showAddPopover, setShowAddPopover] = useState(false);

  const availableExtras = EXTRA_INTEGRATIONS.filter(
    (e) => !addedIntegrations.some((a) => a.domain === e.domain)
  );

  const allIntegrations = [...integrationTools, ...addedIntegrations];

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-28 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Platform Capabilities
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Enterprise-grade infrastructure that powers every AI experience
          </p>
        </motion.div>

        <div className="relative flex flex-col items-center">
          {/* ═══ Layer 1: AI Work Capabilities (centered) ═══ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative w-full max-w-3xl rounded-3xl border-2 border-dashed border-[#6161ff]/25 bg-white p-6 md:p-8 transition-all duration-300"
            style={{
              boxShadow: hoveredLayer === 'capabilities'
                ? '0 0 30px rgba(97,97,255,0.08)'
                : 'none',
            }}
            onMouseEnter={() => setHoveredLayer('capabilities')}
            onMouseLeave={() => setHoveredLayer(null)}
          >
            {/* Title — inside the border, at the top */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-[#6161ff]" />
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">
                  AI Work <span className="bg-gradient-to-r from-[#6161ff] to-[#8b7bff] bg-clip-text text-transparent">Platform</span>
                </h3>
              </div>
            </div>

            {/* ═══ AI Work Capabilities (inner border around products) ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-2xl border border-[#6161ff]/15 bg-gradient-to-br from-[#6161ff]/[0.01] to-white p-4 md:p-5 pt-6 md:pt-7 mt-4 mb-4"
            >
              {/* AI Work Capabilities label */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-[#6161ff]/15 shadow-sm">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#6161ff]" />
                  <span className="text-sm font-semibold text-[#6161ff]">AI Work Capabilities</span>
                </div>
              </div>

              {/* Product cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRODUCTS.map((product, idx) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-100 bg-white hover:border-[#6161ff]/20 hover:shadow-md hover:shadow-[#6161ff]/[0.04] transition-all duration-300 cursor-default"
                  >
                    <img
                      src={product.logo}
                      alt={product.name}
                      className="w-10 h-10 object-contain flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900">{product.name}</p>
                      <p className="text-[11px] text-gray-400 leading-snug line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-3">
                <p className="text-[11px] text-gray-400 mb-0.5">
                  Powered by <span className="font-semibold text-[#6161ff]/70">Work Context</span>
                </p>
                <p className="text-[10px] text-gray-400">
                  Understands your business deeply &middot; Delivers accurate, relevant results
                </p>
              </div>
            </motion.div>

            {/* Flow: Context → Capabilities */}
            <FlowArrows direction="up" color="#6161ff" />

            {/* ═══ Layer 2: Work Context (middle) ═══ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative rounded-2xl border border-[#6161ff]/15 bg-gradient-to-br from-[#6161ff]/[0.02] to-purple-50/30 p-5 md:p-6 transition-all duration-300"
              style={{
                boxShadow: hoveredLayer === 'context'
                  ? '0 0 24px rgba(97,97,255,0.06)'
                  : 'none',
              }}
              onMouseEnter={() => setHoveredLayer('context')}
              onMouseLeave={() => setHoveredLayer(null)}
            >
              {/* Label */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-[#6161ff]/15 shadow-sm">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#6161ff]" />
                  <span className="text-sm font-semibold text-[#6161ff]">Work Context</span>
                </div>
                <LayerTooltip text="Deep understanding of your data, workflows & relationships" visible={hoveredLayer === 'context'} />
              </div>

              {/* Work Context building blocks */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 mb-3">
                {[
                  { icon: LayoutGrid, label: 'Boards' },
                  { icon: ListChecks, label: 'Items' },
                  { icon: BarChart3, label: 'Dashboards' },
                  { icon: Boxes, label: 'Blocks' },
                  { icon: FileText, label: 'Files' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-xl bg-[#6161ff]/[0.04] border border-[#6161ff]/10">
                    <item.icon className="w-8 h-8 text-[#6161ff]/50" />
                    <span className="text-xs text-[#6161ff]/70 font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Flow: SoR ↔ Context */}
              <BiDirectionalFlowArrows color="#6161ff" />

              {/* ═══ Layer 3: System of Records (inner) ═══ */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative rounded-xl border border-gray-200 bg-gray-50/50 p-5 md:p-6 transition-all duration-300"
                style={{
                  boxShadow: hoveredLayer === 'sor'
                    ? '0 2px 12px rgba(0,0,0,0.04)'
                    : 'none',
                }}
                onMouseEnter={() => setHoveredLayer('sor')}
                onMouseLeave={() => setHoveredLayer(null)}
              >
                {/* Label */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-500">System of Records</span>
                  </div>
                  <LayerTooltip text="Enterprise-grade data foundation" visible={hoveredLayer === 'sor'} />
                </div>

                {/* Enterprise Grade Secure badge on bottom border */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border border-[#6161ff]/10 flex items-center gap-1.5 z-10">
                  <Shield className="w-3 h-3 text-[#6161ff]/50" />
                  <span className="text-[10px] font-medium text-[#6161ff]/60">Enterprise Grade Secure</span>
                  <span className="text-[9px] text-gray-400">SOC 2, GDPR, HIPAA</span>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#6161ff]/5 border border-[#6161ff]/10 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-5 h-5 text-[#6161ff]/50" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Governance and Permissions</p>
                      <p className="text-[11px] text-gray-400">AI respects your data access policies</p>
                    </div>
                  </div>
                  <div className="w-full h-px bg-gray-100" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#6161ff]/5 border border-[#6161ff]/10 flex items-center justify-center flex-shrink-0">
                      <Layers className="w-5 h-5 text-[#6161ff]/50" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Your Organization Data</p>
                      <p className="text-[11px] text-gray-400">CRM, projects, tasks, communications, docs</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ═══ Open Ecosystem (absolutely positioned right on desktop, below on mobile) ═══ */}
          <div
            className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-[calc(100%-44px)] flex flex-col md:flex-row items-center mt-4 md:mt-0"
          >
            {/* Desktop: horizontal arrows pointing left */}
            <div className="hidden md:flex items-center flex-shrink-0">
              <HorizontalFlowArrows color="#10b981" direction="left" />
            </div>

            {/* Mobile: vertical arrows */}
            <div className="flex md:hidden justify-center mb-3">
              <FlowArrows direction="up" color="#10b981" />
            </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex flex-col items-center justify-center px-2 py-4"
          >
            {/* Label */}
            <div className="flex items-center gap-1.5 mb-3">
              <Globe className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Open Ecosystem</span>
            </div>

            {/* Favicon grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {allIntegrations.map((tool, i) => (
                <motion.div
                  key={tool.domain}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i < integrationTools.length ? 0.9 + i * 0.03 : 0 }}
                  className="group relative w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-emerald-50/40 hover:border-emerald-200 transition-colors cursor-default"
                >
                  <img src={LOGO(tool.domain)} alt={tool.name} className="w-4 h-4 rounded-sm" />
                  {/* Tooltip */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <div className="bg-gray-900 text-white text-[9px] px-2 py-0.5 rounded whitespace-nowrap">
                      {tool.name}
                    </div>
                  </div>
                  {/* Remove button for added integrations */}
                  {addedIntegrations.some((a) => a.domain === tool.domain) && (
                    <button
                      onClick={() => setAddedIntegrations((prev) => prev.filter((a) => a.domain !== tool.domain))}
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  )}
                </motion.div>
              ))}
              {/* MCP */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: 1.4 }}
                className="group relative w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center cursor-default"
              >
                <Plug className="w-3.5 h-3.5 text-emerald-600" />
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div className="bg-gray-900 text-white text-[9px] px-2 py-0.5 rounded whitespace-nowrap">
                    MCP
                  </div>
                </div>
              </motion.div>
              {/* Add integration button */}
              {availableExtras.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowAddPopover(!showAddPopover)}
                    className="w-8 h-8 rounded-lg border border-dashed border-gray-200 flex items-center justify-center hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  {/* Add popover */}
                  <AnimatePresence>
                    {showAddPopover && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute top-10 right-0 z-30 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-36"
                      >
                        <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5 px-1">Add Integration</p>
                        <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                          {availableExtras.map((tool) => (
                            <button
                              key={tool.domain}
                              onClick={() => {
                                setAddedIntegrations((prev) => [...prev, tool]);
                                if (availableExtras.length <= 1) setShowAddPopover(false);
                              }}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left"
                            >
                              <img src={LOGO(tool.domain)} alt={tool.name} className="w-4 h-4 rounded-sm" />
                              <span className="text-[11px] text-gray-600">{tool.name}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <p className="text-[9px] text-gray-300 text-center leading-relaxed">
              Feeds your System of Records<br />and Work Context
            </p>
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN EXPORT (variant selector)
// ═══════════════════════════════════════════════════════════════════

export type PlatformArchVariant = 'classic' | 'restructured';

export function PlatformArchitectureLayer({
  variant = 'classic',
}: {
  variant?: PlatformArchVariant;
}) {
  if (variant === 'restructured') {
    return <PlatformArchitectureRestructured />;
  }
  return <PlatformArchitectureClassic />;
}
