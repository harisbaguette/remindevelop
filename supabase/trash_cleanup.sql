-- Function to delete old trash items
create or replace function delete_old_trash()
returns void
language plpgsql
security definer
as $$
begin
  delete from links
  where status = 'trash'
  and updated_at < now() - interval '30 days';
end;
$$;

-- Note: To run this automatically, you can use pg_cron if enabled on your Supabase project:
-- select cron.schedule('0 0 * * *', 'select delete_old_trash()');

-- Alternatively, you can create a scheduled Edge Function, or just run this function manually occasionally.
