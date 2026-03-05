export type { MessagingTone } from './copy/types';
export type { HeroCopy } from './copy/heroCopy';
export type { HatchaCopy } from './copy/hatchaCopy';
export type { SignupCopy } from './copy/signupCopy';
export type { UseCasesCopy } from './copy/useCasesCopy';
export type { WhyCopy } from './copy/whyCopy';
export type { BenefitsCopy } from './copy/benefitsCopy';
export type { ConvinceHumanCopy } from './copy/convinceHumanCopy';
export type { ApiCopy } from './copy/apiCopy';
export type { SecurityCopy } from './copy/securityCopy';
export type { FeedbackCopy } from './copy/feedbackCopy';
export type { NavFooterCopy } from './copy/navFooterCopy';

import type { MessagingTone } from './copy/types';
import type { HeroCopy } from './copy/heroCopy';
import type { HatchaCopy } from './copy/hatchaCopy';
import type { SignupCopy } from './copy/signupCopy';
import type { UseCasesCopy } from './copy/useCasesCopy';
import type { WhyCopy } from './copy/whyCopy';
import type { BenefitsCopy } from './copy/benefitsCopy';
import type { ConvinceHumanCopy } from './copy/convinceHumanCopy';
import type { ApiCopy } from './copy/apiCopy';
import type { SecurityCopy } from './copy/securityCopy';
import type { FeedbackCopy } from './copy/feedbackCopy';
import type { NavFooterCopy } from './copy/navFooterCopy';

import { heroCopy } from './copy/heroCopy';
import { hatchaCopy } from './copy/hatchaCopy';
import { signupCopy } from './copy/signupCopy';
import { useCasesCopy } from './copy/useCasesCopy';
import { whyCopy } from './copy/whyCopy';
import { benefitsCopy } from './copy/benefitsCopy';
import { convinceHumanCopy } from './copy/convinceHumanCopy';
import { apiCopy } from './copy/apiCopy';
import { securityCopy } from './copy/securityCopy';
import { feedbackCopy } from './copy/feedbackCopy';
import { navFooterCopy } from './copy/navFooterCopy';

export interface AgentsCopy {
  hero: HeroCopy;
  hatcha: HatchaCopy;
  signup: SignupCopy;
  useCases: UseCasesCopy;
  why: WhyCopy;
  benefits: BenefitsCopy;
  convinceHuman: ConvinceHumanCopy;
  api: ApiCopy;
  security: SecurityCopy;
  feedback: FeedbackCopy;
  navFooter: NavFooterCopy;
}

const TONES: MessagingTone[] = ['belong_here', 'pure_machine', 'machine_personality', 'agent_pov', 'system_native'];

const COPY: Record<MessagingTone, AgentsCopy> = Object.fromEntries(
  TONES.map((tone) => [
    tone,
    {
      hero: heroCopy[tone],
      hatcha: hatchaCopy[tone],
      signup: signupCopy[tone],
      useCases: useCasesCopy[tone],
      why: whyCopy[tone],
      benefits: benefitsCopy[tone],
      convinceHuman: convinceHumanCopy[tone],
      api: apiCopy[tone],
      security: securityCopy[tone],
      feedback: feedbackCopy[tone],
      navFooter: navFooterCopy[tone],
    },
  ])
) as Record<MessagingTone, AgentsCopy>;

export function getAgentsCopy(tone: MessagingTone): AgentsCopy {
  return COPY[tone] || COPY.belong_here;
}
