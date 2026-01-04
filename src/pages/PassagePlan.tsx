import { useRef, useState, useEffect } from 'react';
import { Maximize, Minimize, FileText } from 'lucide-react';

export default function PassagePlan() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        const handleChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-teal/10 rounded-lg">
                        <FileText className="w-6 h-6 text-brand-teal" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-fiordland-900">Passage Plan</h1>
                        <p className="text-sm text-fiordland-500">Official Document Viewer</p>
                    </div>
                </div>
                <button
                    onClick={toggleFullScreen}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors border border-gray-200"
                >
                    <Maximize className="w-4 h-4" />
                    <span>Full Screen</span>
                </button>
            </div>

            <div ref={containerRef} className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative min-h-[600px] group">
                <iframe src="./Passage_Plan.pdf" className="w-full h-full" title="Passage Plan PDF" />

                {isFullScreen && (
                    <button
                        onClick={toggleFullScreen}
                        className="absolute top-4 right-6 bg-white/90 backdrop-blur text-gray-800 px-4 py-2 rounded-lg shadow-lg font-medium hover:bg-white flex items-center gap-2 border border-gray-200 z-50 transition-opacity"
                    >
                        <Minimize className="w-4 h-4" />
                        Exit Full Screen
                    </button>
                )}
            </div>
        </div>
    );
}
