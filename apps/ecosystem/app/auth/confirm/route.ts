import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest){const {searchParams}=new URL(request.url); const token_hash=searchParams.get('token_hash'); const type=searchParams.get('type') as EmailOtpType|null; const next=request.nextUrl.clone(); next.pathname='/ship'; next.searchParams.delete('token_hash'); next.searchParams.delete('type'); if(token_hash&&type){const supabase=await createClient(); const {error}=await supabase.auth.verifyOtp({type,token_hash}); if(!error)return NextResponse.redirect(next)} next.pathname='/login'; return NextResponse.redirect(next)}
