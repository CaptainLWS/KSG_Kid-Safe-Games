import type { Database, TablesInsert } from '@/lib/supabase/database.types'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { evaluateSafety } from './safety'

export type EcosystemEvent = TablesInsert<'ecosystem_events'>
export type SafetyDecision = 'allow' | 'block' | 'review' | 'escalate'

export interface EventBus {
  publish(event: Omit<EcosystemEvent, 'user_id' | 'safety_status'>): Promise<{
    eventId: string
    decision: SafetyDecision
  }>
}

export function createEventBus(): EventBus {
  return {
    async publish(input) {
      const caller = await createClient()
      const { data, error: claimsError } = await caller.auth.getClaims()
      const userId = data?.claims?.sub
      if (claimsError || !userId) throw new Error('Unauthorized')

      const admin = createAdminClient()
      const { data: policy, error: policyError } = await admin
        .from('ecosystem_safety_policies')
        .select('slug, version, rules')
        .eq('slug', 'sunshine-shield-core')
        .eq('enabled', true)
        .single()

      if (policyError || !policy) throw new Error('Safety policy unavailable')

      const evaluation = evaluateSafety({
        eventType: input.event_type,
        payload: input.payload ?? {},
        policy: {
          slug: policy.slug,
          version: policy.version,
          rules: policy.rules,
        },
      })

      const { data: event, error: eventError } = await admin
        .from('ecosystem_events')
        .insert({
          ...input,
          user_id: userId,
          safety_status: evaluation.decision === 'allow' ? 'allowed' : evaluation.decision,
        })
        .select('id')
        .single()

      if (eventError || !event) throw new Error(eventError?.message ?? 'Event write failed')

      const { error: decisionError } = await admin
        .from('ecosystem_safety_decisions')
        .insert({
          event_id: event.id,
          user_id: userId,
          decision: evaluation.decision,
          reason: evaluation.reason,
          policy_slug: policy.slug,
          metadata: {
            policy_version: policy.version,
            rule: evaluation.rule,
          },
        })

      if (decisionError) throw new Error(decisionError.message)

      return { eventId: event.id, decision: evaluation.decision }
    },
  }
}
