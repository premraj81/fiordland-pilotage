import { openDB, type DBSchema } from 'idb';

interface FiordlandDB extends DBSchema {
    checklists: {
        key: number;
        value: {
            id?: number;
            type: 'passage-plan' | 'pre-entry' | 'combined'; // Added combined
            createdAt: Date;
            data: any;
            synced: boolean;
            signature?: string;
            emailSent?: boolean;
            archived?: boolean;
            archivedAt?: Date;
        };
        indexes: { 'by-date': Date };
    };
}

const DB_NAME = 'fiordland-db';

export async function initDB() {
    return openDB<FiordlandDB>(DB_NAME, 1, {
        upgrade(db) {
            const store = db.createObjectStore('checklists', {
                keyPath: 'id',
                autoIncrement: true,
            });
            store.createIndex('by-date', 'createdAt');
        },
    });
}

export async function saveChecklist(checklist: Omit<FiordlandDB['checklists']['value'], 'id' | 'synced'>) {
    const db = await initDB();
    return db.add('checklists', { ...checklist, synced: false });
}

export async function getChecklists() {
    const db = await initDB();
    return db.getAllFromIndex('checklists', 'by-date');
}

export async function getUnsyncedChecklists() {
    const db = await initDB();
    const all = await db.getAll('checklists');
    return all.filter(c => !c.synced);
}

export async function markSynced(id: number) {
    const db = await initDB();
    const item = await db.get('checklists', id);
    if (item) {
        item.synced = true;
        await db.put('checklists', item);
    }
}

export async function updateChecklist(id: number, updates: Partial<FiordlandDB['checklists']['value']>) {
    const db = await initDB();
    const item = await db.get('checklists', id);
    if (item) {
        const updatedItem = { ...item, ...updates };
        await db.put('checklists', updatedItem);
    }
}

export async function deleteChecklist(id: number) {
    const db = await initDB();
    await db.delete('checklists', id);
}
