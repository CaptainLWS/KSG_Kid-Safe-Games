import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { cookies: {
    getAll: () => request.cookies.getAll(),
    setAll: (items) => { items.forEach(({name,value}) => request.cookies.set(name,value)); response = NextResponse.next({request}); items.forEach(({name,value,options}) => response.cookies.set(name,value,options)); },
  }});
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && request.nextUrl.pathname.startsWith("/ship")) { const url=request.nextUrl.clone(); url.pathname="/login"; url.searchParams.set("next",request.nextUrl.pathname); return NextResponse.redirect(url); }
  return response;
}
