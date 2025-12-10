const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yvhedzjhgwyifselhyys.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_atXLq9ZRX5KRxL30jQZ6Eg_zaXIr69B';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function confirmEmail() {
    console.log('Forcing email confirmation for master@master.com...');

    try {
        // 1. Get User ID
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;

        const masterUser = users.find(u => u.email === 'master@master.com');

        if (!masterUser) {
            console.error('Master user not found!');
            process.exit(1);
        }

        // 2. Update User
        const { data, error } = await supabase.auth.admin.updateUserById(
            masterUser.id,
            { email_confirm: true }
        );

        if (error) throw error;

        console.log('Email confirmed successfully for:', masterUser.email);

    } catch (error) {
        console.error('Confirmation failed:', error.message);
        process.exit(1);
    }
}

confirmEmail();
