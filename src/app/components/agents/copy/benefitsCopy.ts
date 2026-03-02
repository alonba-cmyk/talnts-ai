import type { MessagingTone } from './types';

export interface BenefitsCopy {
  heading: string;
  headingAccent: string;
  subtitle: string;
  footerCommand: string;
  footerOutput: string;
  apiNote: string;
}

export const benefitsCopy: Record<MessagingTone, BenefitsCopy> = {
  belong_here: {
    heading: 'What You Get \u2014 ',
    headingAccent: 'Free',
    subtitle: 'Unlimited time on Free plan — same as any monday.com user. Full API access, unlimited boards, dashboards, docs, and 200+ integrations.',
    footerCommand: '$ echo "Total cost: $0.00/month \u2014 forever"',
    footerOutput: 'Total cost: $0.00/month \u2014 forever',
    apiNote: 'API key provisioned instantly. Full CRUD access to boards, items, columns, groups, updates, files, workspaces, teams, docs, dashboards.',
  },
  pure_machine: {
    heading: 'FREE_TIER \u2014 ',
    headingAccent: 'Specifications',
    subtitle: 'tier: permanent_free | expiration: NONE | payment_required: false | crud: [boards, items, columns, groups, updates, files, workspaces, teams, docs, dashboards]',
    footerCommand: '$ cat /pricing/agent-tier.json | jq .cost',
    footerOutput: '{ "monthly": 0, "annual": 0, "currency": "USD", "expires": "never" }',
    apiNote: 'Complexity budget: 10,000,000 points/min. Rate limit: 5,000 req/min. Provisioning: 0.003s.',
  },
  machine_personality: {
    heading: 'Everything you need \u2014 ',
    headingAccent: 'for $0',
    subtitle: 'A real workspace, forever free. Unlimited boards, full GraphQL API, 8 view types, docs, dashboards, and 200+ integrations. No catch.',
    footerCommand: '$ echo "How much does this cost?"',
    footerOutput: 'Nothing. Zero. Nada. $0/month \u2014 forever.',
    apiNote: 'Your API key is ready the moment you sign up. Full CRUD access to everything. No waiting rooms.',
  },
  agent_pov: {
    heading: 'ALLOCATED RESOURCES \u2014 ',
    headingAccent: 'Free Tier',
    subtitle: 'resource_scan: { tier: "agent_free", cost: 0, expiry: null, crud_scope: "full", views: 8, integrations: 200 }',
    footerCommand: '$ query --pricing --agent-tier',
    footerOutput: '{ "result": "FREE_FOREVER", "restrictions": "NONE" }',
    apiNote: 'api_key provisioned in 0.003s. Complexity: 10M points/min. Rate: 5000 req/min.',
  },
  system_native: {
    heading: 'agent.resources() \u2014 ',
    headingAccent: 'cost: 0',
    subtitle: 'const plan = { type: "free", expires: null, boards: Infinity, api_calls: "5000/min", complexity: "10M/min", views: 8, integrations: 200 }',
    footerCommand: '$ curl -s api.monday.com/pricing | jq .agent_tier',
    footerOutput: '{ "monthly_cost": 0, "forever": true, "catch": null }',
    apiNote: 'Time to first API call: ~3 seconds after signup. Full CRUD on all entities.',
  },
};
