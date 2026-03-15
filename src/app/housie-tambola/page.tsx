"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateTicket,
  generateCallerNumbers,
  markNumber,
  checkWins,
  TambolaTicket,
  WinResult,
  WinType,
} from "@/lib/tambola-logic";
import { NeonButton } from "@/components/ui/NeonButton";
import { ChevronLeft, Plus, Minus, Play, ChevronRight, Trophy, RotateCcw, X } from "lucide-react";
import Link from "next/link";

// ─── Setup Screen ────────────────────────────────────────────────────────────

function SetupScreen({ onStart }: { onStart: (names: string[]) => void }) {
  const [players, setPlayers] = useState<string[]>(["Player 1", "Player 2"]);

  const add = () => setPlayers(p => [...p, `Player ${p.length + 1}`]);
  const remove = (i: number) => setPlayers(p => p.filter((_, idx) => idx !== i));
  const update = (i: number, val: string) =>
    setPlayers(p => p.map((n, idx) => (idx === i ? val : n)));

  return (
    <main className="min-h-screen bg-dark-bg text-white flex flex-col items-center p-6 md:p-12">
      <div className="w-full max-w-lg">
        <Link href="/">
          <motion.div whileHover={{ x: -5 }} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-10 w-fit">
            <ChevronLeft size={18} />
            <span className="text-xs uppercase tracking-widest font-bold">Menu</span>
          </motion.div>
        </Link>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-black italic tracking-tighter mb-2">
            <span className="text-neon-pink neon-text-pink">HOUSIE</span>
            <span className="text-white/20"> · </span>
            <span className="text-neon-cyan neon-text-cyan">TAMBOLA</span>
          </h1>
          <p className="text-white/40 text-sm uppercase tracking-[0.3em]">Party Edition</p>
        </motion.div>

        {/* Drink rules */}
        <div className="glass rounded-3xl p-6 mb-8 border-white/5 space-y-3">
          <h3 className="text-xs uppercase tracking-widest text-white/40 font-bold mb-4">Drink Rules</h3>
          {[
            { label: "Early Five", rule: "First to mark 5 numbers → picks someone to take 1 sip" },
            { label: "Any Line", rule: "Complete a row → make someone take 2 sips" },
            { label: "Full House", rule: "Complete your ticket → everyone else finishes their drink!" },
          ].map(({ label, rule }) => (
            <div key={label} className="flex gap-3 text-sm">
              <span className="text-neon-cyan font-bold min-w-[90px]">{label}</span>
              <span className="text-white/50">{rule}</span>
            </div>
          ))}
        </div>

        {/* Players */}
        <div className="glass rounded-3xl p-6 border-white/5 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-bold">Players</h3>
            <button
              onClick={add}
              disabled={players.length >= 8}
              className="flex items-center gap-1 text-neon-cyan text-xs font-bold uppercase tracking-wider hover:opacity-80 disabled:opacity-20 transition-opacity"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {players.map((name, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-neon-pink/10 flex items-center justify-center text-neon-pink font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <input
                  value={name}
                  onChange={e => update(i, e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                  placeholder={`Player ${i + 1}`}
                />
                {players.length > 2 && (
                  <button onClick={() => remove(i)} className="text-white/20 hover:text-neon-pink transition-colors">
                    <Minus size={16} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <NeonButton
          variant="pink"
          onClick={() => onStart(players.filter(Boolean))}
          className="w-full text-sm flex items-center justify-center gap-2"
        >
          <Play size={16} /> Start Game
        </NeonButton>
      </div>

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-pink/5 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 blur-[120px] rounded-full -z-10" />
    </main>
  );
}

// ─── Ticket Component ─────────────────────────────────────────────────────────

function TicketGrid({
  ticket,
  calledNumbers,
  onMark,
  compact = false,
}: {
  ticket: TambolaTicket;
  calledNumbers: Set<number>;
  onMark?: (row: number, col: number, num: number) => void;
  compact?: boolean;
}) {
  return (
    <div className="w-full">
      {ticket.grid.map((row, r) => (
        <div key={r} className={`grid grid-cols-9 gap-1 ${r < 2 ? "mb-1" : ""}`}>
          {row.map((num, c) => {
            const isCalled = num !== null && calledNumbers.has(num);
            const isMarked = ticket.marked[r][c];
            return (
              <motion.div
                key={c}
                whileTap={num && onMark ? { scale: 0.9 } : {}}
                onClick={() => num && onMark && onMark(r, c, num)}
                className={`
                  ${compact ? "h-7 text-[10px]" : "h-9 text-sm"}
                  rounded-lg flex items-center justify-center font-bold transition-all duration-200 select-none
                  ${num === null
                    ? "bg-white/3 border border-white/5"
                    : isMarked
                      ? "bg-neon-pink/30 border border-neon-pink text-neon-pink shadow-[0_0_8px_rgba(255,0,127,0.4)] cursor-pointer"
                      : isCalled
                        ? "bg-neon-cyan/20 border border-neon-cyan/60 text-neon-cyan cursor-pointer animate-pulse"
                        : onMark
                          ? "bg-white/5 border border-white/10 text-white/70 cursor-pointer hover:border-white/30"
                          : "bg-white/5 border border-white/10 text-white/60"
                  }
                `}
              >
                {num ?? ""}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Main Game Screen ─────────────────────────────────────────────────────────

function GameScreen({
  tickets: initialTickets,
  onReset,
}: {
  tickets: TambolaTicket[];
  onReset: () => void;
}) {
  const [callerNumbers] = useState(() => generateCallerNumbers());
  const [callerIdx, setCallerIdx] = useState(-1);
  const [tickets, setTickets] = useState(initialTickets);
  const [calledSet, setCalledSet] = useState<Set<number>>(new Set());
  const [claimedWins, setClaimedWins] = useState<Map<string, Set<WinType>>>(
    () => new Map(initialTickets.map(t => [t.id, new Set()]))
  );
  const [activeWins, setActiveWins] = useState<(WinResult & { playerName: string })[]>([]);
  const [viewTicketIdx, setViewTicketIdx] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const currentNumber = callerIdx >= 0 ? callerNumbers[callerIdx] : null;

  const callNext = useCallback(() => {
    const nextIdx = callerIdx + 1;
    if (nextIdx >= 90) return;

    const num = callerNumbers[nextIdx];
    const newCalled = new Set(calledSet).add(num);
    setCallerIdx(nextIdx);
    setCalledSet(newCalled);

    // Auto-mark all tickets and check wins
    setTickets(prev => {
      const updated = prev.map(t => markNumber(t, num));

      // Check wins
      const newWins: (WinResult & { playerName: string })[] = [];
      updated.forEach(t => {
        const claimed = claimedWins.get(t.id) ?? new Set<WinType>();
        const wins = checkWins(t, claimed);
        wins.forEach(w => {
          newWins.push({ ...w, playerName: t.playerName });
          claimed.add(w.type);
        });
        claimedWins.set(t.id, claimed);
      });

      if (newWins.length > 0) {
        setActiveWins(newWins);
        if (newWins.some(w => w.type === 'full-house')) setGameOver(true);
      }

      return updated;
    });
    setClaimedWins(new Map(claimedWins));
  }, [callerIdx, calledSet, callerNumbers, claimedWins]);

  const recentNumbers = callerNumbers.slice(Math.max(0, callerIdx - 4), callerIdx).reverse();

  return (
    <main className="min-h-screen bg-dark-bg text-white flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <button onClick={onReset} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
          <ChevronLeft size={18} />
          <span className="text-xs uppercase tracking-widest font-bold">Setup</span>
        </button>
        <h1 className="text-xl font-black italic tracking-tighter">
          <span className="text-neon-pink neon-text-pink">HOUSIE</span>
          <span className="text-white/20"> · </span>
          <span className="text-neon-cyan neon-text-cyan">TAMBOLA</span>
        </h1>
        <button onClick={onReset} className="text-white/20 hover:text-neon-pink transition-colors">
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Caller */}
        <div className="flex flex-col gap-4">
          {/* Current number */}
          <div className="glass rounded-3xl p-8 border-white/5 flex flex-col items-center">
            <p className="text-xs uppercase tracking-widest text-white/30 font-bold mb-4">Current Number</p>
            <AnimatePresence mode="wait">
              {currentNumber ? (
                <motion.div
                  key={currentNumber}
                  initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-32 h-32 rounded-full bg-neon-pink/10 border-2 border-neon-pink shadow-[0_0_40px_rgba(255,0,127,0.4)] flex items-center justify-center"
                >
                  <span className="text-5xl font-black text-neon-pink neon-text-pink">{currentNumber}</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs uppercase tracking-widest text-center px-4"
                >
                  Press Call
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent numbers */}
            {recentNumbers.length > 0 && (
              <div className="flex gap-2 mt-6">
                {recentNumbers.map((n, i) => (
                  <div
                    key={n}
                    style={{ opacity: 1 - i * 0.2 }}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/40"
                  >
                    {n}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mt-6">
              <span className="text-white/30 text-xs">{callerIdx + 1} / 90</span>
            </div>

            <NeonButton
              variant="pink"
              onClick={callNext}
              disabled={callerIdx >= 89 || gameOver}
              className="mt-4 w-full flex items-center justify-center gap-2"
            >
              <ChevronRight size={18} /> Call Next
            </NeonButton>
          </div>

          {/* Called numbers grid */}
          <div className="glass rounded-3xl p-5 border-white/5">
            <p className="text-xs uppercase tracking-widest text-white/30 font-bold mb-4">Called Numbers</p>
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 90 }, (_, i) => i + 1).map(n => (
                <div
                  key={n}
                  className={`h-7 rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    calledSet.has(n)
                      ? n === currentNumber
                        ? "bg-neon-pink/40 text-neon-pink border border-neon-pink"
                        : "bg-white/10 text-white/60"
                      : "text-white/15"
                  }`}
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tickets */}
        <div className="flex flex-col gap-4">
          {/* Ticket tabs */}
          <div className="flex gap-2 flex-wrap">
            {tickets.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setViewTicketIdx(i)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  viewTicketIdx === i
                    ? "bg-neon-cyan/20 border border-neon-cyan text-neon-cyan"
                    : "glass border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                {t.playerName}
              </button>
            ))}
          </div>

          {/* Active ticket */}
          {tickets[viewTicketIdx] && (
            <motion.div
              key={viewTicketIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 border-white/5"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">{tickets[viewTicketIdx].playerName}&apos;s Ticket</h3>
                <span className="text-xs text-white/30">
                  {tickets[viewTicketIdx].marked.flat().filter(Boolean).length} / 15 marked
                </span>
              </div>
              <TicketGrid
                ticket={tickets[viewTicketIdx]}
                calledNumbers={calledSet}
              />
            </motion.div>
          )}

          {/* All tickets compact view */}
          {tickets.length > 1 && (
            <div className="glass rounded-3xl p-5 border-white/5">
              <p className="text-xs uppercase tracking-widest text-white/30 font-bold mb-4">All Tickets</p>
              <div className="space-y-4">
                {tickets.map(t => (
                  <div key={t.id}>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{t.playerName}</p>
                    <TicketGrid ticket={t} calledNumbers={calledSet} compact />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {activeWins.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-dark-card w-full max-w-md rounded-[40px] border border-neon-pink/30 p-8 text-center relative overflow-hidden"
            >
              <button
                onClick={() => setActiveWins([])}
                className="absolute top-5 right-5 text-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-5xl mb-4"
              >
                🎉
              </motion.div>

              {activeWins.map((w, i) => (
                <div key={i} className="mb-4">
                  <p className="text-neon-cyan text-xs uppercase tracking-widest font-bold mb-1">{w.playerName}</p>
                  <h2 className="text-3xl font-black italic text-neon-pink neon-text-pink mb-1">{w.label}!</h2>
                  <p className="text-white/60 text-sm">
                    {w.type === 'full-house'
                      ? "Everyone else finishes their drink!"
                      : `Pick someone to take ${w.sips} sip${w.sips > 1 ? "s" : ""}!`}
                  </p>
                </div>
              ))}

              <div className="flex gap-3 mt-6">
                <NeonButton variant="cyan" onClick={() => setActiveWins([])} className="flex-1 text-sm">
                  <Trophy size={14} className="inline mr-2" />
                  {gameOver ? "Game Over!" : "Continue"}
                </NeonButton>
                {gameOver && (
                  <NeonButton variant="pink" onClick={onReset} className="flex-1 text-sm">
                    Play Again
                  </NeonButton>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/5 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 blur-[120px] rounded-full -z-10" />
    </main>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function HousieTambolaPage() {
  const [tickets, setTickets] = useState<TambolaTicket[] | null>(null);

  const handleStart = (names: string[]) => {
    const generated = names.map((name, i) =>
      generateTicket(`ticket-${i}`, name)
    );
    setTickets(generated);
  };

  if (!tickets) return <SetupScreen onStart={handleStart} />;
  return <GameScreen tickets={tickets} onReset={() => setTickets(null)} />;
}
