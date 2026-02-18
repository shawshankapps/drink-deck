"use client";

import { Card as CardType } from "@/lib/game-logic";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
    card: CardType | null;
    isFlipped: boolean;
    onClick?: () => void;
    className?: string;
}

export const Card = ({ card, isFlipped, onClick, className }: CardProps) => {
    const getSuitSymbol = (suit: string) => {
        switch (suit) {
            case 'hearts': return '♥';
            case 'diamonds': return '♦';
            case 'clubs': return '♣';
            case 'spades': return '♠';
            default: return '';
        }
    };

    const isRed = card?.suit === 'hearts' || card?.suit === 'diamonds';

    return (
        <div
            className={cn("relative w-48 h-72 perspective-1000 cursor-pointer", className)}
            onClick={onClick}
        >
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                className="relative w-full h-full text-center transition-all duration-500 transform-style-3d"
            >
                {/* Front (Back of card visually when not flipped) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl border-2 border-neon-cyan bg-dark-card flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                    <div className="absolute inset-2 border border-neon-cyan/20 rounded-lg flex items-center justify-center">
                        <div className="text-4xl font-bold text-neon-cyan opacity-20">?</div>
                    </div>
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-cyan/5 to-transparent" />
                </div>

                {/* Back (Face of card visually when flipped) */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-xl border-2 border-white bg-white flex flex-col justify-between p-4 rotate-y-180 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    {card ? (
                        <>
                            <div className={cn("text-2xl font-bold self-start", isRed ? "text-red-500" : "text-slate-900")}>
                                {card.rank}<br />{getSuitSymbol(card.suit)}
                            </div>
                            <div className={cn("text-6xl self-center", isRed ? "text-red-500" : "text-slate-900")}>
                                {getSuitSymbol(card.suit)}
                            </div>
                            <div className={cn("text-2xl font-bold self-end rotate-180", isRed ? "text-red-500" : "text-slate-900")}>
                                {card.rank}<br />{getSuitSymbol(card.suit)}
                            </div>
                        </>
                    ) : null}
                </div>
            </motion.div>
        </div>
    );
};
