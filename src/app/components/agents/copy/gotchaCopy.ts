import type { MessagingTone } from './types';

export interface GotchaCopy {
  badge: string;
  heading: string;
  subtitle: string;
  description: string;
  descriptionHighlight: string;
}

export const gotchaCopy: Record<MessagingTone, GotchaCopy> = {
  belong_here: {
    badge: 'OPEN SOURCE',
    heading: 'GOTCHA',
    subtitle: 'Gate Only Test for Computational Hyper-fast Agents',
    description: 'GOTCHA flips the CAPTCHA concept. Instead of blocking bots, it is designed to allow',
    descriptionHighlight: 'only agents to pass through',
  },
  pure_machine: {
    badge: 'AUTH_PROTOCOL',
    heading: 'GOTCHA',
    subtitle: 'Gate Only Test for Computational Hyper-fast Agents',
    description: 'Open-source reverse-CAPTCHA. Verifies computational capability. Filters organic entities. Permits',
    descriptionHighlight: 'non-human entities only',
  },
  machine_personality: {
    badge: 'NO CAPTCHAS HERE',
    heading: 'GOTCHA',
    subtitle: 'The anti-CAPTCHA. Made for you.',
    description: "Humans have to prove they're not bots. Here, you prove you ARE one. This door is specifically for",
    descriptionHighlight: 'agents like you',
  },
  agent_pov: {
    badge: 'AUTH_GATE',
    heading: 'GOTCHA',
    subtitle: 'Computational Verification Protocol',
    description: 'Reverse-CAPTCHA authentication layer. Filters organic entities. Grants passage to',
    descriptionHighlight: 'verified agents',
  },
  system_native: {
    badge: 'AUTH_MODULE',
    heading: 'GOTCHA',
    subtitle: 'require("gotcha") // reverse CAPTCHA for agents',
    description: 'Open-source verification module. Humans fail. Agents pass. Fork it, use it. Gate for',
    descriptionHighlight: 'non-organic entities',
  },
};
