import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function RestorePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: snapshots } = await supabase.from("ecosystem_snapshots").select("id,created_at,state_version:state,content_hash_sha256,schema_version").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
  return <main className="shell"><p className="muted">ARK OF STEWARDSHIP · CONTINUITY</p><h1>Restore a snapshot</h1><p>Choose a saved state to inspect before restoration. Restoration is intentionally explicit and user-controlled.</p><div className="grid">{(snapshots ?? []).map(s => <article className="card" key={s.id}><h3>{new Date(s.created_at).toLocaleString()}</h3><p className="muted">Schema {s.schema_version}</p><code>{s.content_hash_sha256}</code><p><Link className="button" href={`/ship/restore/${s.id}`}>Inspect</Link></p></article>)}</div><p><Link href="/ship">← Return to Bridge</Link></p></main>;
}
