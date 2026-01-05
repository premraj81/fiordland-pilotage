import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, ArrowUpDown, UserPlus, X } from 'lucide-react';
import { CHECKLISTS } from '../lib/data';
import { saveChecklist } from '../lib/db';
import SignaturePad from '../components/SignaturePad';
import { generatePDF } from '../lib/pdf';

const PILOTS = ["Premraj Pillai", "Josh Osborne", "Sumanth Surendran", "Lawrence Clark", "Scott Young"];
const TRAINEES = ["Julien Charptner", "Andrew Kerr Fox"];

export default function ChecklistForm() {
    const { type } = useParams();
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

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveChecklist({
                type: type as any,
                createdAt: new Date(date),
                data: { ...formData, signatures, names, date, showTrainee },
            });

            // Generate PDF
            generatePDF({ data: { ...formData, signatures, names, date, showTrainee } }, schema);

            navigate('/');
        } catch (e) {
            console.error(e);
            alert('Failed to save');
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

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:static lg:bg-transparent lg:border-none lg:p-0 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full lg:w-auto bg-brand-teal text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
                >
                    {saving ? 'Saving...' : (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Complete & Save
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function RenderSection({ section, formData, handleInputChange, isRouteReversed, setIsRouteReversed }: any) {
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

            <div className="space-y-4">
                {section.fields?.map((field: any) => {
                    if (field.type === 'route-selector') {
                        const routes = isRouteReversed
                            ? ['Dusky to Breaksea', 'Doubtful to Thompson', 'Milford']
                            : ['Milford', 'Thompson to Doubtful', 'Breaksea to Dusky'];

                        const currentValues = formData[section.id]?.[field.id] || [];

                        return (
                            <div key={field.id} className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
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
                                                className="w-5 h-5 rounded text-brand-teal focus:ring-brand-teal border-gray-300"
                                            />
                                            <span className="text-gray-900 font-medium">{route}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={field.id} className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal p-3 border h-32"
                                    onChange={(e) => handleInputChange(section.id, field.id, e.target.value)}
                                    placeholder="Enter notes here..."
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal p-3 border"
                                    onChange={(e) => handleInputChange(section.id, field.id, e.target.value)}
                                />
                            )}
                        </div>
                    );
                })}

                {section.items?.map((item: string, idx: number) => (
                    <label key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                        <input
                            type="checkbox"
                            className="mt-1 w-5 h-5 rounded text-brand-teal focus:ring-brand-teal border-gray-300"
                            onChange={(e) => handleInputChange(section.id, `item-${idx}`, e.target.checked)}
                        />
                        <span className="text-gray-700 group-hover:text-gray-900">{item}</span>
                    </label>
                ))}
            </div>
        </section>
    );
}
