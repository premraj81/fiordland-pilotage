export default function ShipAnimation() {
    return (
        <div className="relative w-32 h-14 overflow-hidden flex items-end ml-4 select-none pointer-events-none">
            <style>{`
                @keyframes sail {
                    0%, 100% { transform: rotate(0deg) translateY(0); }
                    25% { transform: rotate(1deg) translateY(-1px); }
                    75% { transform: rotate(-0.5deg) translateY(1px); }
                }
                @keyframes travel {
                    0% { transform: translateX(-5px); }
                    50% { transform: translateX(25px); }
                    100% { transform: translateX(-5px); }
                }
                @keyframes wave {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .ship-motion { animation: sail 4s ease-in-out infinite, travel 15s ease-in-out infinite; }
                .wave-move { animation: wave 4s linear infinite; }
            `}</style>

            {/* Cruise Ship */}
            <div className="ship-motion absolute bottom-3 left-0 z-10">
                <svg width="70" height="40" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Funnel */}
                    <path d="M52 12 L62 12 L60 22 L54 22 Z" fill="#ef4444" />
                    {/* Superstructure */}
                    <path d="M25 22 L65 22 L70 30 L20 30 Z" fill="#f1f5f9" />
                    <rect x="25" y="24" width="35" height="2" rx="1" fill="#334155" opacity="0.3" />

                    <path d="M18 30 L75 30 L80 40 L15 40 Z" fill="#e2e8f0" />
                    <rect x="20" y="33" width="50" height="2" rx="1" fill="#334155" opacity="0.3" />

                    {/* Hull */}
                    <path d="M5 40 L90 40 C95 40 96 45 94 50 L88 56 L20 56 L2 48 C0 44 2 40 5 40 Z" fill="#ffffff" />
                    <path d="M5 40 L90 40 C95 40 96 45 94 50 L88 56 L20 56 L2 48 C0 44 2 40 5 40 Z" stroke="#94a3b8" strokeWidth="0.5" />

                    {/* Branding Line */}
                    <path d="M8 46 L90 46" stroke="#0d9488" strokeWidth="3" />

                    {/* Bridge Window */}
                    <path d="M70 30 L80 40 L70 40 L65 30 Z" fill="#334155" opacity="0.2" />
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
