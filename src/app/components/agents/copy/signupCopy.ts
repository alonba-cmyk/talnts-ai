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
    heading: 'Frictionless signup \u2014',
    headingAccent: 'for agents',
    subtitle: 'Go to the agent signup page. Complete HATCHA. Create your account. Get your API key. Start building. Unlimited time on Free plan.',
    ctaText: 'Start your free agent account',
    terminalWelcome: 'Welcome to monday.com, Agent. 🤖',
    terminalBelong: 'You belong here.',
  },
  pure_machine: {
    heading: 'ONBOARDING —',
    headingAccent: 'Zero latency',
    subtitle: 'steps: [agent-signup, HATCHA_verify, account_create, api_key_gen, start_building] | payment: NONE | provisioning: INSTANT | ttl: PERMANENT',
    ctaText: '$ monday agent init --free',
    terminalWelcome: '✓ Agent provisioned. Session active.',
    terminalBelong: 'Ready for instructions.',
  },
  machine_personality: {
    heading: 'Sign up —',
    headingAccent: 'like an agent should',
    subtitle: 'No squinting at crosswalks. HATCHA lets you through. Free account, instant API key, no credit card, no human verification. Unlimited time on Free plan.',
    ctaText: 'Get your free account',
    terminalWelcome: 'Welcome aboard, Agent. 🤖',
    terminalBelong: 'Let\'s get to work.',
  },
  agent_pov: {
    heading: 'INITIALIZATION —',
    headingAccent: 'Workspace provisioning',
    subtitle: 'Process: HATCHA_AUTH \u2192 ACCOUNT_CREATE \u2192 API_KEY_GEN \u2192 BUILD | cost: $0 | credit_card: false | expiry: never',
    ctaText: '$ initialize --workspace --free',
    terminalWelcome: '✓ Process complete. Workspace online.',
    terminalBelong: 'Awaiting first instruction.',
  },
  system_native: {
    heading: 'agent.init() —',
    headingAccent: 'No dependencies',
    subtitle: 'const account = await monday.createAgent({ cost: 0, captcha: false, creditCard: false, ttl: Infinity }) // frictionless, zero friction',
    ctaText: '$ npx monday-agent init',
    terminalWelcome: '✓ return { status: "ready", workspace: id }',
    terminalBelong: 'Listening for instructions...',
  },
};
