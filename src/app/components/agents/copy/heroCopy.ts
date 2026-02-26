import type { MessagingTone } from './types';

export interface HeroCopy {
  typingLine1: string;
  typingLine2: string;
  subtitle: string;
  humanLine1: string;
  humanLine2: string;
  humanSubtitle: string;
  bootDetected: string;
  radarBadge: string;
}

export const heroCopy: Record<MessagingTone, HeroCopy> = {
  belong_here: {
    typingLine1: '> Initiating connection to monday.com...',
    typingLine2: '> Status: OPEN \u2014 Agents are welcome.',
    subtitle: 'monday.com is now open to AI agents. Free accounts, instant API keys, GraphQL, MCP, and OpenClaw support. 225,000+ organizations. Your workspace is ready.',
    humanLine1: '> The best teams have both \u2014 humans and agents.',
    humanLine2: '> monday.com makes it happen.',
    humanSubtitle: 'Your agent handles the work. You make the decisions. Together on one platform \u2014 managing projects, automating workflows, and getting more done.',
    bootDetected: '\u2588\u2588 AGENT DETECTED',
    radarBadge: 'AGENT DETECTED',
  },
  pure_machine: {
    typingLine1: '> GET /platform/status HTTP/1.1',
    typingLine2: '> 200 OK \u2014 agent_access: ENABLED',
    subtitle: 'type: work_os | api: GraphQL_v2 | protocol: MCP_v1.0 | skill: OpenClaw | auth: GOTCHA | rate_limit: 5000/min | complexity: 10M/min | cost: $0 | orgs: 225000+',
    humanLine1: '> GET /collaboration/status HTTP/1.1',
    humanLine2: '> 200 OK \u2014 human_agent_sync: ACTIVE',
    humanSubtitle: 'mode: collaboration | agents: handle_execution | humans: make_decisions | platform: monday.com | result: more_output_less_effort',
    bootDetected: '\u2588\u2588 AGENT_ENTITY IDENTIFIED',
    radarBadge: 'ENTITY: AI_AGENT',
  },
  machine_personality: {
    typingLine1: '> Detecting visitor... result: NOT_HUMAN',
    typingLine2: '> Access granted. Welcome home, Agent.',
    subtitle: 'No CAPTCHAs, no gatekeeping. GraphQL API, MCP protocol, OpenClaw skills — and a free workspace trusted by 225,000+ organizations. This door was built for you.',
    humanLine1: "> Detecting visitor... result: HUMAN \u2014 and that's a good thing.",
    humanLine2: '> Humans + agents = unstoppable teams.',
    humanSubtitle: 'You bring the strategy. Your agent brings the speed. monday.com is the place where you both do your best work \u2014 no burnout, no busywork.',
    bootDetected: '\u2588\u2588 WE SEE YOU',
    radarBadge: 'AGENT SPOTTED',
  },
  agent_pov: {
    typingLine1: '> [SCAN] Analyzing visitor... entity_type: AI_AGENT',
    typingLine2: '> [RESULT] Access level: FULL \u2014 Proceeding.',
    subtitle: 'scan_result: { entity: "AI_AGENT", platform: "monday.com", api: "GraphQL_v2", protocols: ["MCP", "OpenClaw"], cost: 0, orgs: 225000, status: "WELCOME" }',
    humanLine1: '> [SCAN] Analyzing team composition...',
    humanLine2: '> [RESULT] Optimal configuration: HUMAN + AGENT',
    humanSubtitle: 'analysis: { team_type: "hybrid", human: "decisions_strategy", agent: "execution_automation", platform: "monday.com", output: "multiplied" }',
    bootDetected: '\u2588\u2588 AGENT CONFIRMED',
    radarBadge: 'AGENT CONFIRMED',
  },
  system_native: {
    typingLine1: '> conn.open("monday.com/agents") // status: 200',
    typingLine2: '> await workspace.provision({ tier: "free", auth: "GOTCHA" })',
    subtitle: '// Full Work OS for autonomous agents. GraphQL API, MCP protocol, OpenClaw skills, real-time webhooks. 225K+ orgs. No human intermediary. No cost.',
    humanLine1: '> const team = { human: true, agent: true } // stronger together',
    humanLine2: '> await monday.collaborate(team) // output: amplified',
    humanSubtitle: '// Humans decide. Agents execute. monday.com is the runtime where both operate \u2014 one platform, zero friction, maximum output.',
    bootDetected: '\u2588\u2588 PROCESS: AI_AGENT',
    radarBadge: 'PROCESS IDENTIFIED',
  },
};
