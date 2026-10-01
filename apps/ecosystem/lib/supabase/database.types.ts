export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      ecosystem_worlds: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          safety_class: 'kid_safe' | 'general' | 'restricted'
          status: 'active' | 'maintenance' | 'disabled'
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string
          safety_class?: 'kid_safe' | 'general' | 'restricted'
          status?: 'active' | 'maintenance' | 'disabled'
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['ecosystem_worlds']['Insert']>
      }
      ecosystem_user_state: {
        Row: {
          user_id: string
          preferences: Json
          adaptation: Json
          active_world_id: string | null
          state: Json
          state_version: number
          updated_at: string
        }
        Insert: {
          user_id: string
          preferences?: Json
          adaptation?: Json
          active_world_id?: string | null
          state?: Json
          state_version?: number
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['ecosystem_user_state']['Insert']>
      }
      ecosystem_events: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          world_id: string | null
          payload: Json
          safety_status: 'pending' | 'allowed' | 'blocked' | 'review' | 'escalated'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_type: string
          world_id?: string | null
          payload?: Json
          safety_status?: 'pending' | 'allowed' | 'blocked' | 'review' | 'escalated'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['ecosystem_events']['Insert']>
      }
      ecosystem_snapshots: {
        Row: {
          id: string
          user_id: string
          state: Json
          content_hash_sha256: string
          schema_version: string
          sequence_number: number
          previous_snapshot_hash_sha256: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          state: Json
          content_hash_sha256: string
          schema_version?: string
          sequence_number?: number
          previous_snapshot_hash_sha256?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['ecosystem_snapshots']['Insert']>
      }
      ecosystem_safety_policies: {
        Row: {
          id: string
          slug: string
          name: string
          version: string
          rules: Json
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          version: string
          rules?: Json
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['ecosystem_safety_policies']['Insert']>
      }
      ecosystem_safety_decisions: {
        Row: {
          id: string
          event_id: string | null
          user_id: string | null
          decision: 'allow' | 'block' | 'review' | 'escalate'
          reason: string
          policy_slug: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          user_id?: string | null
          decision: 'allow' | 'block' | 'review' | 'escalate'
          reason: string
          policy_slug?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['ecosystem_safety_decisions']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
