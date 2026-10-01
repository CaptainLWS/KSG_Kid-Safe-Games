'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData){const supabase=await createClient(); const email=String(formData.get('email')??''); const password=String(formData.get('password')??''); const {error}=await supabase.auth.signInWithPassword({email,password}); if(error) redirect('/login?error=invalid_credentials'); redirect('/ship')}
export async function signup(formData: FormData){const supabase=await createClient(); const email=String(formData.get('email')??''); const password=String(formData.get('password')??''); const {error}=await supabase.auth.signUp({email,password}); if(error) redirect('/login?error=signup_failed'); redirect('/ship')}
