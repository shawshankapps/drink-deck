"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createDeck, Card as CardType, Suit, Rank } from "@/lib/game-logic";
import { Card } from "@/components/Card";
import { NeonButton } from "@/components/ui/NeonButton";
import { ChevronLeft, RefreshCcw, Info, CheckCircle2, XCircle, Crown, X } from "lucide-react";
import Link from "next/link";

type Stage = 'color' | 'higher-lower' | 'outside-inside' | 'suit' | 'finished';

export default function RideTheBusPage() {
    const [deck, setDeck] = useState<CardType[]>([]);
    const [hand, setHand] = useState<CardType[]>([]);
    const [stage, setStage] = useState<Stage>('color');
    const [message, setMessage] = useState("Red or Black?");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [currentCard, setCurrentCard] = useState<CardType | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        setDeck(createDeck());
    }, []);

    const getRankValue = (rank: Rank): number => {
        const values: Record<Rank, number> = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
            'J': 11, 'Q': 12, 'K': 13, 'A': 14
        };
        return values[rank];
    };

    const drawAndCheck = (callback: (card: CardType) => boolean) => {
        if (deck.length === 0) return;

        setIsFlipped(false);
        setTimeout(() => {
            const newDeck = [...deck];
            const card = newDeck.pop()!;
            setDeck(newDeck);
            setCurrentCard(card);
            setIsFlipped(true);

            const correct = callback(card);
            setIsCorrect(correct);

            if (correct) {
                setHand([...hand, card]);
                advanceStage();
            } else {
                setMessage("Wrong! Drink and start over.");
                setTimeout(() => {
                    resetGame();
                }, 1500);
            }
        }, 300);
    };

    const advanceStage = () => {
        if (stage === 'color') {
            setStage('higher-lower');
            setMessage("Higher or Lower?");
        } else if (stage === 'higher-lower') {
            setStage('outside-inside');
            setMessage("Between or Outside?");
        } else if (stage === 'outside-inside') {
            setStage('suit');
            setMessage("Pick the Suit");
        } else if (stage === 'suit') {
            setStage('finished');
            setMessage("You rode the bus! Assign sips.");
        }
    };

    const resetGame = () => {
        setDeck(createDeck());
        setHand([]);
        setStage('color');
        setMessage("Red or Black?");
        setIsCorrect(null);
        setCurrentCard(null);
        setIsFlipped(false);
    };

    const handleGuess = (guess: string) => {
        if (stage === 'finished' || (isCorrect !== null && !isCorrect)) return;

        if (stage === 'color') {
            drawAndCheck((card) => {
                const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
                return guess === (isRed ? 'red' : 'black');
            });
        } else if (stage === 'higher-lower') {
            drawAndCheck((card) => {
                const prevValue = getRankValue(hand[0].rank);
                const currentValue = getRankValue(card.rank);
                if (guess === 'equal') return currentValue === prevValue;
                return guess === 'higher' ? currentValue > prevValue : currentValue < prevValue;
            });
        } else if (stage === 'outside-inside') {
            drawAndCheck((card) => {
                const v1 = getRankValue(hand[0].rank);
                const v2 = getRankValue(hand[1].rank);
                const currentValue = getRankValue(card.rank);
                const min = Math.min(v1, v2);
                const max = Math.max(v1, v2);
                if (guess === 'inside') return currentValue > min && currentValue < max;
                return currentValue < min || currentValue > max;
            });
        } else if (stage === 'suit') {
            drawAndCheck((card) => card.suit === guess);
        }
    };

    return (
        <main className="min-h-screen bg-dark-bg text-white p-4 md:p-8 flex flex-col items-center overflow-x-hidden">
            <div className="w-full max-w-4xl flex justify-between items-center mb-12 relative z-10">
                <Link href="/">
                    <motion.div whileHover={{ x: -5 }} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer">
                        <ChevronLeft size={20} />
                        <span className="text-xs uppercase tracking-widest font-bold">Menu</span>
                    </motion.div>
                </Link>
                <h1 className="text-2xl font-black italic tracking-tighter">
                    <span className="text-neon-pink neon-text-pink">RIDE</span>
                    <span className="text-white/20">.THE.BUS</span>
                </h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowInfo(true)}
                        className="p-2 glass rounded-lg text-white/60 hover:text-neon-cyan transition-colors"
                    >
                        <Info size={20} />
                    </button>
                    <button onClick={resetGame} className="p-2 glass rounded-lg text-white/60 hover:text-neon-pink transition-colors">
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
                                <span className="text-neon-pink neon-text-pink">RIDE THE BUS</span>
                            </h2>

                            <div className="space-y-6 text-white/60">
                                <div className="space-y-2">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-widest">How to Win</h3>
                                    <p className="text-sm leading-relaxed">You must complete 4 stages of predictions. If you fail any stage, you drink and start over from the very beginning!</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-widest">The Stages</h3>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-[13px] border-l-2 border-neon-pink pl-4">
                                            <span className="text-white font-black">1. COLOR:</span>
                                            <span>Is the card Red or Black?</span>
                                        </li>
                                        <li className="flex gap-3 text-[13px] border-l-2 border-neon-cyan pl-4">
                                            <span className="text-white font-black">2. HIGHER/LOWER:</span>
                                            <span>Is the next card Higher or Lower than the first?</span>
                                        </li>
                                        <li className="flex gap-3 text-[13px] border-l-2 border-white/20 pl-4">
                                            <span className="text-white font-black">3. IN/OUT:</span>
                                            <span>Is it between or outside your previous two cards?</span>
                                        </li>
                                        <li className="flex gap-3 text-[13px] border-l-2 border-neon-pink pl-4">
                                            <span className="text-white font-black">4. SUIT:</span>
                                            <span>Guess the exact suit (♥, ♦, ♣, ♠).</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="pt-4">
                                    <NeonButton variant="pink" onClick={() => setShowInfo(false)} className="w-full">Let's Ride!</NeonButton>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col items-center gap-8 md:gap-12 w-full max-w-4xl relative z-10">
                {/* Progress Bar */}
                <div className="w-full flex justify-between px-4 max-w-md">
                    {['Color', 'High/Low', 'In/Out', 'Suit'].map((s, idx) => {
                        const isActive = ['color', 'higher-lower', 'outside-inside', 'suit'].indexOf(stage) >= idx;
                        const isCompleted = ['color', 'higher-lower', 'outside-inside', 'suit', 'finished'].indexOf(stage) > idx;
                        return (
                            <div key={s} className="flex flex-col items-center gap-2">
                                <motion.div
                                    animate={isActive && !isCompleted ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className={`w-3 h-3 rounded-full shadow-lg transition-all duration-500 ${isCompleted ? "bg-neon-green shadow-neon-green/50" :
                                        isActive ? "bg-neon-cyan shadow-neon-cyan/50" : "bg-white/10"
                                        }`}
                                />
                                <span className={`text-[9px] md:text-[10px] uppercase tracking-widest font-black ${isActive ? "text-white" : "text-white/20"}`}>{s}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full relative">
                    <AnimatePresence>
                        {stage === 'finished' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center glass rounded-[40px] bg-black/60 border-neon-green shadow-[0_0_50px_rgba(57,255,20,0.1)] p-8"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                    className="mb-6"
                                >
                                    <Crown size={80} className="text-neon-green" />
                                </motion.div>
                                <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-neon-green mb-4">VICTORY!</h2>
                                <p className="text-white/80 text-lg md:text-xl font-bold uppercase tracking-widest mb-8">
                                    You rode the bus! <br />
                                    <span className="text-white">Assign 10 sips to anyone.</span>
                                </p>
                                <NeonButton variant="cyan" onClick={resetGame} className="px-12 py-4">Play Again</NeonButton>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Card Area */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-neon-pink/5 blur-[80px] rounded-full group-hover:bg-neon-pink/10 transition-all duration-700" />
                        <Card card={currentCard} isFlipped={isFlipped} />
                        <AnimatePresence>
                            {isCorrect !== null && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    exit={{ scale: 0, rotate: 45, opacity: 0 }}
                                    className="absolute -top-6 -right-6 z-20"
                                >
                                    {isCorrect ? (
                                        <div className="bg-neon-green/20 backdrop-blur-md p-3 rounded-2xl border border-neon-green shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                                            <CheckCircle2 className="text-neon-green w-10 h-10" />
                                        </div>
                                    ) : (
                                        <div className="bg-neon-pink/20 backdrop-blur-md p-3 rounded-2xl border border-neon-pink shadow-[0_0_20px_rgba(255,0,127,0.4)]">
                                            <XCircle className="text-neon-pink w-10 h-10" />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Interaction Area */}
                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
                        <div>
                            <AnimatePresence mode="wait">
                                <motion.h2
                                    key={message}
                                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                                    className={`text-3xl md:text-5xl font-black uppercase tracking-tight italic ${message.includes("Wrong") ? "text-neon-pink" : "text-white"}`}
                                >
                                    {message}
                                </motion.h2>
                            </AnimatePresence>
                            <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] mt-4">
                                {stage === 'finished' ? "Completed" : `Stage ${['color', 'higher-lower', 'outside-inside', 'suit'].indexOf(stage) + 1} of 4`}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-xs md:max-w-sm pt-4">
                            {stage === 'color' && (
                                <>
                                    <NeonButton variant="pink" onClick={() => handleGuess('red')} className="py-6">RED</NeonButton>
                                    <NeonButton variant="cyan" onClick={() => handleGuess('black')} className="py-6 border-white text-white">BLACK</NeonButton>
                                </>
                            )}
                            {stage === 'higher-lower' && (
                                <>
                                    <NeonButton variant="cyan" onClick={() => handleGuess('higher')} className="py-6">HIGHER</NeonButton>
                                    <NeonButton variant="pink" onClick={() => handleGuess('lower')} className="py-6">LOWER</NeonButton>
                                </>
                            )}
                            {stage === 'outside-inside' && (
                                <>
                                    <NeonButton variant="cyan" onClick={() => handleGuess('inside')} className="py-6">INSIDE</NeonButton>
                                    <NeonButton variant="pink" onClick={() => handleGuess('outside')} className="py-6">OUTSIDE</NeonButton>
                                </>
                            )}
                            {stage === 'suit' && (
                                <div className="grid grid-cols-2 gap-3 col-span-2">
                                    <button onClick={() => handleGuess('hearts')} className="p-6 glass rounded-[24px] hover:border-neon-pink hover:text-neon-pink transition-all text-3xl flex items-center justify-center">♥</button>
                                    <button onClick={() => handleGuess('diamonds')} className="p-6 glass rounded-[24px] hover:border-red-500 hover:text-red-500 transition-all text-3xl flex items-center justify-center text-red-500">♦</button>
                                    <button onClick={() => handleGuess('clubs')} className="p-6 glass rounded-[24px] hover:border-white hover:text-white transition-all text-3xl flex items-center justify-center">♣</button>
                                    <button onClick={() => handleGuess('spades')} className="p-6 glass rounded-[24px] hover:border-neon-cyan hover:text-neon-cyan transition-all text-3xl flex items-center justify-center text-neon-cyan">♠</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hand History */}
                <div className="w-full">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black mb-4 text-center">Your Current Hand</h3>
                    <div className="flex gap-4 overflow-x-auto w-full justify-center p-4">
                        {hand.length === 0 && <div className="text-white/5 italic uppercase tracking-widest text-xs">No cards yet</div>}
                        {hand.map((card, idx) => (
                            <motion.div
                                key={card.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="w-14 h-20 md:w-16 md:h-24 bg-white/5 glass rounded-2xl border-white/10 flex flex-col items-center justify-center shadow-lg group hover:border-neon-cyan/50 transition-colors"
                            >
                                <span className={`text-xl font-bold ${card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-500' : 'text-white'}`}>
                                    {card.rank}
                                </span>
                                <span className={`text-sm ${card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-500' : 'text-white'}`}>
                                    {card.suit === 'hearts' ? '♥' : card.suit === 'diamonds' ? '♦' : card.suit === 'clubs' ? '♣' : '♠'}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorations */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-neon-pink/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-neon-cyan/5 blur-[120px] rounded-full" />
            </div>
        </main>
    );
}
