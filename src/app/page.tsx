"use client";

import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { Wine, Flame, Settings, Dices, Layers, Crown, UserPlus, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Category = "all" | "cards" | "dice";

export default function Home() {
  const [category, setCategory] = useState<Category>("all");

  const cardGames = [
    { id: 'ring-of-fire', title: 'Ring of Fire', active: true, icon: <Flame className="text-neon-cyan" />, desc: 'The chaotic circle of cards and the dreaded King\'s Cup.' },
    { id: 'ride-the-bus', title: 'Ride the Bus', active: true, icon: <Layers className="text-neon-cyan" />, desc: 'A multi-stage journey of luck and logic gates.' },
    { id: 'fuck-dealer', title: 'Fuck the Dealer', active: false, icon: <UserPlus className="text-white/20" />, desc: 'Predict the card to pass the sips to the dealer.' },
    { id: 'pyramid', title: 'Pyramid', active: false, icon: <Crown className="text-white/20" />, desc: 'Build the pyramid and build the sips.' },
  ];

  const diceGames = [
    { id: 'three-man', title: 'Three Man', active: true, icon: <Dices className="text-neon-cyan" />, desc: 'Roll the dice and avoid becoming the Three Man.' },
    { id: 'liars-dice', title: 'Liars Dice', active: false, icon: <HelpCircle className="text-white/20" />, desc: 'Bluff your way to victory in this classic game of dice.' },
  ];

  const filteredCards = category === "dice" ? [] : cardGames;
  const filteredDice = category === "cards" ? [] : diceGames;

  return (
    <main className="min-h-screen flex flex-col items-center p-8 text-white bg-dark-bg">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-12 mb-16"
      >
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter italic">
          <span className="text-neon-pink neon-text-pink">DRINK</span>
          <span className="text-neon-cyan neon-text-cyan">DECK</span>
        </h1>
        <p className="text-white/60 tracking-[0.3em] uppercase text-sm font-bold">
          The Premium Party Essential
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex gap-4 mb-12 glass p-2 rounded-2xl border-white/5">
        {(["all", "cards", "dice"] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${category === cat
              ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              : "text-white/40 hover:text-white/60"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-6xl w-full space-y-16">
        {/* Card Games Section */}
        {filteredCards.length > 0 && (
          <section>
            <h3 className="text-xs uppercase tracking-[0.5em] text-neon-cyan neon-text-cyan font-bold mb-8 text-center">Card Classics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        {/* Dice Games Section */}
        {filteredDice.length > 0 && (
          <section>
            <h3 className="text-xs uppercase tracking-[0.5em] text-neon-pink neon-text-pink font-bold mb-8 text-center">Dice Duels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDice.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20 flex gap-6 pb-12"
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

function GameCard({ game }: { game: any }) {
  return (
    <motion.div
      whileHover={game.active ? { scale: 1.02, y: -5 } : {}}
      className={`glass p-8 rounded-3xl flex flex-col items-center text-center border-white/5 relative overflow-hidden group transition-all duration-300 ${!game.active ? "opacity-40 grayscale" : "hover:border-neon-cyan/50 cursor-pointer"
        }`}
    >
      {!game.active && (
        <div className="absolute top-4 right-4 bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-white/40">
          Locked
        </div>
      )}

      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 ${game.active ? 'group-hover:scale-110' : ''} ${game.id === 'ring-of-fire' ? 'bg-neon-cyan/10' : 'bg-white/5'}`}>
        {game.icon}
      </div>

      <h2 className={`text-xl font-bold mb-3 ${game.active ? "text-white" : "text-white/40"}`}>{game.title}</h2>
      <p className="text-white/30 text-sm mb-8 leading-relaxed">
        {game.desc}
      </p>

      {game.active ? (
        <Link href={`/${game.id}`} className="w-full">
          <NeonButton variant="cyan" className="w-full text-xs">Play Now</NeonButton>
        </Link>
      ) : (
        <NeonButton variant="cyan" disabled className="w-full text-xs bg-transparent border-white/5 text-white/20 cursor-not-allowed">
          Coming Soon
        </NeonButton>
      )}
    </motion.div>
  )
}
