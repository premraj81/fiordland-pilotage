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

const STORAGE_KEY = 'logbook_entries';

export function getLogEntries(vesselName?: string): LogEntry[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const entries: LogEntry[] = stored ? JSON.parse(stored) : [];
        if (vesselName) {
            return entries.filter(e => e.vesselName.toLowerCase() === vesselName.toLowerCase())
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
        return [];
    }
}

export function addLogEntry(entry: Omit<LogEntry, 'id' | 'timestamp'>) {
    const entries = getLogEntries();
    const newEntry: LogEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
    };
    entries.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
}

export function deleteLogEntry(id: string) {
    const entries = getLogEntries();
    const newEntries = entries.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
}

export function getUniqueVessels(): string[] {
    const entries = getLogEntries();
    const names = new Set(entries.map(e => e.vesselName));
    return Array.from(names).sort();
}
