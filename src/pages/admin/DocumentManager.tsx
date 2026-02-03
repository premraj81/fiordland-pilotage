import { useState, useEffect } from 'react';
import { Upload, Trash2, FileText, Download, Loader } from 'lucide-react';

interface Document {
    id: number;
    title: string;
    file_url: string;
    category: string;
    uploaded_at: string;
}

export default function DocumentManager() {
    const [docs, setDocs] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Passage Plans');

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        try {
            const res = await fetch('/api/documents');
            if (res.ok) {
                setDocs(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setUploading(true);
        try {
            // 1. Upload File
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error("File upload failed");
            const { url } = await uploadRes.json();

            // 2. Save Metadata
            const saveRes = await fetch('/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    file_url: url,
                    category
                })
            });

            if (!saveRes.ok) throw new Error("Failed to save metadata");

            // Reset
            setFile(null);
            setTitle('');
            fetchDocs();
            alert("Document uploaded successfully!");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this document?")) return;
        try {
            await fetch(`/api/documents/${id}`, { method: 'DELETE' });
            setDocs(docs.filter(d => d.id !== id));
        } catch (e) {
            alert("Failed to delete");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Documents...</div>;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Document Manager</h1>
                <p className="text-gray-500 text-sm">Upload PDF Reference Documents for pilots.</p>
            </header>

            {/* Upload Form */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-fiordland-800">Upload New Document</h2>
                <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Milford Sound Navigation Guidelines"
                            className="w-full rounded-lg border-gray-300 focus:border-brand-teal focus:ring-brand-teal"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-brand-teal focus:ring-brand-teal"
                        >
                            <option>Passage Plans</option>
                            <option>Directives</option>
                            <option>Safety Notices</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <input
                            type="file"
                            accept=".pdf, .jpg, .png"
                            onChange={e => setFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-gray-300 cursor-pointer transition-colors ${file ? 'bg-teal-50 text-teal-700 border-teal-200' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {file ? file.name : <><Upload className="w-4 h-4" /> Select File</>}
                        </label>
                    </div>

                    <div className="lg:col-span-4 flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!file || !title || uploading}
                            className="bg-brand-teal text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            Upload Document
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-semibold">Document</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Uploaded</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {docs.map(doc => (
                            <tr key={doc.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-gray-900">{doc.title}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">{doc.category}</span>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(doc.uploaded_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <a
                                        href={doc.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex p-2 text-gray-400 hover:text-brand-teal transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="inline-flex p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {docs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                                    No documents uploaded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
