"use client";

import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { Wine, Flame, Settings } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-white bg-dark-bg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter italic">
          <span className="text-neon-pink neon-text-pink">DRINK</span>
          <span className="text-neon-cyan neon-text-cyan">DECK</span>
        </h1>
        <p className="text-white/60 tracking-[0.3em] uppercase text-sm">
          The Premium Party Essential
        </p>
      </motion.div>

      <div className="max-w-2xl w-full">
        {/* Ring of Fire Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass p-10 rounded-[40px] flex flex-col items-center text-center border-neon-cyan/20 shadow-[0_0_50px_rgba(0,243,255,0.05)]"
        >
          <div className="w-20 h-20 bg-neon-cyan/10 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
            <Flame className="text-neon-cyan w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">RING OF FIRE</h2>
          <p className="text-white/40 text-lg mb-10 leading-relaxed">
            The gold standard of social drinking games. A chaotic circle of cards, rules, and the dreaded King's Cup.
          </p>
          <NeonButton variant="cyan" href="/ring-of-fire" className="w-full md:w-auto px-12 py-4">Start Game</NeonButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 flex gap-6"
      >
        <Link href="/rules" className="flex items-center gap-2 text-white/40 hover:text-neon-pink transition-colors text-sm uppercase tracking-widest">
          <Settings className="w-4 h-4" />
          Global Rules
        </Link>
      </motion.div>

      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-pink/5 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 blur-[120px] rounded-full -z-10" />
    </main>
  );
}
