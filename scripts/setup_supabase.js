const https = require('https');

const PROJECT_REF = 'yvhedzjhgwyifselhyys';
const API_TOKEN = 'sb_secret_atXLq9ZRX5KRxL30jQZ6Eg_zaXIr69B'; // User provided secret

const sqlScripts = [
    `
  -- Add type column
  do $$ 
  begin 
    if not exists (select 1 from information_schema.columns where table_name = 'links' and column_name = 'type') then
      alter table links add column type text default 'link' check (type in ('link', 'text'));
    end if; 
  end $$;
  `,
    `
  -- Trash cleanup function
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

function runSql(query) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.supabase.com',
            path: `/v1/projects/${PROJECT_REF}/sql`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(JSON.stringify({ query }));
        req.end();
    });
}

async function main() {
    console.log('Starting Supabase setup...');

    try {
        for (const [index, sql] of sqlScripts.entries()) {
            console.log(`Executing script ${index + 1}...`);
            const result = await runSql(sql);
            console.log(`Script ${index + 1} output:`, result);
        }
        console.log('Setup completed successfully!');
    } catch (error) {
        console.error('Setup failed:', error.message);
        process.exit(1);
    }
}

main();
