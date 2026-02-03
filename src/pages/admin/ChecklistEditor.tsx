import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';

interface ChecklistSchema {
    [key: string]: {
        title: string;
        sections: any[];
        finalSections?: any[];
        signatures: string[];
    };
}

export default function ChecklistEditor() {
    const [schema, setSchema] = useState<ChecklistSchema | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedType, setSelectedType] = useState<string>('combined');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/config/checklist_schema');
            if (res.ok) {
                const data = await res.json();
                setSchema(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!schema) return;
        setSaving(true);
        try {
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'checklist_schema', value: schema })
            });
            if (!res.ok) throw new Error("Failed to save");
            alert("Changes saved successfully!");
        } catch (e) {
            alert("Error saving changes");
        } finally {
            setSaving(false);
        }
    };

    const updateSectionItem = (sectionIdx: number, itemIdx: number, newValue: string) => {
        if (!schema) return;
        const newSchema = { ...schema };
        newSchema[selectedType].sections[sectionIdx].items[itemIdx] = newValue;
        setSchema(newSchema);
    };

    const updateSectionTitle = (sectionIdx: number, newValue: string) => {
        if (!schema) return;
        const newSchema = { ...schema };
        newSchema[selectedType].sections[sectionIdx].title = newValue;
        setSchema(newSchema);
    };

    const addItem = (sectionIdx: number) => {
        if (!schema) return;
        const newSchema = { ...schema };
        if (!newSchema[selectedType].sections[sectionIdx].items) {
            newSchema[selectedType].sections[sectionIdx].items = []; // Init if undefined
        }
        newSchema[selectedType].sections[sectionIdx].items.push("New Item");
        setSchema(newSchema);
    };

    const removeItem = (sectionIdx: number, itemIdx: number) => {
        if (!schema) return;
        if (!confirm("Are you sure you want to remove this item?")) return;
        const newSchema = { ...schema };
        newSchema[selectedType].sections[sectionIdx].items.splice(itemIdx, 1);
        setSchema(newSchema);
    };

    const toggleSection = (id: string) => {
        setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Configuration...</div>;
    if (!schema) return <div className="p-8 text-center text-red-500">Failed to load configuration.</div>;

    const currentChecklist = schema[selectedType];

    return (
        <div className="space-y-6 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Checklist Editor</h1>
                    <p className="text-gray-500 text-sm">Modify questions, titles, and sections directly.</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal"
                    >
                        {Object.keys(schema).map(key => (
                            <option key={key} value={key}>{schema[key].title}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-brand-teal text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 shadow-sm transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </header>

            <div className="space-y-6">
                {/* Title Edit */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Checklist Title</label>
                    <input
                        type="text"
                        value={currentChecklist.title}
                        onChange={(e) => {
                            const newSchema = { ...schema };
                            newSchema[selectedType].title = e.target.value;
                            setSchema(newSchema);
                        }}
                        className="w-full text-lg font-semibold rounded-lg border-gray-300 focus:border-brand-teal focus:ring-brand-teal"
                    />
                </div>

                {/* Sections */}
                <div className="space-y-4">
                    {currentChecklist.sections.map((section, sIdx) => (
                        <div key={section.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div
                                className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => toggleSection(section.id)}
                            >
                                <div className="flex items-center gap-3">
                                    {expandedSections[section.id] ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                                    <span className="font-semibold text-gray-700">{section.title}</span>
                                    <span className="text-xs text-gray-400 bg-white border px-2 py-0.5 rounded-full">{section.type || 'Standard'}</span>
                                </div>
                            </div>

                            {expandedSections[section.id] && (
                                <div className="p-6 space-y-6 border-t border-gray-100">
                                    {/* Section Title */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Section Title</label>
                                        <input
                                            type="text"
                                            value={section.title}
                                            onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                                            className="w-full mt-1 rounded-lg border-gray-300 focus:border-brand-teal focus:ring-brand-teal"
                                        />
                                    </div>

                                    {/* Items Array */}
                                    {section.items && Array.isArray(section.items) && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items / Questions</label>
                                            </div>

                                            {section.items.map((item: any, iIdx: number) => (
                                                <div key={iIdx} className="flex gap-3 items-start group">
                                                    <div className="flex-1">
                                                        {typeof item === 'string' ? (
                                                            <input
                                                                type="text"
                                                                value={item}
                                                                onChange={(e) => updateSectionItem(sIdx, iIdx, e.target.value)}
                                                                className="w-full rounded-lg border-gray-300 focus:border-brand-teal focus:ring-brand-teal text-sm"
                                                            />
                                                        ) : (
                                                            // Handle Object Items (e.g. Peer Review tasks)
                                                            <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg bg-gray-50/50">
                                                                <input
                                                                    type="text"
                                                                    value={item.task}
                                                                    onChange={(e) => {
                                                                        const newSchema = { ...schema };
                                                                        newSchema[selectedType].sections[sIdx].items[iIdx].task = e.target.value;
                                                                        setSchema(newSchema);
                                                                    }}
                                                                    className="w-full rounded border-gray-200 text-sm font-medium"
                                                                    placeholder="Task Name"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={item.subtext}
                                                                    onChange={(e) => {
                                                                        const newSchema = { ...schema };
                                                                        newSchema[selectedType].sections[sIdx].items[iIdx].subtext = e.target.value;
                                                                        setSchema(newSchema);
                                                                    }}
                                                                    className="w-full rounded border-gray-200 text-sm text-gray-500"
                                                                    placeholder="Description"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(sIdx, iIdx)}
                                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Remove Item"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}

                                            <button
                                                onClick={() => addItem(sIdx)}
                                                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-brand-teal hover:text-brand-teal transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                            >
                                                <Plus className="w-4 h-4" /> Add Item
                                            </button>
                                        </div>
                                    )}

                                    {/* Fields (Advanced) */}
                                    {section.fields && (
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-3 text-sm text-yellow-800">
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <p>This section contains complex fields (like inputs or route selectors). Editing the structure of these fields is disabled to prevent breaking the layout, but you can edit labels if you wish.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
