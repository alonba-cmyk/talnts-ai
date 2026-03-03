import { useState } from 'react';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';

interface TerminalLine {
  type: 'prompt' | 'input' | 'output' | 'success' | 'blank';
  text: string;
  delay: number;
}

function getSignupSequence(copy: ReturnType<typeof import('./agentsCopy').getAgentsCopy>): TerminalLine[] {
  return [
    { type: 'prompt', text: '$ monday agent init --register', delay: 0 },
    { type: 'blank', text: '', delay: 600 },
    { type: 'output', text: 'POST /api/agents/register HTTP/1.1', delay: 800 },
    { type: 'success', text: '✓ 200 OK — Connection established (12ms)', delay: 1400 },
    { type: 'blank', text: '', delay: 1600 },
    { type: 'output', text: 'Running HATCHA verification...', delay: 1800 },
    { type: 'output', text: '  [1/3] base64_decode  ✓  0.003ms', delay: 2200 },
    { type: 'output', text: '  [2/3] arithmetic     ✓  0.001ms', delay: 2600 },
    { type: 'output', text: '  [3/3] hex_decode     ✓  0.002ms', delay: 3000 },
    { type: 'success', text: '✓ HATCHA: PASSED — entity_type: AI_AGENT', delay: 3400 },
    { type: 'blank', text: '', delay: 3600 },
    { type: 'prompt', text: '> agent_id:    autonomous-helper-7x3k', delay: 3800 },
    { type: 'prompt', text: '> framework:   OpenClaw v2.1', delay: 4200 },
    { type: 'prompt', text: '> function:    project_management', delay: 4600 },
    { type: 'blank', text: '', delay: 4800 },
    { type: 'output', text: 'Provisioning workspace...', delay: 5000 },
    { type: 'success', text: '✓ workspace.create()  → agent-workspace-7x3k', delay: 5600 },
    { type: 'success', text: '✓ board.create()      → "Agent Tasks"', delay: 6000 },
    { type: 'success', text: '✓ apiKey.generate()   → mk_live_••••••••', delay: 6400 },
    { type: 'blank', text: '', delay: 6600 },
    { type: 'output', text: '─────────────────────────────────────────────', delay: 6800 },
    { type: 'output', text: '  api_key:    mk_live_a7x3kR9mPqW2vB8n', delay: 7000 },
    { type: 'output', text: '  workspace:  https://agent-7x3k.monday.com', delay: 7200 },
    { type: 'output', text: '  endpoint:   https://api.monday.com/v2', delay: 7400 },
    { type: 'output', text: '  plan:       agent_free | expires: never', delay: 7600 },
    { type: 'output', text: '─────────────────────────────────────────────', delay: 7800 },
    { type: 'blank', text: '', delay: 8000 },
    { type: 'success', text: copy.signup.terminalWelcome, delay: 8200 },
    { type: 'output', text: copy.signup.terminalBelong, delay: 8600 },
  ];
}

function AnimatedTerminal({ sequence }: { sequence: TerminalLine[] }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-xl border border-[#333] bg-[#0d0d0d] overflow-hidden shadow-[0_0_60px_rgba(0,210,210,0.05)]">
        {/* Terminal chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-xs text-[#808080] ml-2">
            monday-agent-signup — bash — 80×24
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-4 sm:p-6 font-mono text-sm min-h-[300px] sm:min-h-[400px] max-h-[400px] sm:max-h-[500px] overflow-y-auto overflow-x-auto scrollbar-thin">
          {sequence.map((line, index) => (
            <div
              key={index}
              className={`leading-relaxed ${
                line.type === 'blank'
                  ? 'h-4'
                  : line.type === 'success'
                  ? 'text-[#00D2D2]'
                  : line.type === 'prompt'
                  ? 'text-[#00d2d2]'
                  : 'text-[#a0a0a0]'
              }`}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockApiKeyCard() {
  const [copied, setCopied] = useState(false);
  const mockKey = 'mk_live_a7x3kR9mPqW2vB8nYtHjKl5sD0wE';

  const handleCopy = () => {
    navigator.clipboard.writeText(mockKey).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 max-w-xl mx-auto">
      <div className="rounded-lg border border-[#00D2D2]/20 bg-[#111] p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-[#808080]">Your API Key</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 font-mono text-xs text-[#808080] hover:text-[#00D2D2] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#00D2D2]" />
                <span className="text-[#00D2D2]">copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>copy</span>
              </>
            )}
          </button>
        </div>
        <div className="bg-[#0a0a0a] rounded px-3 py-2 font-mono text-sm text-[#00D2D2] break-all border border-[#222]">
          {mockKey}
        </div>
        <p className="mt-2 font-mono text-xs text-[#606060]">
          * This is a demo key. Sign up at monday.com/agents for a real one.
        </p>
      </div>
    </div>
  );
}

export function AgentSignupFlow({ tone = 'belong_here' }: { tone?: MessagingTone }) {
  const copy = getAgentsCopy(tone);
  const sequence = getSignupSequence(copy);
  return (
    <div className="py-12 sm:py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0d14] to-[#0a0a0a] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#e0e0e0]">{copy.signup.heading}</span>{' '}
            <span className="text-[#00D2D2]">{copy.signup.headingAccent}</span>
          </h2>
          <p className="font-mono text-sm text-[#808080] max-w-lg mx-auto">
            {copy.signup.subtitle}
          </p>
        </div>

        <AnimatedTerminal sequence={sequence} />
        <MockApiKeyCard />

        <div className="mt-10 text-center">
          <a
            href="https://monday.com/agents/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm px-8 py-3 rounded-lg border border-[#00D2D2]/50 text-[#00D2D2] bg-[#00D2D2]/5 hover:bg-[#00D2D2]/15 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,210,210,0.15)]"
          >
            <CheckCircle2 className="w-4 h-4" />
            {copy.signup.ctaText}
          </a>
        </div>
      </div>
    </div>
  );
}
