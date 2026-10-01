do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ecosystem_events' and cmd='SELECT' and 'authenticated' = any(roles)) then raise exception 'events SELECT policy missing'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ecosystem_events' and cmd='INSERT' and 'authenticated' = any(roles)) then raise exception 'events INSERT policy missing'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ecosystem_snapshots' and cmd='SELECT' and 'authenticated' = any(roles)) then raise exception 'snapshots SELECT policy missing'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ecosystem_snapshots' and cmd='INSERT' and 'authenticated' = any(roles)) then raise exception 'snapshots INSERT policy missing'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ecosystem_safety_decisions' and cmd='SELECT' and 'authenticated' = any(roles)) then raise exception 'safety decision SELECT policy missing'; end if;
  if has_table_privilege('authenticated','public.ecosystem_events','UPDATE') then raise exception 'authenticated can update events'; end if;
  if has_table_privilege('authenticated','public.ecosystem_events','DELETE') then raise exception 'authenticated can delete events'; end if;
  if has_table_privilege('authenticated','public.ecosystem_snapshots','UPDATE') then raise exception 'authenticated can update snapshots'; end if;
  if has_table_privilege('authenticated','public.ecosystem_snapshots','DELETE') then raise exception 'authenticated can delete snapshots'; end if;
  if has_table_privilege('authenticated','public.ecosystem_safety_decisions','INSERT') then raise exception 'authenticated can insert safety decisions'; end if;
  if has_table_privilege('authenticated','public.ecosystem_safety_policies','UPDATE') then raise exception 'authenticated can update safety policies'; end if;
  if has_function_privilege('anon','public.ecosystem_event_integrity()','EXECUTE') then raise exception 'anon can execute ecosystem_event_integrity'; end if;
  if has_function_privilege('authenticated','public.ecosystem_event_integrity()','EXECUTE') then raise exception 'authenticated can execute ecosystem_event_integrity'; end if;
  if has_function_privilege('anon','public.ecosystem_snapshot_integrity()','EXECUTE') then raise exception 'anon can execute ecosystem_snapshot_integrity'; end if;
  if has_function_privilege('authenticated','public.ecosystem_snapshot_integrity()','EXECUTE') then raise exception 'authenticated can execute ecosystem_snapshot_integrity'; end if;
end $$;