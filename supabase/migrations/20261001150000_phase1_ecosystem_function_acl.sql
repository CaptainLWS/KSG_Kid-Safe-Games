drop policy if exists "users can create their own events" on public.ecosystem_events;
drop policy if exists "users can read their own events" on public.ecosystem_events;
drop policy if exists "users can create their own snapshots" on public.ecosystem_snapshots;
drop policy if exists "users can read their own snapshots" on public.ecosystem_snapshots;

create policy events_own_read on public.ecosystem_events
  for select to authenticated using ((select auth.uid()) = user_id);

create policy snapshots_own_read on public.ecosystem_snapshots
  for select to authenticated using ((select auth.uid()) = user_id);

revoke execute on function public.ecosystem_event_integrity() from public, anon, authenticated;
revoke execute on function public.ecosystem_snapshot_integrity() from public, anon, authenticated;