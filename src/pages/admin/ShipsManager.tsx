import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Ship, Save, X, Search } from 'lucide-react';

interface ShipData {
    id?: number;
    name: string;
    cruise_line: string;
    imo: string;
    length: string;
    beam: string;
    gross_tonnage: string;
    draft: string;
}

const INITIAL_SHIP: ShipData = { name: '', cruise_line: '', imo: '', length: '', beam: '', gross_tonnage: '', draft: '' };

export default function ShipsManager() {
    const [ships, setShips] = useState<ShipData[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<ShipData | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchShips();
    }, []);

    const fetchShips = async () => {
        try {
            const res = await fetch('/api/ships');
            if (res.ok) setShips(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;

        try {
            const url = isNew ? '/api/ships' : `/api/ships/${editing.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editing)
            });

            if (!res.ok) throw new Error("Save failed");

            fetchShips();
            setEditing(null);
            setIsNew(false);
        } catch (err) {
            alert("Failed to save ship");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this ship?")) return;
        try {
            await fetch(`/api/ships/${id}`, { method: 'DELETE' });
            setShips(ships.filter(s => s.id !== id));
        } catch (e) { alert("Failed to delete"); }
    };

    const startEdit = (ship: ShipData) => {
        setEditing(ship);
        setIsNew(false);
    };

    const startNew = () => {
        setEditing(INITIAL_SHIP);
        setIsNew(true);
    };

    const filteredShips = ships.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.cruise_line.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Fleet Data...</div>;

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ships Database</h1>
                    <p className="text-gray-500 text-sm">Manage the pilotage fleet list.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search fleet..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 rounded-lg border-gray-300 text-sm focus:border-brand-teal focus:ring-brand-teal"
                        />
                    </div>
                    <button
                        onClick={startNew}
                        className="bg-brand-teal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Ship
                    </button>
                </div>
            </header>

            {/* Editor Modal/Panel */}
            {editing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">{isNew ? 'Add New Vessel' : 'Edit Vessel'}</h3>
                            <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-500 hover:text-red-500" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Vessel Name</label>
                                <input required type="text" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full mt-1 rounded-lg border-gray-300" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Cruise Line</label>
                                <input required type="text" value={editing.cruise_line} onChange={e => setEditing({ ...editing, cruise_line: e.target.value })} className="w-full mt-1 rounded-lg border-gray-300" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">IMO Number</label>
                                <input required type="text" value={editing.imo} onChange={e => setEditing({ ...editing, imo: e.target.value })} className="w-full mt-1 rounded-lg border-gray-300" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Gross Tonnage</label>
                                <input required type="text" value={editing.gross_tonnage} onChange={e => setEditing({ ...editing, gross_tonnage: e.target.value })} className="w-full mt-1 rounded-lg border-gray-300" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Length (m)</label>
                                <input required type="text" value={editing.length} onChange={e => setEditing({ ...editing, length: e.target.value })} className="w-full mt-1 rounded-lg border-gray-300" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Beam (m)</label>
                                <input required type="text" value={editing.beam} onChange={e => setEditing({ ...editing, beam: e.target.value })} className="w-full mt-1 rounded-lg border-gray-300" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Draft (m)</label>
                                <input required type="text" value={editing.draft} onChange={e => setEditing({ ...editing, draft: e.target.value })} className="w-full mt-1 rounded-lg border-gray-300" />
                            </div>

                            <div className="col-span-2 mt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="bg-brand-teal text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Save Ship
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                        <tr>
                            <th className="p-4">Vessel Name</th>
                            <th className="p-4">Details</th>
                            <th className="p-4">Dimensions</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredShips.map(ship => (
                            <tr key={ship.id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center"><Ship className="w-4 h-4" /></div>
                                    {ship.name}
                                </td>
                                <td className="p-4 text-gray-600">
                                    <div className="text-xs text-gray-400">Owner</div>
                                    <div className="font-medium">{ship.cruise_line}</div>
                                    <div className="text-xs mt-1 text-gray-400">IMO: {ship.imo}</div>
                                </td>
                                <td className="p-4 text-gray-600">
                                    <div>L: {ship.length}m / B: {ship.beam}m</div>
                                    <div className="text-xs text-gray-400">Draft: {ship.draft}m</div>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => startEdit(ship)} className="p-2 text-gray-400 hover:text-brand-teal hover:bg-teal-50 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(ship.id!)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
