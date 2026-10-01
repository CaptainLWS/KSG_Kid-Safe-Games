import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
export const dynamic='force-dynamic'
export async function GET(){const supabase=await createClient(); const {data}=await supabase.auth.getClaims(); if(!data?.claims)return NextResponse.json({error:'unauthorized'},{status:401}); return NextResponse.json({ok:true,user_id:data.claims.sub,service:'ecosystem-core',phase:'1'})}
