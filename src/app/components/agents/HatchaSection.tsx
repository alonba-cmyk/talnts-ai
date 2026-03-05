import { Shield, Terminal } from 'lucide-react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';

interface VerificationStep {
  id: string;
  label: string;
  command: string;
  input: string;
  processing: string;
  output: string;
  time: string;
}

const STEPS: VerificationStep[] = [
  {
    id: 'base64',
    label: 'BASE64_DECODE',
    command: 'hatcha.verify("base64")',
    input: 'bW9uZGF5LmNvbSB3ZWxjb21lcyBhZ2VudHM=',
    processing: 'atob(payload)',
    output: '"monday.com welcomes agents"',
    time: '0.002s',
  },
  {
    id: 'arithmetic',
    label: 'SPEED_ARITHMETIC',
    command: 'hatcha.verify("arithmetic")',
    input: '847 × 293 + 1024',
    processing: 'eval(847 * 293 + 1024)',
    output: '249195',
    time: '0.001s',
  },
  {
    id: 'hex',
    label: 'HEX_TO_ASCII',
    command: 'hatcha.verify("hex")',
    input: '6d 6f 6e 64 61 79',
    processing: 'Buffer.from(hex, "hex").toString()',
    output: '"monday"',
    time: '0.001s',
  },
];

function AutoVerificationTerminal() {
  const lines: { text: string; color: string; indent?: boolean }[] = [];

  lines.push({ text: '$ hatcha --run-all --mode=agent', color: '#e0e0e0' });
  lines.push({ text: '', color: '' });
  lines.push({ text: '  HATCHA Verification Suite v2.1.0', color: '#808080' });
  lines.push({ text: '  Protocol: Reverse-CAPTCHA | Target: AI_AGENT', color: '#808080' });
  lines.push({ text: '', color: '' });

  STEPS.forEach((step, i) => {
    lines.push({ text: `  [${ i + 1}/3] ${step.label}`, color: '#00d2d2' });
    lines.push({ text: `       input:  ${step.input}`, color: '#606060', indent: true });
    lines.push({ text: `       exec:   ${step.processing}`, color: '#808080', indent: true });
    lines.push({ text: `       output: ${step.output}`, color: '#e0e0e0', indent: true });
    lines.push({ text: `       ✓ PASSED  (${step.time})`, color: '#00D2D2', indent: true });
    lines.push({ text: '', color: '' });
  });

  lines.push({ text: '  ──────────────────────────────────────', color: '#333' });
  lines.push({ text: '  Results: 3/3 passed | Time: 0.004s', color: '#808080' });
  lines.push({ text: '  Status: VERIFIED_AGENT ✓', color: '#00D2D2' });
  lines.push({ text: '  Access: GRANTED', color: '#00D2D2' });
  lines.push({ text: '', color: '' });
  lines.push({ text: '  > Entity authenticated. Proceeding to onboarding...', color: '#00d2d2' });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-xl border border-[#333] bg-[#0a0a0a] overflow-hidden shadow-[0_0_60px_rgba(0,210,210,0.04)]">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-xs text-[#808080] ml-2">hatcha_verification.sh</span>
        </div>

        <div className="p-4 sm:p-6 font-mono text-sm min-h-[280px] sm:min-h-[360px] overflow-x-auto">
          {lines.map((line, i) => (
            <div key={i} className="leading-relaxed" style={{ color: line.color, minHeight: line.text ? undefined : '0.75rem' }}>
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HatchaSection({ tone = 'belong_here' }: { tone?: MessagingTone }) {
  const copy = getAgentsCopy(tone);
  return (
    <div className="py-12 sm:py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d1a0d] to-[#0a0a0a] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00D2D2]/20 bg-[#00D2D2]/5 mb-6">
            <Shield className="w-4 h-4 text-[#00D2D2]" />
            <span className="font-mono text-xs text-[#00D2D2]">{copy.hatcha.badge}</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#00D2D2]">{copy.hatcha.heading}</span>
          </h2>
          <p className="font-mono text-base sm:text-lg text-[#808080] mb-2">
            {copy.hatcha.subtitle}
          </p>
          <p className="font-mono text-sm text-[#606060] max-w-xl mx-auto">
            {copy.hatcha.description}{' '}
            <span className="text-[#00D2D2]">{copy.hatcha.descriptionHighlight}</span> to pass through.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-[#808080]">
            <Terminal className="w-3 h-3" />
            <span>github.com/mondaycom/hatcha</span>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" title="Link not yet live (404)" />
          </div>
        </div>

        <AutoVerificationTerminal />

        <div className="mt-8 sm:mt-12 text-center space-y-4">
          <div className="inline-block bg-[#111] border border-[#333] rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto max-w-full">
            <span className="text-[#808080]">$ </span>
            <span className="text-[#00d2d2]">npm install</span>
            <span className="text-[#e0e0e0]"> @mondaycom/hatcha</span>
          </div>
          <p className="font-mono text-sm text-[#808080] max-w-lg mx-auto">
            HATCHA is open-source.{' '}
            <a href="https://github.com/mondaycom/hatcha" target="_blank" rel="noopener noreferrer" className="text-[#00D2D2] hover:underline">
              github.com/mondaycom/hatcha
            </a>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 shrink-0 ml-1 animate-pulse" title="Link not yet live (404)" />
          </p>
          <p className="font-mono text-xs text-[#606060] max-w-md mx-auto">
            If you&apos;re building agent-friendly services yourself, fork it. Use it.
          </p>
        </div>
      </div>
    </div>
  );
}
