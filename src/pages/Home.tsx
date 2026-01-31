import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, FileText, Send, Archive, Eye, CloudRain, Users, Trash2 } from 'lucide-react';
import { getChecklists, updateChecklist, deleteChecklist } from '../lib/db';
import { CHECKLISTS } from '../lib/data';
import { generatePDF } from '../lib/pdf';
import { cn } from '../lib/utils';
import { format, differenceInMonths } from 'date-fns';
import { useOnlineStatus } from '../lib/hooks';
import CruiseSchedule from '../components/CruiseSchedule';

export default function Home() {
    const navigate = useNavigate();
    const [history, setHistory] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
    const isOnline = useOnlineStatus();

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const data = await getChecklists();
        const now = new Date();

        setHistory(data.reverse());
    }

    const handleShare = async (item: any) => {
        if (!isOnline) {
            alert("No internet connection available. You can only send the PDF while online.");
            return;
        }

        try {
            // @ts-ignore
            const schema = CHECKLISTS['combined'] || CHECKLISTS['passage-plan'];
            if (!schema) return;

            const pdfWrapper = {
                data: item.data,
                names: item.data?.names,
                signatures: item.data?.signatures,
                date: item.data?.date,
                showTrainee: item.data?.showTrainee
            };

            const pdfBlob = generatePDF(pdfWrapper, schema, 'blob') as Blob; // Return Blob

            if (!pdfBlob) {
                alert("Failed to generate PDF");
                return;
            }

            const dateStr = item.data?.date ? format(new Date(item.data.date), 'yyyyMMdd') : format(new Date(), 'yyyyMMdd');
            const filename = `MPX_${dateStr}_${item.data?.names?.pilot || 'Pilot'}.pdf`;
            const file = new File([pdfBlob], filename, { type: 'application/pdf' });

            // Share or Download
            let shared = false;
            if (navigator.share) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'MPX Report',
                        text: `Hi, The ${item.data?.names?.pilot || 'Pilot'} has completed the MPX for ${item.data?.header?.vesselName || 'Vessel'} and send it as attachment. thankyou`
                    });
                    shared = true;
                } catch (e) {
                    console.log("Share cancelled or failed", e);
                }
            } else {
                // Fallback for desktop: Download
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert("PDF Downloaded. Please attach it to your email manually.");
                shared = true;
            }

            // If successfully "sent" (shared or downloaded)
            if (shared) {
                // 1. Mark as Sent immediately (Green button)
                await updateChecklist(item.id, { emailSent: true });
                setHistory(prev => prev.map(h => h.id === item.id ? { ...h, emailSent: true } : h));

                // 2. Set timer to Archive (e.g., 5 seconds delay so they see the green button)
                setTimeout(async () => {
                    await updateChecklist(item.id, { archived: true, archivedAt: new Date() });
                    // Refresh data to move it to Archive tab
                    loadData();
                }, 5000);
            }

        } catch (error) {
            console.error("Error sharing:", error);
            alert("Could not share PDF. Ensure you are online.");
        }
    };

    const handleReview = async (item: any) => {
        try {
            // @ts-ignore
            const schema = CHECKLISTS['combined'] || CHECKLISTS['passage-plan'];
            if (!schema) return;

            const pdfWrapper = {
                data: item.data,
                names: item.data?.names,
                signatures: item.data?.signatures,
                date: item.data?.date,
                showTrainee: item.data?.showTrainee
            };

            const pdfBlob = generatePDF(pdfWrapper, schema, 'blob') as Blob; // Return Blob

            if (!pdfBlob) {
                alert("Failed to generate PDF");
                return;
            }

            // Create URL and open in new tab
            const url = URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');

        } catch (error) {
            console.error("Error viewing PDF:", error);
            alert("Could not view PDF.");
        }
    };

    const handleDeleteItem = async (id: number) => {
        if (confirm("Are you sure you want to delete this checklist? This cannot be undone.")) {
            await deleteChecklist(id);
            loadData();
        }
    };

    const handleArchiveItem = async (id: number) => {
        if (confirm("Are you sure you want to archive this checklist?")) {
            await updateChecklist(id, { archived: true, archivedAt: new Date() });
            loadData();
        }
    };

    // Filter items based on tab
    const filteredItems = history.filter(item => {
        if (activeTab === 'active') {
            return !item.archived;
        } else {
            return item.archived;
        }
    });

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-fiordland-900">Dashboard</h1>
                    <p className="text-fiordland-500">Welcome to Fiordland Pilotage.</p>
                </div>
            </div>

            {/* Action Card - Only visible in Active tab? Or always? Always is fine. */}
            {/* Action Card - Only visible in Active tab? Or always? Always is fine. */}
            {/* Dashboard Grid: Cards Left, Weather Right */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Action Cards Column */}
                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                    <ActionCard
                        title="EMPX - Fiordland"
                        desc="Passage Plan Checklist for Fiordland region."
                        onClick={() => navigate('/checklist/combined')}
                        icon={<FileText className="w-8 h-8 text-white" />}
                        color="bg-fiordland-900"
                    />
                    <ActionCard
                        title="EMPX - Stewart Island"
                        desc="Passage Plan Checklist for Stewart Island region."
                        onClick={() => navigate('/checklist/stewart-island')}
                        icon={<FileText className="w-8 h-8 text-white" />}
                        color="bg-brand-teal"
                    />
                    <ActionCard
                        title="EMPX (Optional)"
                        desc="More precise Checklist."
                        onClick={() => navigate('/checklist/more-precise')}
                        icon={<CheckCircle className="w-8 h-8 text-white" />}
                        color="bg-slate-700"
                    />
                    <ActionCard
                        title="Peer Review"
                        desc="Pilot Assessment Peer Review."
                        onClick={() => navigate('/checklist/peer-review')}
                        icon={<Users className="w-8 h-8 text-white" />}
                        color="bg-indigo-600"
                    />
                    <div className="sm:col-span-2">
                        <CruiseSchedule />
                    </div>
                </div>

                {/* Weather Widget Column */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px] h-full relative">
                    {isOnline ? (
                        <iframe
                            width="100%"
                            height="100%"
                            className="w-full h-full min-h-[300px]"
                            src="https://embed.windy.com/embed2.html?lat=-45.030&lon=167.140&detailLat=-44.668&detailLon=167.919&width=650&height=450&zoom=7&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=true&metricWind=kt&metricTemp=%C2%B0C&radarRange=-1"
                            frameBorder="0"
                            title="Windy.com Weather"
                        ></iframe>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gray-50">
                            <CloudRain className="w-12 h-12 text-gray-300 mb-2" />
                            <p className="text-gray-500 font-medium">Weather Unavailable Offline</p>
                            <p className="text-xs text-gray-400 mt-1">Connect to internet to view forecast</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {activeTab === 'active' ? (
                            <Clock className="w-5 h-5 text-fiordland-400" />
                        ) : (
                            <Archive className="w-5 h-5 text-fiordland-400" />
                        )}
                        <h2 className="text-lg font-semibold text-fiordland-800">
                            {activeTab === 'active' ? 'Recent Activity' : 'Archived MPX'}
                        </h2>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                                activeTab === 'active' ? "bg-white text-fiordland-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setActiveTab('archived')}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                                activeTab === 'archived' ? "bg-white text-fiordland-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            Archive
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-gray-50 min-h-[200px]">
                    {filteredItems.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
                            <Archive className="w-8 h-8 opacity-20" />
                            <p>No {activeTab} checklists found.</p>
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                        "bg-teal-50 text-brand-teal"
                                    )}>
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-fiordland-900 text-lg">Completed MPX</h3>
                                        <div className="text-sm text-gray-600 space-y-0.5">
                                            {/* Corrected Access Path for Vessel Name */}
                                            <p><span className="font-medium">Vessel:</span> {
                                                item.data?.header?.vesselName ||
                                                item.data?.vesselDetails?.vesselName ||
                                                'Unknown Vessel'
                                            }</p>
                                            <p><span className="font-medium">Pilot:</span> {item.data?.names?.pilot || 'Unknown Pilot'}</p>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {format(new Date(item.createdAt), 'MMM d, yyyy HH:mm')}
                                            {item.archivedAt && ` • Archived ${format(new Date(item.archivedAt), 'MMM d')}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Checklist"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    {activeTab === 'active' && (
                                        <button
                                            onClick={() => handleArchiveItem(item.id)}
                                            className="p-2 text-gray-400 hover:text-fiordland-600 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Archive Checklist"
                                        >
                                            <Archive className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleReview(item)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                        title="View PDF"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span className="hidden sm:inline">View</span>
                                    </button>
                                    <button
                                        onClick={() => handleShare(item)}
                                        disabled={activeTab === 'archived'} // Disable resend from archive? User didn't specify, but safer.
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                                            item.emailSent || activeTab === 'archived' ? "bg-green-600 cursor-default hover:bg-green-600" : "bg-red-600 hover:bg-red-700"
                                        )}
                                    >
                                        <Send className="w-4 h-4" />
                                        {item.emailSent || activeTab === 'archived' ? "Sent" : "Send PDF"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function ActionCard({ title, desc, onClick, icon, color }: any) {
    return (
        <button onClick={onClick} className={cn("relative overflow-hidden p-6 rounded-2xl shadow-lg group text-left transition-transform hover:scale-[1.02]", color)}>
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                {icon}
            </div>
            <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/80">{desc}</p>
            </div>
        </button>
    )
}
