-- SCHOLAVERUM Connect abuse reporting. Reports are private and never shown to the subject.
create table if not exists public.connect_reports(
 id bigint generated always as identity primary key,
 reporter uuid not null references auth.users(id) on delete cascade,
 reported uuid not null references auth.users(id) on delete cascade,
 category text not null check(category in ('harassment','bullying','spam','unsafe_content','other')),
 context text not null default 'connect' check(context in ('connect','meeting','message')),
 details text not null default '' check(length(details)<=1000),
 status text not null default 'pending' check(status in ('pending','reviewing','resolved')),
 created_at timestamptz not null default now(),
 check(reporter<>reported)
);
create index if not exists connect_reports_reporter_idx on public.connect_reports(reporter,created_at desc);
alter table public.connect_reports enable row level security;
create policy "connect reports only reporting account" on public.connect_reports for select to authenticated using(reporter=auth.uid());
grant select on public.connect_reports to authenticated;
revoke insert,update,delete on public.connect_reports from anon,authenticated;
create or replace function public.connect_report(p_target uuid,p_category text,p_context text default 'connect',p_details text default '')
returns bigint language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); new_id bigint;
begin
if u is null or u=p_target or p_target is null then raise exception 'Invalid report';end if;
if p_category not in ('harassment','bullying','spam','unsafe_content','other') then raise exception 'Choose a report category';end if;
if p_context not in ('connect','meeting','message') or length(p_details)>1000 then raise exception 'Invalid report details';end if;
if (select count(*) from public.connect_reports where reporter=u and created_at>now()-interval '24 hours')>=5 then raise exception 'Daily report limit reached. Contact support for urgent safety concerns';end if;
insert into public.connect_reports(reporter,reported,category,context,details)
values(u,p_target,p_category,p_context,trim(p_details)) returning id into new_id;
return new_id;
end $$;
revoke all on function public.connect_report(uuid,text,text,text) from public;
grant execute on function public.connect_report(uuid,text,text,text) to authenticated;
