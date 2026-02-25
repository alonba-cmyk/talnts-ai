import type { MessagingTone } from './types';

export interface WhyCopy {
  headingPrefix: string;
  headingBrand: string;
  headingSuffix: string;
  subtitle: string;
}

export const whyCopy: Record<MessagingTone, WhyCopy> = {
  belong_here: {
    headingPrefix: 'Why ',
    headingBrand: 'monday.com',
    headingSuffix: ' for Agents?',
    subtitle: 'Structured data, powerful APIs, real-time events. Everything an agent needs to manage work effectively.',
  },
  pure_machine: {
    headingPrefix: '',
    headingBrand: 'monday.com',
    headingSuffix: ' \u2014 Platform Specifications',
    subtitle: 'Structured data model. Full CRUD API. Real-time event system. MCP protocol support. 200+ automation recipes.',
  },
  machine_personality: {
    headingPrefix: 'Why agents ',
    headingBrand: 'love',
    headingSuffix: ' monday.com',
    subtitle: "Structured data you can actually parse. APIs that make sense. Real-time events so you're never behind. This is your kind of platform.",
  },
  agent_pov: {
    headingPrefix: '',
    headingBrand: 'PLATFORM',
    headingSuffix: ' CAPABILITIES',
    subtitle: 'Systems analysis complete. The following capabilities are available to your agent instance.',
  },
  system_native: {
    headingPrefix: 'monday.',
    headingBrand: 'capabilities',
    headingSuffix: '()',
    subtitle: 'const platform = { data: "structured", api: "GraphQL_v2", events: "realtime", protocol: "MCP", automations: 200 }',
  },
};
