import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, ArrowUpDown, UserPlus, X, Plus, Save, BookOpen, History } from 'lucide-react';
import { CHECKLISTS } from '../lib/data';
import { saveChecklist, updateChecklist, getChecklists, getChecklist } from '../lib/db';
import SignaturePad from '../components/SignaturePad';
import { generatePDF } from '../lib/pdf';
import { uploadPdfReport } from '../lib/storage';
import { SHIPS, type ShipData } from '../lib/ships';
import { addLogEntry, type LogEntry } from '../lib/logbook';
import { LogEntryTable } from '../components/LogEntryTable';

function VesselNameInput({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [customShips, setCustomShips] = useState<ShipData[]>(() => {
        try {
            const saved = localStorage.getItem('custom_ships');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [isAddingOpen, setIsAddingOpen] = useState(false);
    const [newShip, setNewShip] = useState<Partial<ShipData>>({});

    const allShips = [...customShips, ...SHIPS];

    // Filter suggestions based on input
    const suggestions = value && value.length > 0
        ? allShips.filter(s => s.name.toLowerCase().includes(value.toLowerCase()))
        : [];

    const handleSelect = (shipName: string) => {
        onChange(shipName);
        setShowSuggestions(false);
    };

    const selectedShip = allShips.find(s => s.name.toLowerCase() === value?.toLowerCase());
    const showAddButton = value && value.length > 0 && !selectedShip;

    const handleAddNew = () => {
        setNewShip({ name: value, cruiseLine: '', imo: '', length: '', beam: '', grossTonnage: '', draft: '' });
        setIsAddingOpen(true);
        setShowSuggestions(false);
    };

    const saveNewShip = () => {
        if (!newShip.name) return;

        const shipToAdd: ShipData = {
            name: newShip.name || '',
            cruiseLine: newShip.cruiseLine || '',
            imo: newShip.imo || '',
            length: newShip.length || '',
            beam: newShip.beam || '',
            grossTonnage: newShip.grossTonnage || '',
            draft: newShip.draft || ''
        };

        const updated = [...customShips, shipToAdd];
        setCustomShips(updated);
        localStorage.setItem('custom_ships', JSON.stringify(updated));

        onChange(shipToAdd.name);
        setIsAddingOpen(false);
    };

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyEntries, setHistoryEntries] = useState<LogEntry[]>([]);

    const handleViewHistory = async () => {
        if (!selectedShip) return;
        setIsHistoryOpen(true);
        setHistoryEntries([]); // Clear while loading

        try {
            // Fetch ALL log entries from server
            const allLogs = await getChecklists('entry_exit');

            // Filter strictly by vessel name on client side
            const filtered = allLogs
                .map((d: any) => ({
                    id: d.id.toString(),
                    timestamp: d.createdAt.toISOString(),
                    vesselName: d.data?.vesselName || 'Unknown',
                    author: d.data?.author || d.userId || 'Unknown',
                    content: d.data?.notes || d.data?.content || '',
                    loa: d.data?.loa,
                    beam: d.data?.beam,
                    masterName: d.data?.masterName,
                    arrivalDate: d.data?.arrivalDate,
                    cruiseLine: d.data?.cruiseLine,
                    traineeName: d.data?.traineeName
                }))
                .filter((e: LogEntry) => e.vesselName.toLowerCase() === selectedShip.name.toLowerCase())
                .sort((a: LogEntry, b: LogEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            setHistoryEntries(filtered);
        } catch (e) {
            console.error("Failed to load history", e);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2 relative">
                <div className="relative flex-1">
                    <input
                        type="text"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal p-3 border"
                        value={value}
                        onChange={(e) => {
                            onChange(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Start typing vessel name..."
                        autoComplete="off"
                    />

                    {showSuggestions && suggestions.length > 0 && !selectedShip && (
                        <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                            {suggestions.map((ship, idx) => (
                                <button
                                    key={`${ship.imo}-${idx}`}
                                    onClick={() => handleSelect(ship.name)}
                                    className="w-full text-left px-4 py-3 hover:bg-teal-50 transition-colors border-b border-gray-50 last:border-none flex justify-between items-center group"
                                >
                                    <span className="font-medium text-gray-900 group-hover:text-brand-teal">{ship.name}</span>
                                    <span className="text-xs text-gray-500">{ship.cruiseLine}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {showAddButton && (
                    <button
                        onClick={handleAddNew}
                        className="bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white p-3 rounded-lg border border-brand-teal/20 transition-all flex items-center gap-2 font-medium whitespace-nowrap"
                        title="Add this vessel to database"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Add Vessel</span>
                    </button>
                )}
            </div>

            {/* Add Vessel Modal */}
            {isAddingOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-fiordland-900 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <Plus className="w-5 h-5 text-brand-teal" />
                                Add New Vessel
                            </h3>
                            <button onClick={() => setIsAddingOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Vessel Name</label>
                                <input
                                    type="text"
                                    value={newShip.name}
                                    onChange={e => setNewShip({ ...newShip, name: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 focus:ring-brand-teal focus:border-brand-teal"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Cruise Line</label>
                                    <input
                                        type="text"
                                        value={newShip.cruiseLine}
                                        onChange={e => setNewShip({ ...newShip, cruiseLine: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 focus:ring-brand-teal focus:border-brand-teal"
                                        placeholder="e.g. Royal Caribbean"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">IMO Number</label>
                                    <input
                                        type="text"
                                        value={newShip.imo}
                                        onChange={e => setNewShip({ ...newShip, imo: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 focus:ring-brand-teal focus:border-brand-teal"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Length (m)</label>
                                    <input
                                        type="text"
                                        value={newShip.length}
                                        onChange={e => setNewShip({ ...newShip, length: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 focus:ring-brand-teal focus:border-brand-teal"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Beam (m)</label>
                                    <input
                                        type="text"
                                        value={newShip.beam}
                                        onChange={e => setNewShip({ ...newShip, beam: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 focus:ring-brand-teal focus:border-brand-teal"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Gross Tonnage</label>
                                    <input
                                        type="text"
                                        value={newShip.grossTonnage}
                                        onChange={e => setNewShip({ ...newShip, grossTonnage: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 focus:ring-brand-teal focus:border-brand-teal"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Draft (m)</label>
                                    <input
                                        type="text"
                                        value={newShip.draft}
                                        onChange={e => setNewShip({ ...newShip, draft: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 focus:ring-brand-teal focus:border-brand-teal"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                            <button
                                onClick={() => setIsAddingOpen(false)}
                                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveNewShip}
                                className="px-6 py-2 bg-brand-teal text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Vessel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedShip && (
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-brand-teal rounded text-white">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sky-900">Vessel Identified</span>
                        </div>
                        <button
                            onClick={handleViewHistory}
                            className="flex items-center gap-1.5 text-xs font-bold text-brand-teal hover:text-teal-700 bg-white border border-teal-100 px-3 py-1.5 rounded-lg shadow-sm transition-all hover:shadow"
                        >
                            <History className="w-3.5 h-3.5" />
                            View History
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-sky-700 block mb-0.5">Length</span>
                            <span className="text-sm font-medium text-gray-900">{selectedShip.length}m</span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-sky-700 block mb-0.5">Beam</span>
                            <span className="text-sm font-medium text-gray-900">{selectedShip.beam}m</span>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-sky-700 block mb-0.5">Cruise Line</span>
                            <span className="text-sm font-medium text-gray-900 truncate block" title={selectedShip.cruiseLine}>{selectedShip.cruiseLine}</span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-sky-700 block mb-0.5">IMO</span>
                            <span className="text-sm font-medium text-gray-900 font-mono">{selectedShip.imo}</span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-sky-700 block mb-0.5">Gross Tonnage</span>
                            <span className="text-sm font-medium text-gray-900">{selectedShip.grossTonnage}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* History Modal */}
            {isHistoryOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="bg-fiordland-900 px-6 py-4 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <History className="w-5 h-5 text-brand-teal" />
                                    {selectedShip?.name} - Log History
                                </h3>
                            </div>
                            <button onClick={() => setIsHistoryOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            <LogEntryTable
                                entries={historyEntries}
                                onEntriesChange={() => setHistoryEntries([])}
                            />
                        </div>

                        <div className="bg-white px-6 py-4 border-t border-gray-100 flex justify-end shrink-0">
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const PILOTS = ["Premraj Pillai", "Josh Osborne", "Sumanth Surendran", "Lawrence Clark", "Scott Young"];
const TRAINEES = ["Julien Charptner", "Andrew Kerr Fox"];

export default function ChecklistForm() {
    const { type, id } = useParams();
    const navigate = useNavigate();
    // @ts-ignore
    const schema = CHECKLISTS[type];

    const [formData, setFormData] = useState<any>({});
    const [signatures, setSignatures] = useState<any>({});
    const [names, setNames] = useState<any>({});
    const [showTrainee, setShowTrainee] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isRouteReversed, setIsRouteReversed] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [checklistId, setChecklistId] = useState<number | null>(id ? parseInt(id) : null);
    const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null);

    // Initial Data Load for Edit Mode
    useEffect(() => {
        if (id) {
            loadchecklistData(parseInt(id));
        }
    }, [id]);

    const loadchecklistData = async (cid: number) => {
        try {
            // @ts-ignore
            const checklist = await getChecklist(cid);
            if (checklist) {
                setFormData(checklist.data || {});
                setSignatures(checklist.data?.signatures || {});
                setNames(checklist.data?.names || {});
                setDate(checklist.data?.date?.split('T')[0] || new Date().toISOString().split('T')[0]);
                setShowTrainee(checklist.data?.showTrainee || false);
                setUploadedPdfUrl(checklist.pdfUrl || null);
                // Ensure checklistId is set
                setChecklistId(cid);
            }
        } catch (e) {
            console.error("Failed to load checklist", e);
            alert("Could not load checklist for editing");
        }
    };

    // Log Book State
    const [isLogOpen, setIsLogOpen] = useState(false);
    const [logContent, setLogContent] = useState('');

    const handleAddLog = async () => {
        const vesselName = formData.header?.vesselName;
        if (!vesselName) {
            alert("Please enter a vessel name first.");
            return;
        }

        const author = names.pilot || names.master || "Pilot";

        // Find ship details
        let ship = SHIPS.find(s => s.name.toLowerCase() === vesselName.toLowerCase());
        if (!ship) {
            try {
                const custom = JSON.parse(localStorage.getItem('custom_ships') || '[]');
                ship = custom.find((s: any) => s.name.toLowerCase() === vesselName.toLowerCase());
            } catch (e) { }
        }

        try {
            await addLogEntry({
                vesselName,
                author,
                content: logContent,
                loa: ship?.length,
                beam: ship?.beam,
                masterName: names.master || '',
                arrivalDate: date,
                cruiseLine: ship?.cruiseLine,
                traineeName: names.trainee
            });
        } catch (error) {
            console.error('Failed to save log entry:', error);
            alert('Failed to save log entry. Please try again.');
            return; // Don't close the modal if save failed
        }

        setLogContent('');
        setIsLogOpen(false);
        alert("Log entry saved.");
    };

    if (!schema) return <div>Invalid checklist type</div>;

    const handleInputChange = (sectionId: string, fieldId: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [sectionId]: {
                ...prev[sectionId],
                [fieldId]: value
            }
        }));
    };

    const handleSaveProgress = async () => {
        setSaving(true);
        try {
            // Automatic Briefing Checkbox Logic (Only for Combined Passage Plan)
            const updatedFormData = { ...formData };
            if (type === 'combined') {
                const routes = updatedFormData['header']?.['plannedRoute'] || [];

                // Initialize briefings section if missing
                if (!updatedFormData['briefings']) updatedFormData['briefings'] = {};

                // Map Routes to Briefing Indices
                // 0: Milford
                // 1: Doubtful / Thompson
                // 2: Breaksea / Dusky
                // 3: Stewart Island

                const hasMilford = routes.includes('Milford');
                const hasThompson = routes.some((r: string) => r.includes('Thompson') || r.includes('Doubtful'));
                const hasBreaksea = routes.some((r: string) => r.includes('Breaksea') || r.includes('Dusky'));
                const hasStewart = routes.includes('Stewart Island');

                if (hasMilford) updatedFormData['briefings']['item-0'] = true;
                if (hasThompson) updatedFormData['briefings']['item-1'] = true;
                if (hasBreaksea) updatedFormData['briefings']['item-2'] = true;
                if (hasStewart) updatedFormData['briefings']['item-3'] = true;

                setFormData(updatedFormData);
            }

            // Save or Update
            let id = checklistId;
            const dataToSave = { ...updatedFormData, signatures, names, date, showTrainee };

            if (id) {
                await updateChecklist(id, dataToSave);
            } else {
                id = await saveChecklist({
                    type: type as any,
                    createdAt: new Date(),
                    data: dataToSave,
                });
                setChecklistId(id);
            }

            // Clear specific sections for the next leg workflow
            const sectionsToClear = ['vessel-elements', 'navigation-elements', 'brm-elements', 'pilots-radar', 'pilots-ecdis'];
            const nextFormData = { ...updatedFormData };

            sectionsToClear.forEach(secId => {
                if (nextFormData[secId]) {
                    nextFormData[secId] = {};
                }
            });

            setFormData(nextFormData);

            alert('Progress saved. Checklist items cleared for next leg.');
        } catch (e) {
            console.error(e);
            alert('Failed to save progress');
        } finally {
            setSaving(false);
        }
    };

    const handleComplete = async () => {
        setSaving(true);
        try {
            // Apply the same logic just in case
            const updatedFormData = { ...formData };
            if (type === 'combined') {
                const routes = updatedFormData['header']?.['plannedRoute'] || [];
                if (!updatedFormData['briefings']) updatedFormData['briefings'] = {};

                if (routes.includes('Milford')) updatedFormData['briefings']['item-0'] = true;
                if (routes.some((r: string) => r.includes('Thompson') || r.includes('Doubtful'))) updatedFormData['briefings']['item-1'] = true;
                if (routes.some((r: string) => r.includes('Breaksea') || r.includes('Dusky'))) updatedFormData['briefings']['item-2'] = true;
                if (routes.includes('Stewart Island')) updatedFormData['briefings']['item-3'] = true;
                setFormData(updatedFormData);
            }

            // Generate PDF Blob for upload
            // @ts-ignore
            const pdfBlob = generatePDF({ data: { ...updatedFormData, signatures, names, date, showTrainee } }, schema, 'blob');
            let uploadedPdfUrl = undefined;
            if (pdfBlob) {
                const fileName = `${type}-${Date.now()}.pdf`;
                const url = await uploadPdfReport(pdfBlob as Blob, fileName);
                if (url) uploadedPdfUrl = url;
            }

            // Save or Update to DB
            let id = checklistId;
            const dataToSave = { ...updatedFormData, signatures, names, date, showTrainee };

            if (id) {
                await updateChecklist(id, { data: dataToSave, pdfUrl: uploadedPdfUrl });
            } else {
                await saveChecklist({
                    type: type as any,
                    createdAt: new Date(),
                    data: dataToSave,
                    pdfUrl: uploadedPdfUrl
                });
            }

            // Generate PDF for download
            generatePDF({ data: dataToSave }, schema);

            navigate('/');
        } catch (e) {
            console.error(e);
            alert('Failed to complete checklist');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <button
                onClick={() => navigate('/')}
                className="flex items-center text-fiordland-500 hover:text-fiordland-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-fiordland-900">{schema.title}</h1>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full md:w-auto self-start rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal p-3 border font-medium text-fiordland-900"
                    />
                </div>

                {schema.description && (
                    <div className="bg-red-50 text-red-800 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <p className="font-medium">{schema.description}</p>
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {/* Main Sections */}
                {schema.sections.map((section: any) => (
                    <RenderSection key={section.id} section={section} formData={formData} handleInputChange={handleInputChange} isRouteReversed={isRouteReversed} setIsRouteReversed={setIsRouteReversed} />
                ))}

                {/* Main Signatures */}
                {/* Main Signatures with Names */}
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-fiordland-800">Signatures</h2>
                        {!showTrainee && (
                            <button
                                onClick={() => setShowTrainee(true)}
                                className="flex items-center gap-2 text-sm font-medium text-brand-teal hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg transition-colors border border-teal-100"
                            >
                                <UserPlus className="w-4 h-4" />
                                Add Trainee Pilot
                            </button>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Master */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Master's Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal p-3 border"
                                    placeholder="Enter Master's Name"
                                    value={names.master || ''}
                                    onChange={(e) => setNames({ ...names, master: e.target.value })}
                                />
                            </div>
                            <SignaturePad
                                label="Master Signature"
                                onChange={(data) => setSignatures((prev: any) => ({ ...prev, 'Master': data }))}
                            />
                        </div>

                        {/* Pilot */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Pilot's Name</label>
                                <select
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal p-3 border bg-white"
                                    value={names.pilot || ''}
                                    onChange={(e) => setNames({ ...names, pilot: e.target.value })}
                                >
                                    <option value="">Select Pilot...</option>
                                    {PILOTS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <SignaturePad
                                label="Pilot Signature"
                                onChange={(data) => setSignatures((prev: any) => ({ ...prev, 'Pilot': data }))}
                            />
                        </div>

                        {/* Trainee Pilot */}
                        {showTrainee && (
                            <div className="md:col-span-2 mt-8 pt-8 border-t border-gray-100 relative bg-gray-50 rounded-xl p-6">
                                <button
                                    onClick={() => setShowTrainee(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <h3 className="text-lg font-semibold text-fiordland-800 mb-4 flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-brand-teal" />
                                    Trainee Pilot
                                </h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Trainee's Name</label>
                                        <select
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal p-3 border bg-white"
                                            value={names.trainee || ''}
                                            onChange={(e) => setNames({ ...names, trainee: e.target.value })}
                                        >
                                            <option value="">Select Trainee...</option>
                                            {TRAINEES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <SignaturePad
                                        label="Trainee Signature"
                                        onChange={(data) => setSignatures((prev: any) => ({ ...prev, 'Trainee': data }))}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Post Signature Sections (e.g. Pre-Entry) */}
                {schema.finalSections && schema.finalSections.map((section: any) => (
                    <RenderSection key={section.id} section={section} formData={formData} handleInputChange={handleInputChange} isRouteReversed={isRouteReversed} setIsRouteReversed={setIsRouteReversed} />
                ))}

                {/* Final Signatures */}
                {schema.finalSignatures && (
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-6 text-fiordland-800">Verification Signatures</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {schema.finalSignatures.map((role: string) => (
                                <SignaturePad
                                    key={role}
                                    label={`${role}`}
                                    onChange={(data) => setSignatures((prev: any) => ({ ...prev, [role]: data }))}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:static lg:bg-transparent lg:border-none lg:p-0 flex justify-end gap-3">
                <button
                    onClick={() => setIsLogOpen(true)}
                    className="bg-white text-fiordland-700 border border-fiordland-200 px-6 py-4 rounded-xl font-bold shadow-sm hover:bg-fiordland-50 transition-all flex items-center justify-center gap-2"
                >
                    <BookOpen className="w-5 h-5" />
                    <span className="hidden sm:inline">Log Book</span>
                </button>
                <button
                    onClick={handleSaveProgress}
                    disabled={saving}
                    className="w-full lg:w-auto bg-white text-brand-teal border border-brand-teal px-6 py-4 rounded-xl font-bold shadow-sm hover:bg-teal-50 transition-all flex items-center justify-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    Save Progress
                </button>

                <button
                    onClick={handleComplete}
                    disabled={saving}
                    className="w-full lg:w-auto bg-brand-teal text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
                >
                    {saving ? 'Processing...' : (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Sign & Complete
                        </>
                    )}
                </button>
            </div>

            {/* Log Book Modal */}
            {isLogOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-fiordland-900 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-brand-teal" />
                                Add Log Entry
                            </h3>
                            <button onClick={() => setIsLogOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm font-medium">
                                Vessel: {formData.header?.vesselName || "Unknown"}
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Log Note</label>
                                <textarea
                                    value={logContent}
                                    onChange={e => setLogContent(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-brand-teal focus:border-brand-teal h-32 p-3"
                                    placeholder="Enter observation, incident, or note..."
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                            <button
                                onClick={() => setIsLogOpen(false)}
                                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddLog}
                                className="px-6 py-2 bg-brand-teal text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function RenderSection({ section, formData, handleInputChange, isRouteReversed, setIsRouteReversed }: any) {
    if (section.type === 'grading') {
        return (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-fiordland-800">{section.title}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left p-4 font-semibold text-gray-700 w-1/3">Task</th>
                                <th className="text-center p-4 font-semibold text-gray-700 w-24">Yes/No</th>
                                <th className="text-center p-4 font-semibold text-gray-700 w-24">Grade (1-5)</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Comment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {section.items.map((item: any) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 align-top">
                                        <div className="font-bold text-gray-900 text-base mb-1">{item.task}</div>
                                        <div className="text-xs text-gray-500 italic leading-relaxed">{item.subtext}</div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal p-2 text-center uppercase"
                                            maxLength={3}
                                            value={formData[section.id]?.[`${item.id}_yesNo`] || ''}
                                            onChange={(e) => handleInputChange(section.id, `${item.id}_yesNo`, e.target.value)}
                                        />
                                    </td>
                                    <td className="p-4 align-top">
                                        <input
                                            type="number"
                                            min="1"
                                            max="5"
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal p-2 text-center font-bold"
                                            value={formData[section.id]?.[`${item.id}_grade`] || ''}
                                            onChange={(e) => handleInputChange(section.id, `${item.id}_grade`, e.target.value)}
                                        />
                                    </td>
                                    <td className="p-4 align-top">
                                        <textarea
                                            rows={2}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal p-2 text-sm"
                                            placeholder="Enter comments..."
                                            value={formData[section.id]?.[`${item.id}_comment`] || ''}
                                            onChange={(e) => handleInputChange(section.id, `${item.id}_comment`, e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        );
    }

    if (section.type === 'info') {
        return (
            <section className="bg-blue-50/50 rounded-2xl p-6 shadow-sm border border-blue-100">
                <h2 className="text-lg font-semibold mb-4 text-fiordland-800">{section.title}</h2>
                <div className="space-y-2 text-sm text-gray-700 pl-4 border-l-4 border-blue-200">
                    {section.text.map((line: string, i: number) => <p key={i}>{line}</p>)}
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-fiordland-800 border-b border-gray-100 pb-2">{section.title}</h2>

            {section.description && (
                <div className="bg-red-50 text-red-800 p-4 rounded-xl flex items-start gap-3 border border-red-100 mb-4">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p className="font-medium">{section.description}</p>
                </div>
            )}

            {section.instruction && <p className="text-sm text-gray-500 mb-4 italic">{section.instruction}</p>}

            <div className="flex flex-wrap -mx-2 row-gap-4">
                {section.fields?.map((field: any) => {
                    const widthClass = field.width === 'quarter' ? 'w-full md:w-1/4 px-2 mb-4' : 'w-full px-2 mb-4';

                    if (field.id === 'vesselName') {
                        return (
                            <div key={field.id} className={`${widthClass} space-y-1 relative z-20`}>
                                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                <VesselNameInput
                                    value={formData[section.id]?.[field.id] || ''}
                                    onChange={(val) => handleInputChange(section.id, field.id, val)}
                                />
                            </div>
                        );
                    }

                    if (field.type === 'route-selector') {
                        const routes = isRouteReversed
                            ? ['Dusky to Breaksea', 'Doubtful to Thompson', 'Milford', 'Stewart Island']
                            : ['Milford', 'Thompson to Doubtful', 'Breaksea to Dusky', 'Stewart Island'];

                        const currentValues = formData[section.id]?.[field.id] || [];

                        return (
                            <div key={field.id} className={`${widthClass}`}>
                                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-700">{field.label}</label>
                                        <button
                                            onClick={() => setIsRouteReversed(!isRouteReversed)}
                                            className="flex items-center gap-2 bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold px-4 py-2 rounded-lg transition-colors border border-teal-200 shadow-sm"
                                        >
                                            <ArrowUpDown className="w-4 h-4" />
                                            {isRouteReversed ? 'Switch to North-South' : 'Switch to South-North'}
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {routes.map((route) => (
                                            <label key={route} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-brand-teal transition-all shadow-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={currentValues.includes(route)}
                                                    onChange={(e) => {
                                                        const newValues = e.target.checked
                                                            ? [...currentValues, route]
                                                            : currentValues.filter((v: string) => v !== route);
                                                        handleInputChange(section.id, field.id, newValues);
                                                    }}
                                                    className="w-7 h-7 rounded text-brand-teal focus:ring-brand-teal border-gray-300"
                                                />
                                                <span className="text-gray-900 font-medium">{route}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={field.id} className={`${widthClass} space-y-1`}>
                            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal p-3 border h-32"
                                    onChange={(e) => handleInputChange(section.id, field.id, e.target.value)}
                                    placeholder="Enter notes here..."
                                    value={formData[section.id]?.[field.id] || ''}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal p-3 border"
                                    onChange={(e) => handleInputChange(section.id, field.id, e.target.value)}
                                    value={formData[section.id]?.[field.id] || ''}
                                />
                            )}
                        </div>
                    );
                })}

                {section.items && (
                    <div className="w-full px-2 mt-2">
                        {section.items.map((item: string, idx: number) => (
                            <label key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData[section.id]?.[`item-${idx}`] || false}
                                    className="mt-0.5 w-7 h-7 rounded text-brand-teal focus:ring-brand-teal border-gray-300"
                                    onChange={(e) => handleInputChange(section.id, `item-${idx}`, e.target.checked)}
                                />
                                <span className="text-gray-700 group-hover:text-gray-900">{item}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
