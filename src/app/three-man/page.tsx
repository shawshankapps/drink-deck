"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "@/components/ui/NeonButton";
import { ChevronLeft, RefreshCcw, UserCircle2, Dices as DiceIcon, Info, X } from "lucide-react";
import Link from "next/link";

export default function ThreeManPage() {
    const [dice, setDice] = useState([1, 1]);
    const [rolling, setRolling] = useState(false);
    const [threeMan, setThreeMan] = useState<string | null>(null);
    const [message, setMessage] = useState("Roll to start the game!");
    const [history, setHistory] = useState<string[]>([]);
    const [showInfo, setShowInfo] = useState(false);

    const rollDice = () => {
        if (rolling) return;
        setRolling(true);
        setMessage("The dice are dancing...");

        // Match animation duration
        setTimeout(() => {
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            setDice([d1, d2]);
            setRolling(false);
            calculateResult(d1, d2);
        }, 1200);
    };

    const calculateResult = (d1: number, d2: number) => {
        const sum = d1 + d2;
        let newMsg = "";
        const rules = [];
        let type: 'drink' | 'assign' | 'status' | 'none' = 'none';

        if (sum === 3 || d1 === 3 || d2 === 3) {
            if (!threeMan) {
                setThreeMan("Current Player");
                newMsg = "👑 YOU ARE THE THREE MAN!";
                type = 'status';
            } else {
                rules.push("🥃 THREE MAN DRINKS");
                type = 'drink';
            }
        }

        if (sum === 7) { rules.push("👈 LEFT DRINKS"); type = 'drink'; }
        if (sum === 11) { rules.push("👉 RIGHT DRINKS"); type = 'drink'; }
        if (d1 === d2) { rules.push(`🎯 DOUBLES: ASSIGN ${d1}`); type = 'assign'; }

        if (rules.length > 0) {
            newMsg = rules.join(" + ");
        } else if (!newMsg) {
            newMsg = "Safe! Pass the dice.";
            type = 'none';
        }

        setMessage(newMsg);
        setHistory([`[${d1}, ${d2}] ${newMsg}`, ...history.slice(0, 5)]);
    };

    const resetGame = () => {
        setDice([1, 1]);
        setThreeMan(null);
        setMessage("Roll to start the game!");
        setHistory([]);
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
                    <span className="text-neon-cyan neon-text-cyan">THREE</span>
                    <span className="text-white/20">.MAN</span>
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
                                <span className="text-neon-cyan neon-text-cyan">HOW TO PLAY</span>
                            </h2>

                            <div className="space-y-6 text-white/60">
                                <div className="space-y-2">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-widest">The Objective</h3>
                                    <p className="text-sm leading-relaxed">Three Man is a classic dice game where luck determines who drinks. One person is designated as the "Three Man" and must face specific penalties.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-widest">Dice Rules</h3>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-[13px] border-l-2 border-neon-cyan pl-4">
                                            <span className="text-white font-black">ANY 3 / SUM 3:</span>
                                            <span>If there is no Three Man, you become it. If there is, they MUST drink.</span>
                                        </li>
                                        <li className="flex gap-3 text-[13px] border-l-2 border-neon-pink pl-4">
                                            <span className="text-white font-black">SUM OF 7 / 11:</span>
                                            <span>The person to your Left (7) or Right (11) must take a drink.</span>
                                        </li>
                                        <li className="flex gap-3 text-[13px] border-l-2 border-white/20 pl-4">
                                            <span className="text-white font-black">DOUBLES:</span>
                                            <span>You get to assign sips equal to the dice value to anyone you want!</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="pt-4">
                                    <NeonButton variant="cyan" onClick={() => setShowInfo(false)} className="w-full">Got it!</NeonButton>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col items-center gap-8 w-full max-w-4xl relative z-10">
                {/* Game State */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex gap-8 items-center"
                >
                    <div className={`flex flex-col items-center gap-2 p-6 glass rounded-[32px] border-white/5 transition-all duration-700 ${threeMan ? 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_30px_rgba(0,243,255,0.1)]' : 'opacity-30'}`}>
                        <div className={`p-4 rounded-2xl ${threeMan ? 'bg-neon-cyan/20' : 'bg-white/5'}`}>
                            <UserCircle2 className={threeMan ? "text-neon-cyan" : "text-white/20"} size={40} />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Three Man Status</span>
                        <span className={`text-lg font-bold tracking-tight ${threeMan ? 'text-white' : 'text-white/20'}`}>
                            {threeMan ? "ACTIVE" : "VACANT"}
                        </span>
                    </div>
                </motion.div>

                {/* Dice Area */}
                <div className="flex gap-6 md:gap-12 py-8 md:py-12 relative">
                    <div className="absolute inset-0 bg-neon-cyan/5 blur-[100px] rounded-full -z-10 animate-pulse" />
                    {dice.map((value, idx) => (
                        <motion.div
                            key={idx}
                            animate={rolling ? {
                                rotate: [0, 90, 180, 270, 360, 450, 540, 630, 720],
                                x: [0, 20, -20, 30, -30, 15, -15, 0],
                                y: [0, -30, 20, -20, 30, -15, 15, 0],
                                scale: [1, 1.1, 0.9, 1.1, 1],
                            } : {
                                rotate: value * 90, // Static rotation based on value
                                scale: 1
                            }}
                            transition={{
                                duration: rolling ? 1.2 : 0.5,
                                ease: "easeInOut"
                            }}
                            className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-[24px] flex items-center justify-center relative shadow-[0_15px_30px_rgba(0,0,0,0.3),0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            <DiceFace value={value} />
                        </motion.div>
                    ))}
                </div>

                {/* Actions & Feedback */}
                <div className="flex flex-col items-center gap-8 w-full">
                    <div className="h-24 flex items-center justify-center w-full px-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={message}
                                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                                className="text-2xl md:text-4xl font-black text-center tracking-tight italic uppercase"
                            >
                                <span className={message.includes("DRINKS") || message.includes("ASSIGN") ? "text-neon-pink neon-text-pink" : "text-white"}>
                                    {message}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <NeonButton
                        variant="cyan"
                        onClick={rollDice}
                        disabled={rolling}
                        className="px-16 py-6 text-lg"
                    >
                        {rolling ? "ROLLING..." : "ROLL DICE"}
                    </NeonButton>
                </div>

                {/* History & Quick Rules Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-8">
                    <div className="space-y-4">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">Roll History</h3>
                        <div className="flex flex-col gap-2">
                            {history.length === 0 && <p className="text-white/10 text-xs italic">No rolls yet...</p>}
                            {history.map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 glass rounded-2xl border-white/5 text-sm flex justify-between items-center"
                                >
                                    <span className="font-mono text-neon-cyan">{h.split(' ')[0]}</span>
                                    <span className="text-white/60 font-bold uppercase tracking-tighter">{h.split(' ').slice(1).join(' ')}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">Dice Rules</h3>
                        <div className="glass rounded-[32px] p-6 border-white/5 text-[11px] space-y-3 leading-tight uppercase font-bold tracking-widest text-white/40">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Any 3 or Sum 3</span>
                                <span className="text-neon-cyan">Three Man</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Sum of 7</span>
                                <span className="text-neon-pink text-right">Left Drinks</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Sum of 11</span>
                                <span className="text-neon-cyan text-right">Right Drinks</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Doubles</span>
                                <span className="text-white text-right">Assign Sips</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorations */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-cyan/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-pink/5 blur-[120px] rounded-full" />
            </div>
        </main>
    );
}

function DiceFace({ value }: { value: number }) {
    const dotPositions: Record<number, string[]> = {
        1: ['center'],
        2: ['top-right', 'bottom-left'],
        3: ['top-right', 'center', 'bottom-left'],
        4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
        6: ['top-left', 'top-right', 'center-left', 'center-right', 'bottom-left', 'bottom-right']
    };

    const getPos = (pos: string) => {
        switch (pos) {
            case 'top-left': return 'top-4 left-4';
            case 'top-right': return 'top-4 right-4';
            case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
            case 'center-left': return 'top-1/2 left-4 -translate-y-1/2';
            case 'center-right': return 'top-1/2 right-4 -translate-y-1/2';
            case 'bottom-left': return 'bottom-4 left-4';
            case 'bottom-right': return 'bottom-4 right-4';
            default: return '';
        }
    };

    return (
        <>
            {dotPositions[value].map((pos, i) => (
                <div key={i} className={`absolute w-4 h-4 bg-dark-bg rounded-full ${getPos(pos)}`} />
            ))}
        </>
    );
}
