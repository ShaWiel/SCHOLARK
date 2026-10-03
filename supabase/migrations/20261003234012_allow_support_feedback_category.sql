-- Allow the launch support form to persist as a first-class feedback category.
-- Applied to production Supabase as migration 20261003234012.

alter table public.feedback_submissions
  drop constraint if exists feedback_submissions_category_check;

alter table public.feedback_submissions
  add constraint feedback_submissions_category_check
  check (
    category = any (
      array[
        'general'::text,
        'support'::text,
        'bug'::text,
        'billing'::text,
        'schools'::text,
        'language'::text,
        'accessibility'::text,
        'privacy'::text,
        'other'::text
      ]
    )
  );
