import { describe, expect, it } from 'vitest'
import { evaluateSafety } from './safety'
import { hashSnapshot } from './snapshot-chain'

describe('Sunshine Shield evaluator', () => {
  const policy = {
    slug: 'sunshine-shield-core',
    version: '1.0.0',
    rules: {},
  }

  it('allows ordinary ecosystem events', () => {
    expect(evaluateSafety({
      eventType: 'JarvondisContinuityCheck',
      payload: { source: 'digital-ship', safe: true },
      policy,
    }).decision).toBe('allow')
  })

  it('routes higher-risk indicators to review', () => {
    expect(evaluateSafety({
      eventType: 'MessageSent',
      payload: { text: 'unsafe threat discussion' },
      policy,
    }).decision).toBe('review')
  })

  it('blocks explicit prohibited indicators', () => {
    expect(evaluateSafety({
      eventType: 'ContentCreated',
      payload: { category: 'malware' },
      policy,
    }).decision).toBe('block')
  })

  it('escalates imminent danger indicators', () => {
    expect(evaluateSafety({
      eventType: 'SafetySignal',
      payload: { marker: 'imminent-danger' },
      policy,
    }).decision).toBe('escalate')
  })
})

describe('snapshot hashing', () => {
  it('is deterministic regardless of object key order', () => {
    expect(hashSnapshot({ b: 2, a: 1 })).toBe(hashSnapshot({ a: 1, b: 2 }))
  })

  it('changes when state changes', () => {
    expect(hashSnapshot({ version: 1 })).not.toBe(hashSnapshot({ version: 2 }))
  })
})
