

export default function ShipAnimation() {
    return (
        <div className="relative w-16 h-12 overflow-hidden flex items-end ml-4 select-none pointer-events-none">
            <style>{`
                @keyframes sail {
                    0%, 100% { transform: rotate(0deg) translateY(0); }
                    25% { transform: rotate(2deg) translateY(-1px); }
                    75% { transform: rotate(-1deg) translateY(1px); }
                }
                @keyframes wave {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .ship-sail { animation: sail 3s ease-in-out infinite; }
                .wave-move { animation: wave 4s linear infinite; }
            `}</style>

            {/* Ship */}
            <div className="ship-sail absolute bottom-3 left-2 z-10">
                <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Hull */}
                    <path d="M12 40 L52 40 C56 40 58 44 56 48 L48 56 L16 56 L8 48 C6 44 8 40 12 40 Z" fill="#34d399" />
                    {/* Cabin */}
                    <rect x="24" y="28" width="16" height="12" rx="2" fill="#ecfdf5" />
                    <rect x="28" y="32" width="8" height="4" fill="#064e3b" />
                    {/* Mast */}
                    <rect x="30" y="16" width="2" height="12" fill="#d1fae5" />
                </svg>
            </div>

            {/* Waves */}
            <div className="absolute bottom-0 left-0 flex w-[200%] wave-move opacity-60">
                <svg viewBox="0 0 100 20" className="w-1/2 h-4 text-sky-400 fill-current" preserveAspectRatio="none">
                    <path d="M0 10 Q 25 20 50 10 T 100 10 V 20 H 0 Z" />
                </svg>
                <svg viewBox="0 0 100 20" className="w-1/2 h-4 text-sky-400 fill-current" preserveAspectRatio="none">
                    <path d="M0 10 Q 25 20 50 10 T 100 10 V 20 H 0 Z" />
                </svg>
            </div>

            {/* Background Waves (Offset) */}
            <div className="absolute bottom-[2px] left-[-20px] flex w-[200%] wave-move opacity-40" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
                <svg viewBox="0 0 100 20" className="w-1/2 h-5 text-teal-300 fill-current" preserveAspectRatio="none">
                    <path d="M0 10 Q 25 0 50 10 T 100 10 V 20 H 0 Z" />
                </svg>
                <svg viewBox="0 0 100 20" className="w-1/2 h-5 text-teal-300 fill-current" preserveAspectRatio="none">
                    <path d="M0 10 Q 25 0 50 10 T 100 10 V 20 H 0 Z" />
                </svg>
            </div>
        </div>
    );
}
