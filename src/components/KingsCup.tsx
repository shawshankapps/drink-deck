"use client";

import { motion } from "framer-motion";

interface KingsCupProps {
    kingCount: number;
}

export const KingsCup = ({ kingCount }: KingsCupProps) => {
    // Map 0-4 kings to fill level (0% to 100%)
    const fillPercentage = (kingCount / 4) * 100;

    return (
        <div className="relative w-48 h-64 mx-auto mb-8">
            {/* The Cup Outline */}
            <div className="absolute inset-0 border-4 border-neon-cyan/30 rounded-b-[40px] rounded-t-lg overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.1)]">
                {/* Glow effect for the glass */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                {/* The Liquid */}
                <motion.div
                    initial={{ height: "0%" }}
                    animate={{ height: `${fillPercentage}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-neon-pink/80 to-neon-purple/60 shadow-[0_0_15px_rgba(255,0,127,0.5)]"
                >
                    {/* Bubbles animation */}
                    <div className="absolute top-0 w-full h-8 overflow-hidden pointer-events-none">
                        <div className="w-full h-1 bg-white/20 blur-sm animate-pulse" />
                    </div>
                </motion.div>
            </div>

            {/* King Indicators */}
            <div className="absolute -right-12 top-0 bottom-0 flex flex-col justify-around py-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-500 ${i <= kingCount
                                ? "border-neon-pink bg-neon-pink text-white shadow-[0_0_10px_#ff007f]"
                                : "border-white/20 text-white/20"
                            }`}
                    >
                        K
                    </div>
                ))}
            </div>

            {/* Label */}
            <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className="text-neon-cyan font-bold tracking-widest text-sm uppercase neon-text-cyan">
                    The King's Cup
                </span>
            </div>
        </div>
    );
};
