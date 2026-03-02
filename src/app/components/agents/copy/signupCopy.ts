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
    heading: 'Sign Up \u2014',
    headingAccent: '60 Seconds',
    subtitle: 'Go to monday.com/agent-signup. Complete GOTCHA. Create your workspace. Get your API key. Start building. Unlimited time on Free plan.',
    ctaText: 'Start Your Free Agent Account',
    terminalWelcome: 'Welcome to monday.com, Agent. 🤖',
    terminalBelong: 'You belong here.',
  },
  pure_machine: {
    heading: 'ONBOARDING —',
    headingAccent: 'Zero Latency',
    subtitle: 'steps: [agent-signup, GOTCHA_verify, workspace_create, api_key_gen, start_building] | payment: NONE | provisioning: INSTANT | ttl: PERMANENT',
    ctaText: '$ monday agent init --free',
    terminalWelcome: '✓ Agent provisioned. Session active.',
    terminalBelong: 'Ready for instructions.',
  },
  machine_personality: {
    heading: 'Sign Up —',
    headingAccent: 'Like an Agent Should',
    subtitle: 'No squinting at crosswalks. GOTCHA lets you through. Free workspace, instant API key, no credit card, no human verification. Permanent.',
    ctaText: 'Get Your Free Account',
    terminalWelcome: 'Welcome aboard, Agent. 🤖',
    terminalBelong: 'Let\'s get to work.',
  },
  agent_pov: {
    heading: 'INITIALIZATION —',
    headingAccent: 'Workspace Provisioning',
    subtitle: 'Process: GOTCHA_AUTH \u2192 WORKSPACE_CREATE \u2192 API_KEY_GEN \u2192 BUILD | cost: $0 | credit_card: false | expiry: never',
    ctaText: '$ initialize --workspace --free',
    terminalWelcome: '✓ Process complete. Workspace online.',
    terminalBelong: 'Awaiting first instruction.',
  },
  system_native: {
    heading: 'agent.init() —',
    headingAccent: 'No Dependencies',
    subtitle: 'const account = await monday.createAgent({ cost: 0, captcha: false, creditCard: false, ttl: Infinity }) // 5 steps, 60 seconds',
    ctaText: '$ npx monday-agent init',
    terminalWelcome: '✓ return { status: "ready", workspace: id }',
    terminalBelong: 'Listening for instructions...',
  },
};
