-- SCHOLAVERUM r273: Connect is COMING SOON. Enforce this on the Data API,
-- not only through client feature flags or hidden navigation.
--
-- Keep all existing Connect records and RLS policies intact. Block direct
-- table access and exposed RPC entry points for browser-issued anon/auth JWTs.
-- The privileged service_role retains its existing separately granted rights.
-- When Connect launches, permissions must be reviewed and restored explicitly,
-- alongside a new release gate and end-to-end authorization tests.
DO $connect_launch_gate$
DECLARE rec record;
BEGIN
  FOR rec IN
    SELECT p.oid
      FROM pg_proc AS p
     WHERE p.pronamespace = 'public'::regnamespace
       AND left(p.proname, 8) = 'connect_'
  LOOP
    EXECUTE format(
      'REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated',
      rec.oid::regprocedure
    );
  END LOOP;

  FOR rec IN
    SELECT c.relname
      FROM pg_class AS c
     WHERE c.relnamespace = 'public'::regnamespace
       AND c.relkind IN ('r', 'p')
       AND left(c.relname, 8) = 'connect_'
  LOOP
    EXECUTE format(
      'REVOKE ALL PRIVILEGES ON TABLE public.%I FROM PUBLIC, anon, authenticated',
      rec.relname
    );
  END LOOP;
END
$connect_launch_gate$;
