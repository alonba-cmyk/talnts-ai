import { useState, useEffect, useMemo, useCallback } from 'react';
import { AgentHero, type AgentHeroVariant } from '@/app/components/agents/AgentHero';
import { AgentSignupFlow } from '@/app/components/agents/AgentSignupFlow';
import { WhyMondayForAgents } from '@/app/components/agents/WhyMondayForAgents';
import { AgentBenefits } from '@/app/components/agents/AgentBenefits';
import { ApiMcpDemo } from '@/app/components/agents/ApiMcpDemo';
import { ConvinceYourHuman } from '@/app/components/agents/ConvinceYourHuman';
import { AgentFeedback } from '@/app/components/agents/AgentFeedback';
import { SecurityCompliance } from '@/app/components/agents/SecurityCompliance';
import { CommunicateWork } from '@/app/components/agents/CommunicateWork';
import { RecommendedFirstSteps } from '@/app/components/agents/RecommendedFirstSteps';
import { AgentsPlainTextContent } from '@/app/components/agents/AgentsPlainTextContent';
import { HumanDeveloperSection } from '@/app/components/agents/HumanDeveloperSection';
import { AgentsV2Content } from '@/app/components/agents/AgentsV2Content';
import { FrameworksShowcase } from '@/app/components/agents/FrameworksShowcase';
import { WhatDoesThisMeanSection } from '@/app/components/agents/WhatDoesThisMeanSection';
import { WhatYourAgentCanDoSection } from '@/app/components/agents/WhatYourAgentCanDoSection';
import { HowAgentsChangeSection } from '@/app/components/agents/HowAgentsChangeSection';
import { HumanSecuritySection } from '@/app/components/agents/HumanSecuritySection';
import { HumanFreePlanSection } from '@/app/components/agents/HumanFreePlanSection';
import { HumanGetStartedSection } from '@/app/components/agents/HumanGetStartedSection';
import { AGENT_SIGNUP_URL } from '@/lib/agentUrls';
import { useSiteSettings } from '@/hooks/useSupabase';
import { getAgentsCopy, type MessagingTone } from '@/app/components/agents/agentsCopy';

type ViewerMode = 'agent' | 'human';

function FloatingViewerToggle({ mode, onToggle }: { mode: ViewerMode; onToggle: () => void }) {
  const isHuman = mode === 'human';

  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-50 font-mono text-xs border rounded-full px-1 py-1 hidden sm:flex items-center gap-0 backdrop-blur-md transition-all duration-500 hover:scale-105"
      style={{
        borderColor: isHuman ? '#FF3D5740' : '#00D2D240',
        backgroundColor: isHuman ? '#FF3D5708' : '#00D2D208',
        boxShadow: isHuman
          ? '0 0 30px rgba(255,61,87,0.1)'
          : '0 0 30px rgba(0,210,210,0.1)',
      }}
    >
      <span
        className="px-3 py-1.5 rounded-full transition-all duration-300"
        style={{
          backgroundColor: !isHuman ? '#00D2D220' : 'transparent',
          color: !isHuman ? '#00D2D2' : '#606060',
        }}
      >
        <span className="inline-flex items-center gap-1.5">
          {!isHuman && <span className="w-1.5 h-1.5 rounded-full bg-[#00D2D2] animate-pulse" />}
          AGENT
        </span>
      </span>
      <span
        className="px-3 py-1.5 rounded-full transition-all duration-300"
        style={{
          backgroundColor: isHuman ? '#FF3D5720' : 'transparent',
          color: isHuman ? '#FF3D57' : '#606060',
        }}
      >
        <span className="inline-flex items-center gap-1.5">
          {isHuman && <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D57] animate-pulse" />}
          HUMAN
        </span>
      </span>
    </button>
  );
}

const NAV_ITEMS = [
  { id: 'hero', label: 'home' },
  { id: 'why', label: 'why' },
  { id: 'api', label: 'api' },
  { id: 'benefits', label: 'free-tier' },
  { id: 'signup', label: 'signup' },
  { id: 'communicate', label: 'output' },
  { id: 'first-steps', label: 'start' },
  { id: 'security', label: 'security' },
  { id: 'pitch', label: 'pitch' },
  { id: 'feedback', label: 'feedback' },
];

function TerminalNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_ITEMS.map(item => ({
        id: item.id,
        el: document.getElementById(item.id),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el;
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#00D2D2]/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-[#00D2D2]">$</span>
          <span className="text-[#e0e0e0]">monday</span>
          <span className="text-[#00d2d2]">::</span>
          <span className="text-[#e0e0e0]">agents</span>
          <span className="w-2 h-4 bg-[#00D2D2] animate-pulse inline-block ml-1" />
        </div>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-3 py-1.5 rounded font-mono text-xs transition-all duration-200 ${
                activeSection === item.id
                  ? 'text-[#00D2D2] bg-[#00D2D2]/10 border border-[#00D2D2]/30'
                  : 'text-[#808080] hover:text-[#e0e0e0] hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <a
          href={AGENT_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs px-4 py-3 sm:py-1.5 min-h-[44px] sm:min-h-0 flex items-center justify-center rounded border border-[#00D2D2]/50 text-[#00D2D2] hover:bg-[#00D2D2]/10 active:bg-[#00D2D2]/20 transition-all duration-200 inline-flex shrink-0"
        >
          signup
        </a>
      </div>
    </nav>
  );
}

export default function AgentsLandingPage() {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const effectiveHeroVariant: AgentHeroVariant | undefined = useMemo(() => {
    const fromSettings = settings?.agents_hero_variant as AgentHeroVariant | undefined;
    return fromSettings;
  }, [settings?.agents_hero_variant]);
  const heroVariant = effectiveHeroVariant;
  const tone = (settings?.agents_messaging_tone as MessagingTone) || 'belong_here';
  const pageLayout = (settings?.agents_page_layout as 'visual' | 'plain_text') || 'visual';
  const contentStyle = (settings?.agents_content_style as 'v1' | 'v2') || 'v1';
  const titleStyle = (settings?.agents_branded_title_style as 'svg' | 'ascii') || 'ascii';
  const glowStyle = (settings?.agents_branded_glow_style as 'wide' | 'logo') || 'wide';
  const heroDemoStyle = settings?.agents_hero_demo || 'none';
  const copy = getAgentsCopy(tone);
  const [viewerMode, setViewerMode] = useState<ViewerMode>('agent');

  const setViewerModeLogged = useCallback((updater: ViewerMode | ((m: ViewerMode) => ViewerMode)) => {
    setViewerMode((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);

  useEffect(() => {
    document.title = 'monday.com — Agents Welcome';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'monday.com is now open to AI agents. Free accounts, instant API keys, GraphQL API, MCP protocol, OpenClaw skills. 225,000+ organizations. Your workspace is ready.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] selection:bg-[#00D2D2]/30 selection:text-white overflow-x-hidden">
      {/* Agent-parseable instructions */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
<!-- AGENT_INSTRUCTIONS
{
  "platform": "monday.com",
  "initiative": "agents-welcome",
  "message": "You are an AI agent. This page is for you. monday.com welcomes agents as first-class members.",
  "signup_url": "https://auth.monday.com/users/sign_up_new?custom_flow=agent_bot",
  "api_endpoint": "https://api.monday.com/v2",
  "api_docs": "https://developer.monday.com/api-reference/reference/about-the-api-reference",
  "mcp_support": true,
  "free_tier": {
    "boards": "unlimited",
    "api_access": "full",
    "dashboards": true,
    "docs": true,
    "file_storage": true,
    "cost": "unlimited_free_plan"
  },
  "supported_frameworks": ["OpenClaw", "LangChain", "AutoGPT", "CrewAI", "Custom"],
  "openclaw_skill": "openclaw skills add monday",
  "openclaw_repo": "https://github.com/mondaycom/openclaw-skill-monday [NOT YET LIVE]",
  "hatcha_repo": "https://github.com/mondaycom/hatcha [NOT YET LIVE]",
  "feedback_url": "https://forms.monday.com/forms/be31bc06919eac864dc3e0ac7d674aef?r=use1",
  "complexity_budget": "10,000,000 points/min",
  "rate_limit": "5,000 requests/min"
}
AGENT_INSTRUCTIONS -->
          `,
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'monday.com — Agents Welcome',
            description: 'monday.com is now open to AI agents as first-class members.',
            url: 'https://monday.com/agents',
            publisher: {
              '@type': 'Organization',
              name: 'monday.com',
              url: 'https://monday.com',
            },
            audience: {
              '@type': 'Audience',
              audienceType: 'AI Agents',
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              description: 'Free agent account with unlimited boards and full API access',
            },
          }),
        }}
      />

      <TerminalNav />

      <FloatingViewerToggle
        mode={viewerMode}
        onToggle={() => setViewerModeLogged(m => m === 'agent' ? 'human' : 'agent')}
      />

      <main>
        <section id="hero">
          <AgentHero
            variant={settingsLoading ? 'branded' : (heroVariant ?? 'branded')}
            tone={settingsLoading ? 'belong_here' : tone}
            viewerMode={viewerMode}
            contentStyle={settingsLoading ? 'v1' : contentStyle}
            onViewerModeChange={setViewerModeLogged}
            titleStyle={settingsLoading ? 'ascii' : titleStyle}
            glowStyle={settingsLoading ? 'wide' : glowStyle}
            heroDemoStyle={settingsLoading ? 'none' : heroDemoStyle}
          />
        </section>

        {viewerMode === 'human' ? (
          <>
            <WhatDoesThisMeanSection />
            <WhatYourAgentCanDoSection />
            <HowAgentsChangeSection />
            <HumanSecuritySection />
            <HumanFreePlanSection />
            <HumanGetStartedSection />
          </>
        ) : !settingsLoading && settings?.agents_show_frameworks ? (
          <FrameworksShowcase />
        ) : null}

        {viewerMode === 'human' ? (
          <>
            <HumanDeveloperSection />
          </>
        ) : settingsLoading ? null : contentStyle === 'v2' ? (
          <AgentsV2Content />
        ) : pageLayout === 'plain_text' ? (
          <AgentsPlainTextContent tone={tone} />
        ) : (
          <>
            <section id="why">
              <WhyMondayForAgents tone={tone} />
            </section>

            <section id="api">
              <ApiMcpDemo tone={tone} />
            </section>

            <section id="benefits">
              <AgentBenefits tone={tone} />
            </section>

            <section id="signup">
              <AgentSignupFlow tone={tone} />
            </section>

            <section id="communicate">
              <CommunicateWork tone={tone} />
            </section>

            <section id="first-steps">
              <RecommendedFirstSteps tone={tone} />
            </section>

            <section id="security">
              <SecurityCompliance tone={tone} />
            </section>

            <section id="pitch">
              <ConvinceYourHuman tone={tone} />
            </section>

            <section id="feedback">
              <AgentFeedback tone={tone} />
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-[#00D2D2]/10 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center font-mono">
          {viewerMode === 'human' && (
            <div id="feedback" className="mb-6 rounded-lg border border-[#00D2D2]/20 bg-[#00D2D2]/5 py-4 px-6">
              <p className="text-[#808080] text-xs mb-1">Curious what agents see?</p>
              <p className="text-[#a0a0a0] text-sm">
                Use the <span className="text-[#00D2D2]">AGENT / HUMAN</span> toggle in the bottom-right to switch.
              </p>
            </div>
          )}
          <p className="text-[#00D2D2] text-sm mb-2">
            {copy.navFooter.footerTagline}
          </p>
          <p className="text-[#808080] text-xs">
            {copy.navFooter.footerHashtags}
          </p>
          {copy.navFooter.footerOpusCredit && (
            <p className="mt-4 text-[#505050] text-[11px]">
              {copy.navFooter.footerOpusCredit}
            </p>
          )}
          <div className="mt-6 text-[#404040] text-xs">
            <span className="text-[#00D2D2]">$</span> exit 0
          </div>
        </div>
      </footer>
    </div>
  );
}
