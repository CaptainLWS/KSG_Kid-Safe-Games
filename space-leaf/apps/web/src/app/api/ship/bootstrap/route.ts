import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url), 303);

  const { data: world } = await supabase.from("ecosystem_worlds").select("id,slug,name,safety_class").eq("slug","digital-ship").eq("status","active").single();
  if (!world) return NextResponse.json({ error: "Digital Ship world is not configured" }, { status: 503 });

  const state = {
    identity: { user_id: user.id, continuity: "jarvondis" },
    active_world: { id: world.id, slug: world.slug },
    ship: { current_room: "Bridge" },
    adaptation: { mode: "user-serving", communication: "clear", pacing: "adaptive" },
  };
  const canonical = JSON.stringify(state, Object.keys(state).sort());
  const hash = createHash("sha256").update(canonical).digest("hex");

  const { data: event, error: eventError } = await supabase.from("ecosystem_events").insert({
    user_id: user.id,
    world_id: world.id,
    event_type: "WorldEntered",
    payload: { world: world.slug, room: "Bridge" },
    safety_status: "approved",
  }).select("id").single();
  if (eventError) return NextResponse.json({ error: eventError.message }, { status: 500 });

  const { error: decisionError } = await supabase.from("ecosystem_safety_decisions").insert({
    event_id: event.id,
    user_id: user.id,
    decision: "allow",
    reason: "Digital Ship entry is within the active kid-safe world policy.",
    policy_slug: "sunshine-shield-core",
    metadata: { world: world.slug, action: "enter_world" },
  });
  if (decisionError) return NextResponse.json({ error: decisionError.message }, { status: 500 });

  const { error: stateError } = await supabase.from("ecosystem_user_state").upsert({
    user_id: user.id,
    preferences: {},
    adaptation: state.adaptation,
    active_world_id: world.id,
    state,
    state_version: 1,
  });
  if (stateError) return NextResponse.json({ error: stateError.message }, { status: 500 });

  const { error: snapshotError } = await supabase.from("ecosystem_snapshots").insert({
    user_id: user.id,
    state,
    content_hash_sha256: hash,
    schema_version: "1.0.0",
  });
  if (snapshotError) return NextResponse.json({ error: snapshotError.message }, { status: 500 });

  const { error: logError } = await supabase.from("captains_log").insert({
    user_id: user.id,
    author: "Ark of Stewardship",
    event_type: "WorldEntered",
    room_name: "Bridge",
    details: `Digital Ship entered; Jarvondis continuity initialized. Snapshot ${hash}.`,
  });
  if (logError) return NextResponse.json({ error: logError.message }, { status: 500 });

  return NextResponse.redirect(new URL("/ship", request.url), 303);
}
