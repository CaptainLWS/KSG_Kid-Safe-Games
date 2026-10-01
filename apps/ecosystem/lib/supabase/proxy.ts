import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {cookies:{getAll:()=>request.cookies.getAll(),setAll(cookiesToSet,headers){cookiesToSet.forEach(({name,value})=>request.cookies.set(name,value)); response=NextResponse.next({request}); cookiesToSet.forEach(({name,value,options})=>response.cookies.set(name,value,options)); Object.entries(headers).forEach(([key,value])=>response.headers.set(key,value))}}})
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims
  const pathname=request.nextUrl.pathname
  const protectedPath=pathname.startsWith('/ship') || pathname.startsWith('/api/protected')
  if(protectedPath && !user){const url=request.nextUrl.clone(); url.pathname='/login'; url.searchParams.set('next',pathname); return NextResponse.redirect(url)}
  response.headers.set('Cache-Control','private, no-store')
  return response
}
