-- SCHOLARK r225 · background notification scheduler
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

do $$
begin
  if not exists (select 1 from vault.decrypted_secrets where name='scholark_notification_app_url') then
    perform vault.create_secret(
      'https://scholark-app-shawiel.onrender.com',
      'scholark_notification_app_url',
      'SCHOLARK notification dispatcher base URL'
    );
  end if;
  if not exists (select 1 from vault.decrypted_secrets where name='scholark_notification_dispatch_secret') then
    perform vault.create_secret(
      replace(gen_random_uuid()::text,'-','') || replace(gen_random_uuid()::text,'-','') || replace(gen_random_uuid()::text,'-',''),
      'scholark_notification_dispatch_secret',
      'SCHOLARK notification dispatcher secret'
    );
  end if;
end $$;

select cron.unschedule(jobid)
from cron.job
where jobname='scholark-notification-dispatch';

select cron.schedule(
  'scholark-notification-dispatch',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := (
      select decrypted_secret
      from vault.decrypted_secrets
      where name='scholark_notification_app_url'
      limit 1
    ) || '/api/notifications/dispatch',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'x-scholark-dispatch-secret',(
        select decrypted_secret
        from vault.decrypted_secrets
        where name='scholark_notification_dispatch_secret'
        limit 1
      )
    ),
    body := jsonb_build_object('source','supabase-cron'),
    timeout_milliseconds := 30000
  );
  $$
);
