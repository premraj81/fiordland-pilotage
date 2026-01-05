
import { useState } from 'react';
import { FileText, Download, File, Maximize2, X } from 'lucide-react';
import { cn } from '../lib/utils';

// CONFIGURATION: Real files from public/documents - ALL PDFs now
const MY_DOCUMENTS = [
    {
        id: 'doc1',
        title: 'Harbourmaster Directions',
        filename: 'harbourmaster-directions.pdf',
        type: 'pdf'
    },
    {
        id: 'doc2',
        title: 'Fiordland Response Plan',
        filename: 'fiordland-response-plan.pdf',
        type: 'pdf'
    },
    {
        id: 'doc3',
        title: 'Fiordland By Sea User Guide 2024',
        filename: 'fiordland-by-sea-user-guide-2024.pdf',
        type: 'pdf'
    },
    {
        id: 'doc4',
        title: 'Cruise Ship Deed of Agreement',
        filename: 'cruise-ship-deed-of-agreement.pdf',
        type: 'pdf'
    },
    {
        id: 'doc5',
        title: 'Cruise Ship SMS',
        filename: 'cruise-ship-sms.pdf',
        type: 'pdf'
    },
    {
        id: 'doc6',
        title: 'Fiordland Pilots SOPs (Oct 2023)',
        filename: "fiordland-pilots-sops-oct-2023.pdf",
        type: 'pdf'
    },
    {
        id: 'doc7',
        title: 'FPS Cruise Ship Risk Assessment 2018',
        filename: 'fps-cruise-ship-risk-assessment-2018.pdf',
        type: 'pdf'
    },
    {
        id: 'doc8',
        title: 'FPS Training Programme 2025',
        filename: 'fps-training-programme-2025.pdf',
        type: 'pdf'
    },
    {
        id: 'doc9',
        title: 'Attachments to Stewart Is. Training',
        filename: 'attachments-stewart-island-training.pdf',
        type: 'pdf'
    },
    {
        id: 'doc10',
        title: 'Port Otago Stewart Is. Plan',
        filename: 'port-otago-stewart-island-plan.pdf',
        type: 'pdf'
    },
    {
        id: 'doc11',
        title: 'Revised Stewart Is. Pilotage Limit',
        filename: 'revised-stewart-island-pilotage-limit.pdf',
        type: 'pdf'
    },
    {
        id: 'doc12',
        title: 'Pilot Assessment',
        filename: 'pilot-assessment.pdf',
        type: 'pdf'
    }
];



export default function ImportantDocuments() {
    const [activeDoc, setActiveDoc] = useState(MY_DOCUMENTS[0]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Using iframe for better mobile PDF support than object tag
    const getFileUrl = (filename: string) => `/ documents / ${filename} `;

    return (
        <div className={cn("transition-all duration-300", isFullscreen ? "fixed inset-0 z-50 bg-white" : "max-w-6xl mx-auto space-y-6 pb-20")}>
            <div className={cn("grid lg:grid-cols-12 gap-6 items-start h-full", isFullscreen ? "block" : "")}>
                {/* Sidebar Navigation - Hidden in Fullscreen */}
                {!isFullscreen && (
                    <div className="lg:col-span-3 space-y-4">
                        <h1 className="text-3xl font-bold text-fiordland-900 px-1">Documents</h1>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 overflow-y-auto max-h-[800px]">
                            {MY_DOCUMENTS.map((doc) => (
                                <button
                                    key={doc.id}
                                    onClick={() => setActiveDoc(doc)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-lg font-medium transition-all mb-1 last:mb-0 flex items-center gap-3",
                                        activeDoc.id === doc.id
                                            ? "bg-brand-teal text-white shadow-md"
                                            : "hover:bg-gray-50 text-gray-700"
                                    )}
                                >
                                    <FileText className={cn("w-4 h-4 shrink-0", activeDoc.id === doc.id ? "text-teal-100" : "text-gray-400")} />
                                    <span className="truncate text-sm">{doc.title}</span>
                                </button>
                            ))}
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
                            <p className="font-semibold mb-1">Viewing Tips:</p>
                            <p>Tap the fullscreen icon <Maximize2 className="w-3 h-3 inline" /> to view documents in full page mode.</p>
                        </div>
                    </div>
                )}

                {/* Content Viewer */}
                <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col", isFullscreen ? "h-full rounded-none border-0" : "lg:col-span-9 h-[85vh]")}>
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                        <h2 className="font-bold text-fiordland-900 flex items-center gap-2 truncate pr-4">
                            <File className="w-5 h-5 text-brand-gold shrink-0" />
                            <span className="truncate">{activeDoc.title}</span>
                        </h2>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-fiordland-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition-colors"
                            >
                                {isFullscreen ? (
                                    <>
                                        <X className="w-4 h-4" /> Exit Fullscreen
                                    </>
                                ) : (
                                    <>
                                        <Maximize2 className="w-4 h-4" /> Fullscreen
                                    </>
                                )}
                            </button>
                            {!isFullscreen && (
                                <a
                                    href={getFileUrl(activeDoc.filename)}
                                    download
                                    className="flex items-center gap-2 text-sm font-medium text-brand-teal hover:text-teal-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
                                >
                                    <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 bg-gray-100 relative w-full h-full">
                        <iframe
                            src={getFileUrl(activeDoc.filename)}
                            className="w-full h-full border-0"
                            title={activeDoc.title}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

