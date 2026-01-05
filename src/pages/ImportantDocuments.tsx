
import { useState } from 'react';
import { FileText, Download, File } from 'lucide-react';
import { cn } from '../lib/utils';

// CONFIGURATION: Update this list with your actual file names and titles
// Ensure your files are placed in the 'public/documents' folder.
const MY_DOCUMENTS = [
    {
        id: 'doc1',
        title: 'Safety Procedures',
        filename: 'Safety_Procedures.pdf',
        type: 'pdf' // 'pdf' or 'docx'
    },
    {
        id: 'doc2',
        title: 'Operational Operational Manual',
        filename: 'Operational_Manual.pdf',
        type: 'pdf'
    },
    {
        id: 'doc3',
        title: 'Emergency Response',
        filename: 'Emergency_Response.pdf',
        type: 'pdf'
    },
    {
        id: 'doc4',
        title: 'Vessel Specs',
        filename: 'Vessel_Specs.docx',
        type: 'docx'
    },
    {
        id: 'doc5',
        title: 'Contact List',
        filename: 'Contact_List.docx',
        type: 'docx'
    }
];

export default function ImportantDocuments() {
    const [activeDoc, setActiveDoc] = useState(MY_DOCUMENTS[0]);

    const getFileUrl = (filename: string) => `/documents/${filename}`;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            <h1 className="text-3xl font-bold text-fiordland-900">Important Documents</h1>

            <div className="grid lg:grid-cols-12 gap-6 items-start">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
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
                                <FileText className={cn("w-4 h-4", activeDoc.id === doc.id ? "text-teal-100" : "text-gray-400")} />
                                <span className="truncate">{doc.title}</span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
                        <p className="font-semibold mb-1">How to add files:</p>
                        <p>Place your PDF or Word files in the <code>public/documents</code> folder and update the filename in the code.</p>
                    </div>
                </div>

                {/* Content Viewer */}
                <div className="lg:col-span-9">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[800px] flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="font-bold text-fiordland-900 flex items-center gap-2">
                                <File className="w-5 h-5 text-brand-gold" />
                                {activeDoc.title}
                            </h2>
                            <a
                                href={getFileUrl(activeDoc.filename)}
                                download
                                className="flex items-center gap-2 text-sm font-medium text-brand-teal hover:text-teal-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
                            >
                                <Download className="w-4 h-4" /> Download
                            </a>
                        </div>

                        <div className="flex-1 bg-gray-100 relative">
                            {activeDoc.type === 'pdf' ? (
                                <object
                                    data={`${getFileUrl(activeDoc.filename)}#toolbar=0`}
                                    type="application/pdf"
                                    className="w-full h-full"
                                >
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                                        <p>Unable to display PDF directly.</p>
                                        <a
                                            href={getFileUrl(activeDoc.filename)}
                                            className="text-brand-teal hover:underline font-medium"
                                        >
                                            Click here to download
                                        </a>
                                    </div>
                                </object>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-6 p-12 text-center">
                                    <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center">
                                        <FileText className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <div className="max-w-md">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Word Document Preview Unavailable</h3>
                                        <p className="text-sm">Word documents ({activeDoc.filename}) cannot be displayed directly in the browser. Please download the file to view it.</p>
                                    </div>
                                    <a
                                        href={getFileUrl(activeDoc.filename)}
                                        download
                                        className="bg-brand-teal text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-all flex items-center gap-2"
                                    >
                                        <Download className="w-5 h-5" /> Download Document
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
