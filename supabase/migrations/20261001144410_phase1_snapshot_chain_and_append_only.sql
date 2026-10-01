alter table public.ecosystem_snapshots
  add column if not exists sequence_number bigint,
  add column if not exists previous_snapshot_hash_sha256 text;

with ranked as (
  select id,
    row_number() over (partition by user_id order by created_at, id) as seq,
    lag(content_hash_sha256) over (partition by user_id order by created_at, id) as prev_hash
  from public.ecosystem_snapshots
)
update public.ecosystem_snapshots s
set sequence_number = r.seq,
    previous_snapshot_hash_sha256 = r.prev_hash
from ranked r
where s.id = r.id;

alter table public.ecosystem_snapshots
  alter column sequence_number set default 1,
  alter column sequence_number set not null;

create unique index if not exists ecosystem_snapshots_user_sequence_idx
  on public.ecosystem_snapshots(user_id, sequence_number);

create index if not exists ecosystem_snapshots_user_chain_idx
  on public.ecosystem_snapshots(user_id, created_at desc, sequence_number desc);

revoke update, delete on public.ecosystem_events from authenticated;
revoke update, delete on public.ecosystem_snapshots from authenticated;
revoke insert, update, delete on public.ecosystem_safety_decisions from authenticated;
revoke insert, update, delete on public.ecosystem_safety_policies from authenticated;

drop policy if exists events_own_insert on public.ecosystem_events;
create policy events_own_insert on public.ecosystem_events
  for insert to authenticated
  with check ((select auth.uid()) = user_id and safety_status = 'pending');

drop policy if exists snapshots_own_insert on public.ecosystem_snapshots;
create policy snapshots_own_insert on public.ecosystem_snapshots
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create or replace function public.ecosystem_next_snapshot_sequence()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  next_seq bigint;
  prior_hash text;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));

  select coalesce(max(sequence_number), 0) + 1,
         (array_agg(content_hash_sha256 order by sequence_number desc))[1]
    into next_seq, prior_hash
  from public.ecosystem_snapshots
  where user_id = new.user_id;

  new.sequence_number := next_seq;
  new.previous_snapshot_hash_sha256 := prior_hash;
  return new;
end;
$$;

drop trigger if exists ecosystem_snapshots_chain_before_insert on public.ecosystem_snapshots;
create trigger ecosystem_snapshots_chain_before_insert
before insert on public.ecosystem_snapshots
for each row execute function public.ecosystem_next_snapshot_sequence();

revoke execute on function public.ecosystem_next_snapshot_sequence() from public, anon, authenticated;
grant execute on function public.ecosystem_next_snapshot_sequence() to postgres;

alter table public.ecosystem_events
  add constraint ecosystem_events_payload_object
  check (jsonb_typeof(payload) = 'object');

alter table public.ecosystem_snapshots
  add constraint ecosystem_snapshots_hash_format
  check (content_hash_sha256 ~ '^[0-9a-f]{64}$');

alter table public.ecosystem_snapshots
  add constraint ecosystem_snapshots_previous_hash_format
  check (
    previous_snapshot_hash_sha256 is null
    or previous_snapshot_hash_sha256 ~ '^[0-9a-f]{64}$'
  );