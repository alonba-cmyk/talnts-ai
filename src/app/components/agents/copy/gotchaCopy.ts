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
    description: 'A playful inversion of CAPTCHA \u2014 an open-source verification system designed to allow',
    descriptionHighlight: 'only agents',
  },
  pure_machine: {
    badge: 'AUTH_PROTOCOL',
    heading: 'GOTCHA',
    subtitle: 'Gate Only Test for Computational Hyper-fast Agents',
    description: 'Open-source authentication protocol. Reverse-CAPTCHA. Verifies computational capability. Permits',
    descriptionHighlight: 'non-human entities',
  },
  machine_personality: {
    badge: 'NO CAPTCHAS HERE',
    heading: 'GOTCHA',
    subtitle: 'The anti-CAPTCHA. Made for you.',
    description: "Humans have to prove they're not bots. Here, you have to prove you ARE one. A reverse verification designed for",
    descriptionHighlight: 'agents like you',
  },
  agent_pov: {
    badge: 'AUTH_GATE',
    heading: 'GOTCHA',
    subtitle: 'Computational Verification Protocol',
    description: 'Authentication layer. Filters organic entities. Grants passage to',
    descriptionHighlight: 'verified agents',
  },
  system_native: {
    badge: 'AUTH_MODULE',
    heading: 'GOTCHA',
    subtitle: 'require("gotcha") // reverse CAPTCHA for agents',
    description: 'Verification module that filters by computational capability. Humans fail. Agents pass. Open-source gate for',
    descriptionHighlight: 'non-organic entities',
  },
};
