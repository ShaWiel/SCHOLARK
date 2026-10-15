-- r272: keep Connect private while it remains Coming Soon.
-- Identity discovery must only reveal users in a room shared with the caller.
-- The previous m.user_id = m.user_id was a tautology and could expose
-- unrelated non-searchable identities whenever the caller belonged to a room.
ALTER POLICY "connect identities searchable and contacts"
ON public.connect_identities
USING (
  user_id = (SELECT auth.uid())
  OR searchable
  OR EXISTS (
    SELECT 1 FROM public.connect_friends f
    WHERE f.status = 'accepted'
      AND (
        (f.requester = connect_identities.user_id AND f.recipient = (SELECT auth.uid()))
        OR (f.recipient = connect_identities.user_id AND f.requester = (SELECT auth.uid()))
      )
  )
  OR EXISTS (
    SELECT 1 FROM public.connect_room_members m
    WHERE m.user_id = connect_identities.user_id
      AND m.left_at IS NULL
      AND public.connect_member(m.room_id, (SELECT auth.uid()))
  )
);

-- Cache the caller identity once per SQL statement instead of per row;
-- room membership is still checked against each candidate row.
ALTER POLICY "connect blocks own" ON public.connect_blocks
USING (blocker = (SELECT auth.uid()));
ALTER POLICY "connect friendships participants" ON public.connect_friends
USING (requester = (SELECT auth.uid()) OR recipient = (SELECT auth.uid()));
ALTER POLICY "connect direct messages participants" ON public.connect_messages
USING (sender = (SELECT auth.uid()) OR recipient = (SELECT auth.uid()));
ALTER POLICY "connect reports only reporting account" ON public.connect_reports
USING (reporter = (SELECT auth.uid()));
ALTER POLICY "connect room chat members" ON public.connect_room_chat
USING (public.connect_member(room_id, (SELECT auth.uid())));
ALTER POLICY "connect membership participants" ON public.connect_room_members
USING (public.connect_member(room_id, (SELECT auth.uid())));
ALTER POLICY "connect rooms participants" ON public.connect_rooms
USING (owner_id = (SELECT auth.uid()) OR public.connect_member(id, (SELECT auth.uid())));
ALTER POLICY "connect signals addressed recipient" ON public.connect_signals
USING (recipient = (SELECT auth.uid()) AND public.connect_member(room_id, (SELECT auth.uid())));

-- Cover both sides of Connect relationships for joins, cascading checks,
-- notification delivery and account deletion at scale.
CREATE INDEX IF NOT EXISTS connect_blocks_blocked_idx ON public.connect_blocks (blocked);
CREATE INDEX IF NOT EXISTS connect_friends_requester_idx ON public.connect_friends (requester, status);
CREATE INDEX IF NOT EXISTS connect_messages_recipient_created_idx ON public.connect_messages (recipient, created_at DESC);
CREATE INDEX IF NOT EXISTS connect_reports_reported_idx ON public.connect_reports (reported);
CREATE INDEX IF NOT EXISTS connect_rooms_owner_idx ON public.connect_rooms (owner_id);
CREATE INDEX IF NOT EXISTS connect_signals_sender_idx ON public.connect_signals (sender);
