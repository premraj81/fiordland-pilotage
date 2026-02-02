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

async function getCurrentUserEmail(): Promise<string | null> {
    const userStr = localStorage.getItem('fiordland_user');
    if (userStr) {
        try {
            return JSON.parse(userStr).email;
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
    const userEmail = await getCurrentUserEmail();
    const isAdmin = userEmail === 'fiordlandpilotage@gmail.com';

    // Offline-First Strategy: Bidirectional Sync (Push + Pull)
    const db = await initDB();

    if (USE_API && userId) {
        try {
            // 1. PUSH: Upload Unsynced Local Items
            if (window.navigator.onLine) {
                const allLocal = await db.getAll('checklists');
                const unsynced = allLocal.filter(c => !c.synced && c.userId === userId);

                for (const item of unsynced) {
                    try {
                        const response = await fetch('/api/checklists', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                user_id: userId,
                                type: item.type,
                                data: item.data,
                                pdf_url: item.pdfUrl,
                                email_sent: item.emailSent,
                                archived: item.archived
                            })
                        });
                        if (response.ok) {
                            // If successful, delete local temp item so it can be re-fetched cleanly
                            if (item.id) await db.delete('checklists', item.id);
                        }
                    } catch (e) {
                        // Ignore
                    }
                }
            }

            // 2. PULL: Fetch Server Data & Update Content
            const url = new URL('/api/checklists', window.location.origin);
            if (userId) url.searchParams.append('user_id', userId);
            if (type) url.searchParams.append('type', type);

            const response = await fetch(url.toString());
            if (response.ok) {
                const serverData = await response.json();

                // Cache Server Data to Local DB
                const tx = db.transaction('checklists', 'readwrite');

                // Fetch current unsynced IDs to prevent overwrite
                const currentUnsyncedIds = new Set(
                    (await db.getAll('checklists'))
                        .filter(c => !c.synced)
                        .map(c => c.id)
                );

                for (const d of serverData) {
                    if (currentUnsyncedIds.has(d.id)) {
                        continue;
                    }
                    await tx.store.put({
                        ...d,
                        createdAt: new Date(d.createdAt),
                        data: d.data,
                        synced: true,
                        id: d.id
                    });
                }
                await tx.done;
            }
        } catch (error) {
            console.error("Sync Failed (Offline?):", error);
        }
    }

    // Always valid source of truth is now Local DB (which is cached from server)
    const all = await db.getAllFromIndex('checklists', 'by-date');

    // Filter
    let filtered = all;
    if (userId && !isAdmin) {
        // Strict filtering for regular users
        if (type === 'entry_exit') {
            // @ts-ignore
            filtered = all.filter(c => c.type === 'entry_exit');
        } else {
            // @ts-ignore
            // FORCE STRING COMPARISON TO AVOID TYPE MISMATCHES
            filtered = all.filter(c => String(c.userId) === String(userId) && (!type || c.type === type));
        }
    } else if (isAdmin) {
        // Admin sees EVERYTHING
        if (type) {
            // @ts-ignore
            filtered = all.filter(c => c.type === type);
        } else {
            filtered = all;
        }
    }
    // If no userId (not logged in), we return everything? Or nothing?
    // Current logic: filtered = all. (So anonymous sees everything local). Correct for offline.

    return filtered;
}

export async function getChecklist(id: number) {
    if (USE_API) {
        try {
            const response = await fetch(`/api/checklists/${id}`);
            if (response.ok) {
                const d = await response.json();
                return {
                    ...d,
                    createdAt: new Date(d.createdAt),
                    data: d.data,
                    synced: true
                };
            }
        } catch (error) {
            console.error("API Read Error:", error);
        }
    }
    const db = await initDB();
    return db.get('checklists', id);
}

export async function updateChecklist(id: number, updates: Partial<FiordlandDB['checklists']['value']>) {
    // API Mode
    if (USE_API) {
        try {
            await fetch(`/api/checklists/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: updates.data,
                    pdf_url: updates.pdfUrl,
                    email_sent: updates.emailSent,
                    archived: updates.archived,
                    archived_at: updates.archivedAt
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
    const userId = await getCurrentUserId();
    if (USE_API && userId) {
        try {
            await fetch(`/api/checklists/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });
        } catch (e) {
            console.error("API Delete failed", e);
        }
    }

    // Always delete locally
    const db = await initDB();
    await db.delete('checklists', id);
}

// Unused legacy functions
export async function getUnsyncedChecklists() { return []; }
export async function markSynced(_id: number) { }
