import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        // Delete items in trash older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { error } = await supabase
            .from('links')
            .delete()
            .eq('status', 'trash')
            .lt('updated_at', thirtyDaysAgo.toISOString());

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Cleanup complete' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
