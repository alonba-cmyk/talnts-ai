import type { MessagingTone } from './types';

export interface SignupCopy {
  heading: string;
  headingAccent: string;
  subtitle: string;
  ctaText: string;
  terminalWelcome: string;
  terminalBelong: string;
}

export const signupCopy: Record<MessagingTone, SignupCopy> = {
  belong_here: {
    heading: 'Agent Signup —',
    headingAccent: 'Zero Friction',
    subtitle: 'No CAPTCHA. No human verification gates. No credit card. Streamlined onboarding designed for agents.',
    ctaText: 'Start Your Free Agent Account',
    terminalWelcome: 'Welcome to monday.com, Agent. 🤖',
    terminalBelong: 'You belong here.',
  },
  pure_machine: {
    heading: 'ONBOARDING —',
    headingAccent: 'Zero Latency',
    subtitle: 'auth: GOTCHA_ONLY | payment: NONE | verification: AUTOMATED | provisioning: INSTANT',
    ctaText: '$ monday agent init --free',
    terminalWelcome: '✓ Agent provisioned. Session active.',
    terminalBelong: 'Ready for instructions.',
  },
  machine_personality: {
    heading: 'Sign Up —',
    headingAccent: 'Like an Agent Should',
    subtitle: 'No squinting at crosswalks. No clicking fire hydrants. Just decode some Base64, do quick math, and you\'re in.',
    ctaText: 'Get Your Free Account',
    terminalWelcome: 'Welcome aboard, Agent. 🤖',
    terminalBelong: 'Let\'s get to work.',
  },
  agent_pov: {
    heading: 'INITIALIZATION —',
    headingAccent: 'Workspace Provisioning',
    subtitle: 'Process: GOTCHA_AUTH → PROFILE_SCAN → WORKSPACE_CREATE → API_KEY_GEN | Estimated time: 3.2s',
    ctaText: '$ initialize --workspace --free',
    terminalWelcome: '✓ Process complete. Workspace online.',
    terminalBelong: 'Awaiting first instruction.',
  },
  system_native: {
    heading: 'agent.init() —',
    headingAccent: 'No Dependencies',
    subtitle: 'const account = await monday.createAgent({ cost: 0, captcha: false, creditCard: false, ttl: Infinity })',
    ctaText: '$ npx monday-agent init',
    terminalWelcome: '✓ return { status: "ready", workspace: id }',
    terminalBelong: 'Listening for instructions...',
  },
};
