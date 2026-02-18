"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createDeck, Card as CardType, defaultRules, Rule } from "@/lib/game-logic";
import { Card } from "@/components/Card";
import { NeonButton } from "@/components/ui/NeonButton";
import { ChevronLeft, Info, RefreshCcw, Edit2, Check, HelpCircle, X } from "lucide-react";
import Link from "next/link";

export default function RingOfFirePage() {
    const [deck, setDeck] = useState<CardType[]>([]);
    const [currentCard, setCurrentCard] = useState<CardType | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [rules, setRules] = useState<Rule[]>(defaultRules);
    const [showRuleEdit, setShowRuleEdit] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [kingCount, setKingCount] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    // Initialize deck with positions
    useEffect(() => {
        setDeck(createDeck());
    }, []);

    const drawCard = (card: CardType) => {
        if (gameOver || (selectedCardId && !isFlipped)) return;

        // If a card is already flipped, we clear it first then draw new
        if (isFlipped) {
            setIsFlipped(false);
            setTimeout(() => {
                setSelectedCardId(card.id);
                setCurrentCard(card);
                setIsFlipped(true);
                setDeck(prev => prev.filter(c => c.id !== card.id));

                if (card.rank === 'K') {
                    const newCount = kingCount + 1;
                    setKingCount(newCount);
                    if (newCount === 4) {
                        setGameOver(true);
                    }
                }
            }, 300);
        } else {
            setSelectedCardId(card.id);
            setCurrentCard(card);
            setIsFlipped(true);
            setDeck(prev => prev.filter(c => c.id !== card.id));

            if (card.rank === 'K') {
                const newCount = kingCount + 1;
                setKingCount(newCount);
                if (newCount === 4) {
                    setGameOver(true);
                }
            }
        }
    };

    const resetGame = () => {
        setDeck(createDeck());
        setCurrentCard(null);
        setIsFlipped(false);
        setSelectedCardId(null);
        setKingCount(0);
        setGameOver(false);
    };

    const resetRules = () => {
        setRules(defaultRules.map(r => ({ ...r })));
    };

    const currentRule = currentCard ? rules.find(r => r.rank === currentCard.rank) : null;

    return (
        <main className="min-h-screen bg-dark-bg text-white p-4 md:p-8 flex flex-col items-center overflow-hidden">
            {/* Header */}
            <div className="w-full max-w-6xl flex justify-between items-center mb-8 z-10">
                <Link href="/">
                    <motion.div whileHover={{ x: -5 }} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer">
                        <ChevronLeft size={20} />
                        <span className="text-xs uppercase tracking-widest font-bold">Menu</span>
                    </motion.div>
                </Link>

                <h1 className="text-2xl font-black italic tracking-tighter">
                    <span className="text-neon-cyan neon-text-cyan">RING</span>
                    <span className="text-white/20">.OF.FIRE</span>
                </h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowRuleEdit(true)}
                        className="p-2 glass rounded-lg text-white/60 hover:text-neon-cyan transition-colors"
                    >
                        <Edit2 size={20} />
                    </button>
                    <button
                        onClick={() => setShowInfo(true)}
                        className="p-2 glass rounded-lg text-white/60 hover:text-neon-cyan transition-colors"
                    >
                        <HelpCircle size={20} />
                    </button>
                    <button
                        onClick={resetGame}
                        className="p-2 glass rounded-lg text-white/60 hover:text-neon-pink transition-colors"
                    >
                        <RefreshCcw size={20} />
                    </button>
                </div>
            </div>

            {/* Info Modal */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-dark-card w-full max-w-lg rounded-[40px] border border-white/10 p-8 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6">
                                <button onClick={() => setShowInfo(false)} className="text-white/20 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <h2 className="text-3xl font-black italic tracking-tighter mb-6">
                                <span className="text-neon-cyan neon-text-cyan">RING OF FIRE</span>
                            </h2>

                            <div className="space-y-6 text-white/60">
                                <div className="space-y-2">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-widest">How to Play</h3>
                                    <p className="text-sm leading-relaxed">Players take turns drawing a card from the circle. Each card rank corresponds to a specific rule. If a player draws the 4th King, they must drink the entire 'King's Cup' and the game ends.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-widest">Core Rules</h3>
                                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {rules.map((rule) => (
                                            <li key={rule.rank} className="flex gap-3 text-[12px] border-b border-white/5 pb-2 last:border-0">
                                                <span className="text-white font-black min-w-[20px]">{rule.rank}:</span>
                                                <span>{rule.title} - {rule.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-4">
                                    <NeonButton variant="cyan" onClick={() => setShowInfo(false)} className="w-full">Start Playing!</NeonButton>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative w-full max-w-6xl flex-1 flex flex-col lg:flex-row items-center justify-center gap-12">
                {/* The Circular Deck */}
                <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] flex items-center justify-center">
                    {/* Ring of cards */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {deck.map((card, index) => {
                            const angle = (index / deck.length) * 360;
                            const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 140 : 200;
                            return (
                                <motion.div
                                    key={card.id}
                                    initial={false}
                                    animate={{
                                        rotate: angle,
                                        x: Math.cos((angle * Math.PI) / 180) * radius,
                                        y: Math.sin((angle * Math.PI) / 180) * radius,
                                    }}
                                    whileHover={{ scale: 1.1, zIndex: 50 }}
                                    className="absolute w-12 h-18 md:w-16 md:h-24 cursor-pointer"
                                    onClick={() => drawCard(card)}
                                >
                                    <div className="w-full h-full rounded-md border border-neon-cyan/50 bg-dark-card shadow-[0_0_10px_rgba(0,243,253,0.2)] overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* The Current Flipped Card in Center */}
                    <div className="z-20">
                        <AnimatePresence mode="wait">
                            {gameOver ? (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center glass p-8 rounded-[40px] border-neon-pink neon-border-pink relative z-50 bg-black/40"
                                >
                                    <h2 className="text-4xl font-black text-neon-pink mb-2 italic tracking-tighter shadow-sm">DRINK THE CUP!</h2>
                                    <p className="text-white/60 mb-6 font-medium">You drew the 4th King. You know the rules...</p>
                                    <NeonButton onClick={resetGame} variant="pink" className="px-10">Play Again</NeonButton>
                                </motion.div>
                            ) : currentCard ? (
                                <motion.div
                                    key={currentCard.id}
                                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                >
                                    <Card
                                        card={currentCard}
                                        isFlipped={isFlipped}
                                        className="w-40 h-60 md:w-48 md:h-72"
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center"
                                >
                                    <div className="w-40 h-40 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs font-bold uppercase tracking-widest text-center px-4">
                                        Select a card from the ring
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* King Indicators (Responsive: Bottom on mobile, Side on desktop) */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:absolute md:left-4 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 flex md:flex-col gap-3 md:gap-4 z-40 bg-black/20 backdrop-blur-md p-3 md:p-0 rounded-2xl md:bg-transparent md:backdrop-blur-none">
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            animate={i <= kingCount ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border-2 flex items-center justify-center font-bold text-base md:text-lg transition-all duration-500 overflow-hidden relative ${i <= kingCount
                                ? "border-neon-pink bg-neon-pink/20 text-neon-pink shadow-[0_0_20px_#ff007f55]"
                                : "border-white/5 text-white/10 bg-white/5"
                                }`}
                        >
                            <span className="relative z-10">K</span>
                            {i <= kingCount && (
                                <motion.div
                                    initial={{ y: 50 }}
                                    animate={{ y: 0 }}
                                    className="absolute inset-0 bg-neon-pink/20 -z-0"
                                />
                            )}
                        </motion.div>
                    ))}
                    <span className="hidden md:block text-[10px] uppercase tracking-widest text-white/20 font-bold text-center mt-2">Kings</span>
                </div>

                {/* Rule Display Column */}
                <div className="w-full lg:w-80 h-full flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {currentCard && isFlipped && currentRule && (
                            <motion.div
                                key={currentCard.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass p-8 rounded-3xl border-neon-cyan/20 flex flex-col"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center font-bold text-xl text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                                        {currentCard.rank}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{currentRule.title}</h3>
                                </div>
                                <p className="text-white/70 leading-relaxed text-lg italic">
                                    &quot;{currentRule.description}&quot;
                                </p>
                                <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-2 text-white/30 text-xs uppercase tracking-tighter">
                                    <Info size={14} />
                                    Pick another card to continue
                                </div>
                            </motion.div>
                        )}
                        {(!currentCard || !isFlipped) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hidden lg:flex flex-col items-center text-center text-white/10"
                            >
                                <HelpCircle size={48} className="mb-4 opacity-10" />
                                <p className="uppercase tracking-[0.2em] text-sm">Waiting for action...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Rules Edit Modal (Reused from Kings) */}
            <AnimatePresence>
                {showRuleEdit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-dark-card w-full max-w-2xl max-h-[80vh] rounded-3xl border border-white/10 overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold uppercase tracking-widest text-sm md:text-base">Edit Rules</h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={resetRules}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neon-pink/30 text-neon-pink/60 hover:text-neon-pink hover:bg-neon-pink/10 transition-all text-xs font-bold uppercase tracking-tighter"
                                    >
                                        <RefreshCcw size={14} />
                                        Reset Defaults
                                    </button>
                                    <button
                                        onClick={() => setShowRuleEdit(false)}
                                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                    >
                                        <Check className="text-neon-cyan" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 overflow-y-auto space-y-4">
                                {rules.map((rule, idx) => (
                                    <div key={rule.rank} className="flex gap-4 items-start glass p-4 rounded-2xl border-white/5">
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 flex items-center justify-center font-bold text-white/40">
                                            {rule.rank}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input
                                                className="bg-transparent border-none p-0 text-white font-bold w-full focus:ring-0 text-lg"
                                                value={rule.title}
                                                onChange={(e) => {
                                                    const newRules = [...rules];
                                                    newRules[idx].title = e.target.value;
                                                    setRules(newRules);
                                                }}
                                            />
                                            <textarea
                                                className="bg-transparent border-none p-0 text-white/50 text-sm w-full focus:ring-0 resize-none h-12"
                                                value={rule.description}
                                                onChange={(e) => {
                                                    const newRules = [...rules];
                                                    newRules[idx].description = e.target.value;
                                                    setRules(newRules);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Decorative Elements */}
            <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-cyan/5 blur-[120px] rounded-full -z-10" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/5 blur-[120px] rounded-full -z-10" />
        </main >
    );
}
