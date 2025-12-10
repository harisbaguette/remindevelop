const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yvhedzjhgwyifselhyys.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_atXLq9ZRX5KRxL30jQZ6Eg_zaXIr69B'; // User provided secret

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function resetAccounts() {
    console.log('Starting account reset...');

    try {
        // 1. Delete all users
        console.log('Fetching existing users...');
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) throw listError;

        console.log(`Found ${users.length} users. Deleting...`);

        for (const user of users) {
            const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
            if (deleteError) {
                console.error(`Failed to delete user ${user.email}:`, deleteError.message);
            } else {
                console.log(`Deleted user: ${user.email}`);
            }
        }

        // 2. Create Master Account
        console.log('Creating master account...');
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: 'master@master.com',
            password: '1111',
            email_confirm: true
        });

        if (createError) throw createError;

        console.log('Master account created successfully!');
        console.log('ID:', newUser.user.id);
        console.log('Email:', newUser.user.email);

    } catch (error) {
        console.error('Reset failed:', error.message);
        process.exit(1);
    }
}

resetAccounts();
