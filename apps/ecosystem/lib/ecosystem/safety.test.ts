import { describe, expect, it } from 'vitest'
import { evaluateSafety } from './safety'

const policy = { slug: 'sunshine-shield-core', version: '1.0.0', rules: {} }

describe('formal safety-policy evaluator', () => {
  it.each([
    ['ordinary continuity', 'JarvondisContinuityCheck', { safe: true }, 'allow'],
    ['higher-risk indicator', 'MessageSent', { text: 'unsafe threat discussion' }, 'review'],
    ['prohibited indicator', 'ContentCreated', { category: 'malware' }, 'block'],
    ['escalation indicator', 'SafetySignal', { marker: 'imminent-danger' }, 'escalate'],
  ])('%s', (_name, eventType, payload, expected) => {
    expect(evaluateSafety({ eventType, payload, policy }).decision).toBe(expected)
  })

  it('defaults unknown policies to review', () => {
    expect(evaluateSafety({
      eventType: 'Unknown', payload: {}, policy: { ...policy, slug: 'unknown-policy' },
    }).decision).toBe('review')
  })
})