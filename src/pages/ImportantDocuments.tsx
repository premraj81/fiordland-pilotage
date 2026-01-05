
import { useState, useEffect } from 'react';
import { FileText, Download, File, Maximize2, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

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
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);

    // Reset state when doc changes
    useEffect(() => {
        setPageNumber(1);
        setNumPages(0);
        setScale(1.0);
        setLoading(true);
    }, [activeDoc]);

    const getFileUrl = (filename: string) => `/ documents / ${filename} `;

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    function onDocumentLoadError(error: Error) {
        setLoading(false);
        console.error("Error loading document:", error);
    }

    return (
        <div className={cn("transition-all duration-300", isFullscreen ? "fixed inset-0 z-50 bg-gray-900" : "max-w-6xl mx-auto space-y-6 pb-20")}>
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
                    </div>
                )}

                {/* Content Viewer */}
                <div className={cn("bg-gray-100 rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative", isFullscreen ? "h-full rounded-none border-0" : "lg:col-span-9 h-[85vh] lg:h-[800px]")}>

                    {/* Toolbar */}
                    <div className="p-3 border-b border-gray-200 flex flex-wrap justify-between items-center bg-white shrink-0 gap-2 shadow-sm z-10">
                        <div className="flex items-center gap-2 truncate min-w-0 pr-2">
                            <File className="w-5 h-5 text-brand-gold shrink-0" />
                            <h2 className="font-bold text-fiordland-900 truncate">{activeDoc.title}</h2>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            {/* Zoom Controls */}
                            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mr-2">
                                <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-1.5 hover:bg-white rounded-md text-gray-600"><ZoomOut className="w-4 h-4" /></button>
                                <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
                                <button onClick={() => setScale(s => Math.min(2.5, s + 0.1))} className="p-1.5 hover:bg-white rounded-md text-gray-600"><ZoomIn className="w-4 h-4" /></button>
                            </div>

                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-fiordland-900 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
                            >
                                {isFullscreen ? <><X className="w-4 h-4" /> Exit</> : <><Maximize2 className="w-4 h-4" /> Fullscreen</>}
                            </button>

                            {!isFullscreen && (
                                <a
                                    href={getFileUrl(activeDoc.filename)}
                                    download
                                    className="flex items-center gap-2 text-sm font-medium text-brand-teal hover:text-teal-700 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-brand-teal transition-all"
                                    title="Download PDF"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* PDF Area */}
                    <div className="flex-1 overflow-auto bg-gray-500/5 flex justify-center p-4 md:p-8 relative">
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 backdrop-blur-sm">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="w-8 h-8 text-brand-teal animate-spin" />
                                    <p className="text-sm font-medium text-gray-600">Loading Document...</p>
                                </div>
                            </div>
                        )}

                        <Document
                            file={getFileUrl(activeDoc.filename)}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            className="max-w-full shadow-xl"
                            loading={null}
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="bg-white shadow-lg"
                                width={isFullscreen ? undefined : 600}
                            />
                        </Document>
                    </div>

                    {/* Footer / Pagination */}
                    {numPages > 0 && (
                        <div className="p-3 bg-white border-t border-gray-200 flex justify-center items-center gap-4 shrink-0">
                            <button
                                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                                disabled={pageNumber <= 1}
                                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <span className="font-mono text-sm">
                                Page {pageNumber} of {numPages}
                            </span>

                            <button
                                onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                                disabled={pageNumber >= numPages}
                                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

