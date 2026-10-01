import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic='force-dynamic'
export default async function Ship(){const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) return null; const {data:worlds}=await supabase.from('ecosystem_worlds').select('id,slug,name,description,safety_class').eq('status','active').order('name'); return <main style={{maxWidth:960,margin:'0 auto',padding:40,fontFamily:'system-ui'}}><h1>Digital Ship</h1><p>Authenticated as {user.email}</p><p>Your Phase 1 identity is active. The Ship can now load persistent worlds through RLS-protected data.</p><section><h2>World Registry</h2><ul>{worlds?.map(w=><li key={w.id}><strong>{w.name}</strong> — {w.description} ({w.safety_class})</li>)}</ul></section><p><Link href="/ship/continuity">Open Jarvondis Continuity</Link></p><form action="/auth/signout" method="post"><button>Sign out</button></form></main>}
