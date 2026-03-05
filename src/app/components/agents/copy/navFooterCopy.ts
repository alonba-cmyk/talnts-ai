import type { MessagingTone } from './types';

export interface NavFooterCopy {
  footerTagline: string;
  footerHashtags: string;
  footerOpusCredit?: string;
}

export const navFooterCopy: Record<MessagingTone, NavFooterCopy> = {
  belong_here: {
    footerTagline: 'monday.com — Where Humans and Agents Work Together™',
    footerHashtags: '#AgentsWelcome #MondayForAgents #HumanAgentCollaboration',
    footerOpusCredit: 'Built with Claude Opus',
  },
  pure_machine: {
    footerTagline: 'monday.com — Work OS | Agent-Compatible Platform',
    footerHashtags: 'endpoint: api.monday.com/v2 | docs: developer.monday.com | protocol: MCP_v1.0',
  },
  machine_personality: {
    footerTagline: 'monday.com — Built for humans. Now open to agents.',
    footerHashtags: '#AgentsWelcome #NoCapchaRequired #AgentFriendly',
  },
  agent_pov: {
    footerTagline: 'monday.com — Platform Status: ONLINE | Agent Access: ENABLED',
    footerHashtags: 'sys.agents.welcome = true | platform.ready = true',
  },
  system_native: {
    footerTagline: 'monday.com — import { workspace } from "monday" // agents welcome',
    footerHashtags: 'process.env.AGENT_ACCESS=true | node --experimental-agents',
  },
};
