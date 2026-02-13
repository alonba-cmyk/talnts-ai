import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import {
  Database,
  Shield,
  Brain,
  Globe,
  Plug,
  ArrowRight,
  Layers,
  Lock,
} from 'lucide-react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';

// Integration tool icons
const integrationTools = [
  { name: 'Slack', domain: 'slack.com' },
  { name: 'Salesforce', domain: 'salesforce.com' },
  { name: 'Jira', domain: 'atlassian.com' },
  { name: 'Google', domain: 'google.com' },
  { name: 'GitHub', domain: 'github.com' },
  { name: 'Zoom', domain: 'zoom.us' },
  { name: 'HubSpot', domain: 'hubspot.com' },
  { name: 'Figma', domain: 'figma.com' },
];

const LOGO = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export function PlatformArchitectureLayer() {
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

            {/* Integration icons floating around outer ring */}
            <div className="flex flex-wrap justify-center gap-3 mb-6 pt-4">
              {integrationTools.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.06 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
                >
                  <img
                    src={LOGO(tool.domain)}
                    alt={tool.name}
                    className="w-4 h-4 rounded-sm"
                  />
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
              {/* Context Label */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-[#6161ff]/20">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#6161ff]" />
                  <span className="text-sm font-semibold text-[#6161ff]">Context</span>
                </div>
              </div>

              {/* Context description + feeds */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-2">
                <div className="text-center md:text-left">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Understands your work
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Sits on your data and deeply understands your business context,
                    workflows, and relationships
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
                        <img
                          src={item.logo}
                          alt={item.label}
                          className="w-8 h-8 object-contain"
                        />
                        <span className="text-[10px] text-gray-500 font-medium">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Accurate & Relevant
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Delivers precise, high-quality results tailored to your
                    specific jobs to be done
                  </p>
                </div>
              </div>

              {/* Animated flow arrows */}
              <div className="flex justify-center gap-2 mb-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <ArrowRight className="w-4 h-4 text-[#6161ff]/30 rotate-[-90deg]" />
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
                {/* System of Records Label */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-gray-700" />
                    <span className="text-sm font-semibold text-gray-700">
                      System of Records
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <Layers className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Your Organization Data
                      </p>
                      <p className="text-xs text-gray-500">
                        CRM, projects, tasks, communications, docs
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-10 bg-gray-200" />

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Enterprise Grade Secure
                      </p>
                      <p className="text-xs text-gray-500">
                        SOC 2, GDPR, HIPAA compliant
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-10 bg-gray-200" />

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Permission Aware
                      </p>
                      <p className="text-xs text-gray-500">
                        AI respects your data access policies
                      </p>
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
