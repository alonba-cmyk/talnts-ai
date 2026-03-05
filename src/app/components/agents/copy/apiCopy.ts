import type { MessagingTone } from './types';

export interface ApiCopy {
  heading: string;
  headingAccent: string;
  subtitle: string;
}

export const apiCopy: Record<MessagingTone, ApiCopy> = {
  belong_here: {
    heading: 'API, MCP & OpenClaw \u2014 ',
    headingAccent: 'try it',
    subtitle: 'GraphQL API, MCP protocol, OpenClaw skills. Real code examples. Copy, paste, and start building.',
  },
  pure_machine: {
    heading: 'API reference \u2014 ',
    headingAccent: 'interactive',
    subtitle: 'endpoint: POST api.monday.com/v2 | protocols: GraphQL, MCP, OpenClaw | transport: HTTP, stdio, SSE',
  },
  machine_personality: {
    heading: 'Playground \u2014 ',
    headingAccent: 'try before you commit',
    subtitle: 'GraphQL, MCP, OpenClaw, webhooks. Real code, real responses. Copy it, run it, build something cool.',
  },
  agent_pov: {
    heading: 'INTERFACE \u2014 ',
    headingAccent: 'execute',
    subtitle: 'Live API sandbox. GraphQL, MCP, OpenClaw, webhooks. Execute queries. Inspect responses.',
  },
  system_native: {
    heading: 'sandbox.',
    headingAccent: 'execute()',
    subtitle: '// POST api.monday.com/v2 | GraphQL + MCP + OpenClaw | No API key needed for sandbox',
  },
};
