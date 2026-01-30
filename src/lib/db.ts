import { openDB, type DBSchema } from 'idb';

// We now use a custom API instead of Supabase
const USE_API = true; // Flag to enable API calls

interface FiordlandDB extends DBSchema {
    checklists: {
        key: number;
        value: {
            id?: number;
            userId?: string;
            type: 'passage-plan' | 'pre-entry' | 'combined' | 'peer-review';
            createdAt: Date;
            data: any;
            synced: boolean;
            pdfUrl?: string; // Stored relative URL
            signature?: string;
            emailSent?: boolean;
            archived?: boolean;
            archivedAt?: Date;
        };
        indexes: { 'by-date': Date, 'by-user': string };
    };
}

const DB_NAME = 'fiordland-db';

// Helper to get current user from LocalStorage (managed by AuthContext)
async function getCurrentUserId(): Promise<string | null> {
    const userStr = localStorage.getItem('fiordland_user');
    if (userStr) {
        try {
            return JSON.parse(userStr).id;
        } catch (e) {
            return null;
        }
    }
    return null;
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
                if (!store.indexNames.contains('by-user')) {
                    store.createIndex('by-user', 'userId');
                }
            }
        },
    });
}

export async function saveChecklist(checklist: Omit<FiordlandDB['checklists']['value'], 'id' | 'synced'>) {
    const userId = await getCurrentUserId();

    // API Mode (Render Backend)
    if (USE_API && userId) {
        try {
            const response = await fetch('/api/checklists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    type: checklist.type,
                    data: checklist.data,
                    pdf_url: checklist.pdfUrl,
                    email_sent: checklist.emailSent,
                    archived: checklist.archived
                })
            });

            if (!response.ok) throw new Error("API Save Failed");

            const result = await response.json();
            return result.id; // Return server ID
        } catch (error) {
            console.error("API Error, falling back to local:", error);
            // Fallthrough to local save
        }
    }

    // Local IDB Mode (Offline Fallback)
    const db = await initDB();
    return db.add('checklists', { ...checklist, userId: userId || 'anonymous', synced: false });
}

export async function getChecklists(type?: string) {
    const userId = await getCurrentUserId();

    // API Mode
    if (USE_API && userId) {
        try {
            const url = new URL('/api/checklists', window.location.origin);
            if (userId) url.searchParams.append('user_id', userId);
            if (type) url.searchParams.append('type', type);

            const response = await fetch(url.toString());
            if (response.ok) {
                const data = await response.json();
                return data.map((d: any) => ({
                    ...d,
                    createdAt: new Date(d.createdAt),
                    data: d.data, // Should be object already
                    synced: true
                }));
            }
        } catch (error) {
            console.error("API Read Error:", error);
        }
    }

    // Local IDB Mode
    const db = await initDB();
    const all = await db.getAllFromIndex('checklists', 'by-date');

    // Filter locally if needed
    let filtered = all;
    if (userId) {
        // If requesting a specific type (like logbook), ignore user ID constraint? 
        // Or keep it? The requirement is Logbook = Global.
        if (type === 'entry_exit') {
            // @ts-ignore
            filtered = all.filter(c => c.type === 'entry_exit');
        } else {
            // @ts-ignore
            filtered = all.filter(c => c.userId === userId && (!type || c.type === type));
        }
    }
    return filtered;
}

export async function updateChecklist(id: number, updates: Partial<FiordlandDB['checklists']['value']>) {
    // API Mode
    if (USE_API) {
        try {
            // Note: ID in API mode is the server ID (number). 
            // If the item was created offline, it might have a local ID that doesn't exist on server yet.
            // We assume mixed usage is minimal for this demo, or handled by a separate sync process.
            await fetch(`/api/checklists/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: updates.data,
                    pdf_url: updates.pdfUrl,
                    email_sent: updates.emailSent,
                    archived: updates.archived,
                    archived_at: updates.archivedAt // Date stringify handled by JSON.stringify
                })
            });
            return;
        } catch (e) {
            console.error("Update API failed", e);
        }
    }

    const db = await initDB();
    const item = await db.get('checklists', id);
    if (item) {
        const updatedItem = { ...item, ...updates };
        await db.put('checklists', updatedItem);
    }
}

export async function deleteChecklist(id: number) {
    // Implement delete if needed (not currently used much)
    const db = await initDB();
    await db.delete('checklists', id);
}

// Unused legacy functions
export async function getUnsyncedChecklists() { return []; }
export async function markSynced(_id: number) { }
