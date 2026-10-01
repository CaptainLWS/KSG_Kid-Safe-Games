'use server'

import { createEventBus } from '@/lib/ecosystem/event-bus'
import { appendSnapshot } from '@/lib/ecosystem/snapshot-chain'
import { createClient } from '@/lib/supabase/server'

export async function recordContinuityEvent() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub
  if (!userId) return

  const { data: world, error: worldError } = await supabase
    .from('ecosystem_worlds')
    .select('id')
    .eq('slug', 'digital-ship')
    .single()

  if (worldError || !world) throw new Error('Digital Ship world is unavailable')

  const result = await createEventBus().publish({
    world_id: world.id,
    event_type: 'JarvondisContinuityCheck',
    payload: { source: 'digital-ship', action: 'continuity_check', safe: true },
  })

  if (result.decision !== 'allow') {
    throw new Error(`Continuity event requires ${result.decision}`)
  }

  const state = {
    active_world: 'digital-ship',
    adaptation: { mode: 'guided', pace: 'adaptive', safety: 'kid_safe' },
    last_event: result.eventId,
  }

  const { error: stateError } = await supabase
    .from('ecosystem_user_state')
    .upsert({
      user_id: userId,
      active_world_id: world.id,
      state,
      adaptation: state.adaptation,
      state_version: 1,
    })

  if (stateError) throw new Error(stateError.message)
  await appendSnapshot(state)
}