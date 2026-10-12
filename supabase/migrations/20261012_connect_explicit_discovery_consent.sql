-- Only explicit consent enables search discovery. This also protects RPC callers
-- that omit the optional searchable argument.
create or replace function public.connect_register(
  p_handle text,p_name text,p_searchable boolean default false
) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare
  u uuid:=auth.uid();
  h text:=lower(trim(p_handle));
  n text:=trim(p_name);
  saved public.connect_identities;
begin
  if u is null then raise exception 'Sign in to use Connect' using errcode='28000';end if;
  if h !~ '^[a-z0-9_]{3,24}$' or length(n) not between 1 and 60 then
    raise exception 'Choose a valid handle and display name';
  end if;
  insert into public.connect_identities(user_id,handle,display_name,searchable)
  values(u,h,n,coalesce(p_searchable,false))
  on conflict(user_id) do update
     set handle=excluded.handle,display_name=excluded.display_name,searchable=excluded.searchable
  returning * into saved;
  return jsonb_build_object('user_id',saved.user_id,'handle',saved.handle,
    'display_name',saved.display_name,'searchable',saved.searchable);
end $$;
revoke all on function public.connect_register(text,text,boolean) from public;
grant execute on function public.connect_register(text,text,boolean) to authenticated;