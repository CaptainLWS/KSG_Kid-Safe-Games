import { createHash } from 'node:crypto'
import type { Json } from '@/lib/supabase/database.types'
import { canonicalizeJson } from './canonical-json'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface SnapshotResult {
  snapshotId: string
  sequenceNumber: number
  hash: string
  previousHash: string | null
}

export function hashSnapshot(state: Json): string {
  return createHash('sha256').update(canonicalizeJson(state)).digest('hex')
}

export async function appendSnapshot(state: Json): Promise<SnapshotResult> {
  const caller = await createClient()
  const { data, error } = await caller.auth.getClaims()
  const userId = data?.claims?.sub
  if (error || !userId) throw new Error('Unauthorized')

  const admin = createAdminClient()
  const hash = hashSnapshot(state)

  const { data: snapshot, error: snapshotError } = await admin
    .from('ecosystem_snapshots')
    .insert({
      user_id: userId,
      state,
      content_hash_sha256: hash,
      schema_version: '1.1.0',
    })
    .select('id, sequence_number, previous_snapshot_hash_sha256')
    .single()

  if (snapshotError || !snapshot) throw new Error(snapshotError?.message ?? 'Snapshot write failed')

  return {
    snapshotId: snapshot.id,
    sequenceNumber: snapshot.sequence_number,
    hash,
    previousHash: snapshot.previous_snapshot_hash_sha256,
  }
}
