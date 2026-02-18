"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Info, HelpCircle, ShieldAlert, Users } from "lucide-react";
import Link from "next/link";

export default function GlobalRulesPage() {
    const generalRules = [
        {
            title: "Play Responsibly",
            icon: <ShieldAlert className="text-neon-pink" />,
            description: "Drinking games are for entertainment. Know your limits, and never pressure anyone to drink more than they are comfortable with."
        },
        {
            title: "House Rules",
            icon: <Info className="text-neon-cyan" />,
            description: "Specific cards can be edited within each game. Agree on additions (like 'Eye Contact' or 'No Swearing') before starting."
        },
        {
            title: "The Circle",
            icon: <Users className="text-neon-purple" />,
            description: "Play always proceeds clockwise. In waterfall, the person who draws the card starts, and the chain continues until they stop."
        },
        {
            title: "The Cup",
            icon: <HelpCircle className="text-neon-green" />,
            description: "In Kings, the center cup is filled by the first 3 Kings drawn. The 4th King draws the short straw and drinks the entire cup."
        }
    ];

    return (
        <main className="min-h-screen bg-dark-bg text-white p-4 md:p-8 flex flex-col items-center">
            <div className="w-full max-w-4xl flex justify-between items-center mb-12">
                <Link href="/">
                    <motion.div whileHover={{ x: -5 }} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer">
                        <ChevronLeft size={20} />
                        <span className="text-xs uppercase tracking-widest font-bold">Back</span>
                    </motion.div>
                </Link>
                <h1 className="text-2xl font-black italic tracking-tighter">
                    <span className="text-neon-cyan neon-text-cyan">GLOBAL</span>
                    <span className="text-white/20">.RULES</span>
                </h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="w-full max-w-4xl space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-[40px] border-white/5"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {generalRules.map((rule, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-3"
                            >
                                <div className="flex items-center gap-3">
                                    {rule.icon}
                                    <h3 className="text-xl font-bold tracking-tight">{rule.title}</h3>
                                </div>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    {rule.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-8 text-center"
                >
                    <p className="text-white/30 text-xs uppercase tracking-[0.5em] mb-4">DrinkDeck v1.0</p>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto" />
                </motion.div>
            </div>

            {/* Decorative */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-neon-purple/5 blur-[150px] rounded-full -z-10" />
        </main>
    );
}
