import { openDB, type DBSchema } from 'idb';
import { supabase, isSupabaseConfigured } from './supabase';

interface FiordlandDB extends DBSchema {
    checklists: {
        key: number;
        value: {
            id?: number;
            userId?: string; // Added for multi-user support
            type: 'passage-plan' | 'pre-entry' | 'combined' | 'peer-review';
            createdAt: Date;
            data: any;
            synced: boolean;
            signature?: string;
            emailSent?: boolean;
            archived?: boolean;
            archivedAt?: Date;
        };
        indexes: { 'by-date': Date, 'by-user': string };
    };
}

const DB_NAME = 'fiordland-db';

async function getCurrentUserId(): Promise<string | null> {
    if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession();
        return data.session?.user.id || null;
    }
    const mock = localStorage.getItem('mock_user');
    return mock ? JSON.parse(mock).id : null;
}

export async function initDB() {
    return openDB<FiordlandDB>(DB_NAME, 2, {
        upgrade(db, oldVersion, _newVersion, transaction) {
            let store;
            if (oldVersion < 1) {
                store = db.createObjectStore('checklists', {
                    keyPath: 'id',
                    autoIncrement: true,
                });
                store.createIndex('by-date', 'createdAt');
            } else {
                store = transaction.objectStore('checklists');
            }

            if (oldVersion < 2) {
                // Add index for user filtering if it doesn't exist
                if (!store.indexNames.contains('by-user')) {
                    store.createIndex('by-user', 'userId');
                }
            }
        },
    });
}

export async function saveChecklist(checklist: Omit<FiordlandDB['checklists']['value'], 'id' | 'synced'>) {
    const userId = await getCurrentUserId();

    // Supabase Mode
    if (isSupabaseConfigured && supabase && userId) {
        // We need to map our object to SQL columns, or store valid JSON
        // For simplicity in this demo, we assume 'data' column is JSONB
        const { data, error } = await supabase.from('checklists').insert({
            user_id: userId,
            type: checklist.type,
            created_at: checklist.createdAt.toISOString(),
            data: checklist.data,
            synced: true,
            email_sent: checklist.emailSent,
            archived: checklist.archived,
            archived_at: checklist.archivedAt?.toISOString()
        }).select();

        if (error) {
            console.error("Supabase Save Error:", error);
            // Fallback to local? Or throw?
            // For now, let's throw so we know it failed
            throw error;
        }
        return data[0].id;
    }

    // Local IDB Mode
    const db = await initDB();
    return db.add('checklists', { ...checklist, userId: userId || 'anonymous', synced: false });
}

export async function getChecklists() {
    const userId = await getCurrentUserId();

    // Supabase Mode
    if (isSupabaseConfigured && supabase && userId) {
        const { data, error } = await supabase
            .from('checklists')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false }); // Recent first

        if (error) {
            console.error("Supabase Fetch Error:", error);
            return [];
        }

        // Map back to our interface
        return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            type: d.type,
            createdAt: new Date(d.created_at),
            data: d.data,
            synced: true,
            emailSent: d.email_sent,
            archived: d.archived,
            archivedAt: d.archived_at ? new Date(d.archived_at) : undefined
        }));
    }

    // Local IDB Mode
    const db = await initDB();
    const all = await db.getAllFromIndex('checklists', 'by-date');

    // Filter by user locally
    if (userId) {
        return all.filter(c => c.userId === userId);
    }
    return all;
}

export async function getUnsyncedChecklists() {
    if (isSupabaseConfigured) return []; // No need to sync if using live DB
    const db = await initDB();
    const all = await db.getAll('checklists');
    return all.filter(c => !c.synced);
}

export async function markSynced(id: number) {
    if (isSupabaseConfigured) return;
    const db = await initDB();
    const item = await db.get('checklists', id);
    if (item) {
        item.synced = true;
        await db.put('checklists', item);
    }
}

export async function updateChecklist(id: number, updates: Partial<FiordlandDB['checklists']['value']>) {
    // const userId = await getCurrentUserId();

    if (isSupabaseConfigured && supabase) {
        // Map updates to SQL columns
        const sqlUpdates: any = {};
        if (updates.emailSent !== undefined) sqlUpdates.email_sent = updates.emailSent;
        if (updates.archived !== undefined) sqlUpdates.archived = updates.archived;
        if (updates.archivedAt) sqlUpdates.archived_at = updates.archivedAt.toISOString();
        if (updates.data) sqlUpdates.data = updates.data;

        const { error } = await supabase
            .from('checklists')
            .update(sqlUpdates)
            .eq('id', id); // Row Level Security ensures they can only update their own

        if (error) console.error("Update failed", error);
        return;
    }

    const db = await initDB();
    // IDB keys are numbers, Supabase IDs might be UUIDs. 
    // This dual-mode expects IDs to match the system.
    // If we are in IDB mode, id is number.
    const item = await db.get('checklists', id as number);
    if (item) {
        const updatedItem = { ...item, ...updates };
        await db.put('checklists', updatedItem);
    }
}

export async function deleteChecklist(id: number) {
    if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('checklists').delete().eq('id', id);
        if (error) console.error("Delete failed", error);
        return;
    }

    const db = await initDB();
    await db.delete('checklists', id as number);
}
