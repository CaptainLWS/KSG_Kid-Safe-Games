import type { Json } from '@/lib/supabase/database.types'

export function canonicalizeJson(value: Json): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)

  if (Array.isArray(value)) {
    return '[' + value.map(canonicalizeJson).join(',') + ']'
  }

  const object = value as Record<string, Json | undefined>
  const keys = Object.keys(object).filter((key) => object[key] !== undefined).sort()

  return '{' + keys.map((key) => JSON.stringify(key) + ':' + canonicalizeJson(object[key]!)).join(',') + '}'
}
