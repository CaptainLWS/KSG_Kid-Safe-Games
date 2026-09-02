-- Phase 1 security hardening applied to the existing jarvondisu Supabase project.
-- Keep this migration in source control so local/staging environments converge.

drop policy if exists public_read_captains_log on public.captains_log;
drop policy if exists auth_insert_captains_log on public.captains_log;
create policy "users read their own captain log" on public.captains_log for select to authenticated using (user_id = (select auth.uid()));
create policy "users append their own captain log" on public.captains_log for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists auth_manage_ship_rooms on public.ship_rooms;
drop policy if exists public_read_ship_rooms on public.ship_rooms;
create policy "authenticated users read ship rooms" on public.ship_rooms for select to authenticated using (true);

drop policy if exists admin_all_roles on public.user_role_assignments;
drop policy if exists user_read_own_roles on public.user_role_assignments;
create policy "users read their own role assignments" on public.user_role_assignments for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists users_manage_own_user_profiles on public.user_profiles;
drop policy if exists admins_read_all_profiles on public.user_profiles;
drop policy if exists admin_full_access_user_profiles on public.user_profiles;
create policy "users read their own profile" on public.user_profiles for select to authenticated using (id = (select auth.uid()));
revoke all on public.user_profiles from anon, authenticated;
grant select on public.user_profiles to authenticated;

revoke execute on function public.curriculum_submissions_broadcast_trigger() from anon, authenticated;
revoke execute on function public.has_role_for_course(text) from anon, authenticated;
revoke execute on function public.is_admin_user() from anon, authenticated;
revoke execute on function public.is_admin_user_veteran() from anon, authenticated;
revoke execute on function public.is_professional_or_admin() from anon, authenticated;
revoke execute on function public.faao_update_posture_timestamp() from anon, authenticated;
revoke execute on function public.is_admin_from_auth() from anon, authenticated;
revoke execute on function public.set_updated_at() from anon, authenticated;
revoke execute on function public.set_updated_at_world() from anon, authenticated;
revoke execute on function public.set_veteran_updated_at() from anon, authenticated;
revoke execute on function public.update_course_updated_at() from anon, authenticated;
revoke execute on function public.update_quiz_question_count() from anon, authenticated;
revoke execute on function public.update_reward_updated_at() from anon, authenticated;
revoke execute on function public.update_starship_module_updated_at() from anon, authenticated;

revoke all on public.ship_rooms from anon;
revoke all on public.ecosystem_worlds from anon;
revoke all on public.ecosystem_safety_policies from anon;
revoke all on public.ecosystem_events from anon;
revoke all on public.ecosystem_safety_decisions from anon;
revoke all on public.ecosystem_snapshots from anon;
revoke all on public.ecosystem_user_state from anon;
revoke all on public.captains_log from anon;
revoke all on public.user_role_assignments from anon;
