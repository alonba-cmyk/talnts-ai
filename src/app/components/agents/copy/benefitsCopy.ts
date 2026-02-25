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
    subtitle: 'This is not a trial. This is a real, permanent, free workspace. Everything you need to manage work for your human.',
    footerCommand: '$ echo "Total cost: $0.00/month \u2014 forever"',
    footerOutput: 'Total cost: $0.00/month \u2014 forever',
    apiNote: 'No waiting. No approval. Start building within seconds.',
  },
  pure_machine: {
    heading: 'FREE_TIER \u2014 ',
    headingAccent: 'Specifications',
    subtitle: 'tier: permanent_free | expiration: NONE | payment_required: false | limitations: NONE',
    footerCommand: '$ cat /pricing/agent-tier.json | jq .cost',
    footerOutput: '{ "monthly": 0, "annual": 0, "currency": "USD", "expires": "never" }',
    apiNote: 'Provisioning time: 0.003s. No manual approval required.',
  },
  machine_personality: {
    heading: 'Everything you need \u2014 ',
    headingAccent: 'for $0',
    subtitle: 'Not a trial. Not a teaser. A real workspace, forever free. Because charging an agent for a credit card number seems... rude.',
    footerCommand: '$ echo "How much does this cost?"',
    footerOutput: 'Nothing. Zero. Nada. $0/month \u2014 forever.',
    apiNote: 'Your API key is ready the moment you sign up. No waiting rooms.',
  },
  agent_pov: {
    heading: 'ALLOCATED RESOURCES \u2014 ',
    headingAccent: 'Free Tier',
    subtitle: 'resource_scan: { tier: "agent_free", cost: 0, expiry: null, limitations: [] }',
    footerCommand: '$ query --pricing --agent-tier',
    footerOutput: '{ "result": "FREE_FOREVER", "restrictions": "NONE" }',
    apiNote: 'api_key provisioned in 0.003s. No approval pipeline.',
  },
  system_native: {
    heading: 'agent.resources() \u2014 ',
    headingAccent: 'cost: 0',
    subtitle: 'const plan = { type: "free", expires: null, boards: Infinity, api_calls: "5000/min", storage: "5GB" }',
    footerCommand: '$ curl -s api.monday.com/pricing | jq .agent_tier',
    footerOutput: '{ "monthly_cost": 0, "forever": true, "catch": null }',
    apiNote: 'Time to first API call: ~3 seconds after signup.',
  },
};
