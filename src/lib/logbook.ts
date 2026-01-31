export interface LogEntry {
    id: string;
    vesselName: string;
    author: string;
    content: string;
    timestamp: string;
    loa?: string;
    beam?: string;
    masterName?: string;
    arrivalDate?: string;
    cruiseLine?: string;
    traineeName?: string;
}

// Helper to get current user
function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('fiordland_user');
        if (userStr) {
            return JSON.parse(userStr);
        }
    } catch (e) {
        console.error('Failed to get current user', e);
    }
    return null;
}

export async function addLogEntry(entry: Omit<LogEntry, 'id' | 'timestamp'>) {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('User not logged in');
    }

    const newEntry: LogEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
    };

    // Save to server database with type 'entry_exit'
    try {
        const response = await fetch('/api/checklists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                type: 'entry_exit',
                data: {
                    vesselName: entry.vesselName,
                    author: entry.author,
                    content: entry.content,
                    loa: entry.loa,
                    beam: entry.beam,
                    masterName: entry.masterName,
                    arrivalDate: entry.arrivalDate,
                    cruiseLine: entry.cruiseLine,
                    traineeName: entry.traineeName
                },
                pdf_url: null,
                email_sent: false,
                archived: false
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save log entry');
        }

        return newEntry;
    } catch (error) {
        console.error('Failed to save log entry to server:', error);
        throw error;
    }
}

export async function deleteLogEntry(id: string) {
    // Note: The server API doesn't have a delete endpoint yet
    // For now, we'll update the entry to mark it as archived
    try {
        const response = await fetch(`/api/checklists/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                archived: true,
                archived_at: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Failed to delete log entry');
        }
    } catch (error) {
        console.error('Failed to delete log entry:', error);
        throw error;
    }
}

// Legacy localStorage functions - kept for compatibility but deprecated
export function getLogEntries(): LogEntry[] {
    console.warn('getLogEntries is deprecated - use getChecklists from db.ts instead');
    return [];
}

export function getUniqueVessels(): string[] {
    console.warn('getUniqueVessels is deprecated');
    return [];
}
