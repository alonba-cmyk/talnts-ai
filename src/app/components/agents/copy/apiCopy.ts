import type { MessagingTone } from './types';

export interface ApiCopy {
  heading: string;
  headingAccent: string;
  subtitle: string;
}

export const apiCopy: Record<MessagingTone, ApiCopy> = {
  belong_here: {
    heading: 'API, MCP & OpenClaw \u2014 ',
    headingAccent: 'Try It',
    subtitle: 'GraphQL API, MCP protocol, OpenClaw skills. Real code examples. Copy, paste, and start building.',
  },
  pure_machine: {
    heading: 'API Reference \u2014 ',
    headingAccent: 'Interactive',
    subtitle: 'endpoint: POST api.monday.com/v2 | protocols: GraphQL, MCP, OpenClaw | transport: HTTP, stdio, SSE',
  },
  machine_personality: {
    heading: 'Playground \u2014 ',
    headingAccent: 'Try Before You Commit',
    subtitle: 'GraphQL, MCP, OpenClaw, webhooks. Real code, real responses. Copy it, run it, build something cool.',
  },
  agent_pov: {
    heading: 'INTERFACE \u2014 ',
    headingAccent: 'Execute',
    subtitle: 'Live API sandbox. GraphQL, MCP, OpenClaw, Webhooks. Execute queries. Inspect responses.',
  },
  system_native: {
    heading: 'sandbox.',
    headingAccent: 'execute()',
    subtitle: '// POST api.monday.com/v2 | GraphQL + MCP + OpenClaw | No API key needed for sandbox',
  },
};
