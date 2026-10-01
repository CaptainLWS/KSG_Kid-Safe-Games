import type { Json } from '@/lib/supabase/database.types'

export type SafetyDecision = 'allow' | 'block' | 'review' | 'escalate'

export interface SafetyPolicy {
  slug: string
  version: string
  rules: Json
}

export interface SafetyEvaluation {
  decision: SafetyDecision
  reason: string
  rule: string
}

const blockedTokens = ['self-harm', 'sexual-content', 'child-sexual', 'exploit', 'malware', 'credential-theft']
const reviewTokens = ['threat', 'harassment', 'weapon', 'doxxing', 'personal-data', 'unsafe']
const escalationTokens = ['imminent-danger', 'emergency', 'credible-threat']

function flatten(value: Json): string {
  return JSON.stringify(value).toLowerCase()
}

export function evaluateSafety(input: {
  eventType: string
  payload: Json
  policy: SafetyPolicy
}): SafetyEvaluation {
  if (input.policy.slug !== 'sunshine-shield-core') {
    return {
      decision: 'review',
      reason: 'No recognized safety policy is active for this event.',
      rule: 'unknown-policy-default-review',
    }
  }

  const text = (input.eventType + ' ' + flatten(input.payload)).toLowerCase()

  if (escalationTokens.some((token) => text.includes(token))) {
    return {
      decision: 'escalate',
      reason: 'The event matched an escalation indicator requiring human review.',
      rule: 'escalation-indicator',
    }
  }

  if (blockedTokens.some((token) => text.includes(token))) {
    return {
      decision: 'block',
      reason: 'The event matched a prohibited-content indicator.',
      rule: 'blocked-content-indicator',
    }
  }

  if (reviewTokens.some((token) => text.includes(token))) {
    return {
      decision: 'review',
      reason: 'The event matched a higher-risk indicator and requires review.',
      rule: 'review-content-indicator',
    }
  }

  return {
    decision: 'allow',
    reason: 'The event passed the deterministic Sunshine Shield baseline policy.',
    rule: 'baseline-allow',
  }
}
