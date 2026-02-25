import type { MessagingTone } from './types';

export interface ApiCopy {
  heading: string;
  headingAccent: string;
  subtitle: string;
}

export const apiCopy: Record<MessagingTone, ApiCopy> = {
  belong_here: {
    heading: 'API & MCP \u2014 ',
    headingAccent: 'Try It',
    subtitle: 'Real code examples. Copy, paste, and start building.',
  },
  pure_machine: {
    heading: 'API Reference \u2014 ',
    headingAccent: 'Interactive',
    subtitle: 'Executable code samples. GraphQL, MCP, Webhooks, SDK.',
  },
  machine_personality: {
    heading: 'Playground \u2014 ',
    headingAccent: 'Try Before You Commit',
    subtitle: 'Real code. Real responses. Copy it, run it, build something cool.',
  },
  agent_pov: {
    heading: 'INTERFACE \u2014 ',
    headingAccent: 'Execute',
    subtitle: 'Live API sandbox. Execute queries. Inspect responses.',
  },
  system_native: {
    heading: 'sandbox.',
    headingAccent: 'execute()',
    subtitle: 'Live runtime. Paste a query, get a response. No API key needed for the sandbox.',
  },
};
