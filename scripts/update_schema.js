const https = require('https');

const PROJECT_REF = 'yvhedzjhgwyifselhyys';
const API_TOKEN = 'sb_p_4c148332-95a4-4f05-8e7c-878939634cc5';
// Note: The previous token 'sb_secret_...' seemed like a personal access token but might be expired or invalid if not careful.
// Actually, looking at the previous file content:
// const API_TOKEN = 'sb_secret_atXLq9ZRX5KRxL30jQZ6Eg_zaXIr69B';
// I should use the EXACT token found in setup_supabase.js.

const ACTUAL_API_TOKEN = 'sb_secret_atXLq9ZRX5KRxL30jQZ6Eg_zaXIr69B';

const sqlScripts = [
    `ALTER TABLE links ADD COLUMN IF NOT EXISTS image_url TEXT;`
];

function runSql(query) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.supabase.com',
            path: `/v1/projects/${PROJECT_REF}/sql`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACTUAL_API_TOKEN}`
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
    console.log('Applying schema updates...');

    try {
        for (const [index, sql] of sqlScripts.entries()) {
            console.log(`Executing SQL...`);
            const result = await runSql(sql);
            console.log(`Result:`, result);
        }
        console.log('Schema update completed successfully!');
    } catch (error) {
        console.error('Schema update failed:', error.message);
        process.exit(1);
    }
}

main();
