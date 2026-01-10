export default function ShipAnimation({ className }: { className?: string }) {
    return (
        <div className={`pointer-events-none select-none ${className}`}>
            <style>{`
                @keyframes sail {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-2px) rotate(1deg); }
                    75% { transform: translateY(2px) rotate(-0.5deg); }
                }
                @keyframes voyage {
                    0% { left: -150px; transform: scaleX(1); }
                    45% { left: 100%; transform: scaleX(1); }
                    46% { left: 100%; transform: scaleX(-1); } /* Turn */
                    95% { left: -150px; transform: scaleX(-1); }
                    96% { left: -150px; transform: scaleX(1); } /* Turn back */
                    100% { left: -150px; transform: scaleX(1); }
                }
                .ship-body { animation: sail 4s ease-in-out infinite; }
                .ship-container { animation: voyage 190s linear infinite; }
            `}</style>

            {/* Cruise Ship Container moving across screen */}
            <div className="ship-container absolute bottom-4 z-0">
                {/* Inner bobbing animation */}
                <div className="ship-body">
                    <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </div>
        </div>
    );
}
