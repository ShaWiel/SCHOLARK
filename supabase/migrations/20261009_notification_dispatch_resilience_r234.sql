begin;

drop index if exists public.push_subscriptions_user_endpoint_uidx;

do $$
declare j bigint;
begin
  select jobid into j from cron.job where jobname='scholark-notification-dispatch' limit 1;
  if j is not null then perform cron.unschedule(j); end if;
end $$;

select cron.schedule(
  'scholark-notification-dispatch',
  '* * * * *',
  $cron$
    select net.http_post(
      url := 'https://yhafbwdnnpvuedycdkll.supabase.co/functions/v1/scholark-notify',
      headers := jsonb_build_object(
        'Content-Type','application/json',
        'x-scholark-dispatch-key',(select dispatch_secret from private.notification_config where singleton=true)
      ),
      body := '{"action":"dispatch"}'::jsonb,
      timeout_milliseconds := 20000
    );
  $cron$
);

commit;
