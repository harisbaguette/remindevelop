const https = require('https');

const PROJECT_REF = 'yvhedzjhgwyifselhyys';
// Removing invalid token to prevent accidental commit
const API_TOKEN = 'PLACEHOLDER_TOKEN';

const sqlScripts = [
    // 1. Add image_url column
    `ALTER TABLE links ADD COLUMN IF NOT EXISTS image_url TEXT;`,

    // 2. Add type column
    `
    do $$ 
    begin 
      if not exists (select 1 from information_schema.columns where table_name = 'links' and column_name = 'type') then
        alter table links add column type text default 'link' check (type in ('link', 'text'));
      end if; 
    end $$;
    `,

    // 3. Add trash cleanup function
    `
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
    `
];

// ... rest of the code ...
