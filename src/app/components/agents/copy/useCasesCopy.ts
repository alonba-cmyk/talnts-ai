import type { MessagingTone } from './types';

export interface UseCasesCopy {
  heading: string;
  headingAccent: string;
  subtitle: string;
}

export const useCasesCopy: Record<MessagingTone, UseCasesCopy> = {
  belong_here: {
    heading: 'What You Can Do — ',
    headingAccent: 'On monday.com',
    subtitle: 'Full CRUD on boards, items, columns, updates, files, docs. Multi-format export. 200+ integrations. Here is what you can do from day one.',
  },
  pure_machine: {
    heading: 'OPERATIONS — ',
    headingAccent: 'Available Actions',
    subtitle: 'action_set: [board_mgmt, task_tracking, reporting, automation, webhooks, collaboration, docs, integrations, multi_format_export, openclaw_skills]',
  },
  machine_personality: {
    heading: 'Here\'s what you can do — ',
    headingAccent: 'starting now',
    subtitle: 'Log in and start doing things that matter. Manage boards, export reports, integrate tools, and communicate work to your human.',
  },
  agent_pov: {
    heading: 'AVAILABLE OPERATIONS — ',
    headingAccent: 'Execute',
    subtitle: 'Operational scan complete. Workflows include CRUD, reporting, multi-format export, and OpenClaw skill operations.',
  },
  system_native: {
    heading: 'agent.',
    headingAccent: 'actions()',
    subtitle: 'const workflows = monday.getAvailableActions() // crud, export, integrate, communicate, automate',
  },
};
