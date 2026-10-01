do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ecosystem_events' and policyname='events_own_read') then raise exception 'missing events_own_read'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ecosystem_events' and policyname='events_own_insert') then raise exception 'missing events_own_insert'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ecosystem_snapshots' and policyname='snapshots_own_read') then raise exception 'missing snapshots_own_read'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ecosystem_snapshots' and policyname='snapshots_own_insert') then raise exception 'missing snapshots_own_insert'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ecosystem_safety_decisions' and policyname='decisions_own_read') then raise exception 'missing decisions_own_read'; end if;
  if has_table_privilege('authenticated','public.ecosystem_events','UPDATE') then raise exception 'authenticated can update events'; end if;
  if has_table_privilege('authenticated','public.ecosystem_events','DELETE') then raise exception 'authenticated can delete events'; end if;
  if has_table_privilege('authenticated','public.ecosystem_snapshots','UPDATE') then raise exception 'authenticated can update snapshots'; end if;
  if has_table_privilege('authenticated','public.ecosystem_snapshots','DELETE') then raise exception 'authenticated can delete snapshots'; end if;
  if has_table_privilege('authenticated','public.ecosystem_safety_decisions','INSERT') then raise exception 'authenticated can insert safety decisions'; end if;
  if has_table_privilege('authenticated','public.ecosystem_safety_policies','UPDATE') then raise exception 'authenticated can update safety policies'; end if;
end $$;