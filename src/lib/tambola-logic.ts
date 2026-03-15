// Tambola / Housie game logic
// Ticket: 3 rows × 9 columns, 5 numbers per row (15 numbers total)
// Column bands: col0=1-9, col1=10-19, ..., col7=70-79, col8=80-90

export interface TambolaTicket {
  id: string;
  playerName: string;
  grid: (number | null)[][];  // 3 rows × 9 cols, null = blank cell
  marked: boolean[][];
}

export type WinType = 'early-five' | 'top-line' | 'middle-line' | 'bottom-line' | 'full-house';

export interface WinResult {
  type: WinType;
  label: string;
  sips: number;
}

export const WIN_DEFINITIONS: Record<WinType, { label: string; sips: number }> = {
  'early-five':    { label: 'Early Five',   sips: 1 },
  'top-line':      { label: 'Top Line',     sips: 2 },
  'middle-line':   { label: 'Middle Line',  sips: 2 },
  'bottom-line':   { label: 'Bottom Line',  sips: 2 },
  'full-house':    { label: 'Full House',   sips: 5 },
};

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateTicket(id: string, playerName: string): TambolaTicket {
  // Column ranges: col i covers [i*10+1 .. i*10+9] except col 8 covers [80..90]
  const colRanges: [number, number][] = [
    [1, 9], [10, 19], [20, 29], [30, 39],
    [40, 49], [50, 59], [60, 69], [70, 79], [80, 90],
  ];

  // For each column, pick how many numbers to place (total 5 per row, 9 cols, 3 rows)
  // Standard tambola: each column has 1 or 2 numbers across the 3 rows
  // We need exactly 5 filled cells per row and exactly 15 total.
  // Strategy: decide per-column how many entries (1 or 2), summing to 15 across 9 cols.
  // 9 cols × avg 1.67 = 15. So 6 cols get 2 numbers, 3 cols get 1 number.

  const grid: (number | null)[][] = Array.from({ length: 3 }, () => Array(9).fill(null));

  // Decide column counts: 6 cols with 2, 3 cols with 1
  const colCounts = fisherYates([2, 2, 2, 2, 2, 2, 1, 1, 1]);

  for (let col = 0; col < 9; col++) {
    const [min, max] = colRanges[col];
    const pool = fisherYates(
      Array.from({ length: max - min + 1 }, (_, i) => min + i)
    );
    const count = colCounts[col];
    const chosen = pool.slice(0, count);
    const rows = fisherYates([0, 1, 2]).slice(0, count).sort((a, b) => a - b);
    rows.forEach((row, i) => {
      grid[row][col] = chosen[i];
    });
  }

  // Ensure each row has exactly 5 numbers — adjust if needed
  // Count per row
  for (let attempt = 0; attempt < 100; attempt++) {
    const rowCounts = grid.map(row => row.filter(v => v !== null).length);
    if (rowCounts.every(c => c === 5)) break;
    // Find rows that are over/under
    const over = rowCounts.findIndex(c => c > 5);
    const under = rowCounts.findIndex(c => c < 5);
    if (over === -1 || under === -1) break;
    // Move a number from over-row to under-row in any shared column
    for (let col = 0; col < 9; col++) {
      if (grid[over][col] !== null && grid[under][col] === null) {
        grid[under][col] = grid[over][col];
        grid[over][col] = null;
        break;
      }
    }
  }

  const marked: boolean[][] = Array.from({ length: 3 }, () => Array(9).fill(false));

  return { id, playerName, grid, marked };
}

export function generateCallerNumbers(): number[] {
  return fisherYates(Array.from({ length: 90 }, (_, i) => i + 1));
}

export function markNumber(ticket: TambolaTicket, number: number): TambolaTicket {
  const marked = ticket.marked.map(row => [...row]);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 9; c++) {
      if (ticket.grid[r][c] === number) {
        marked[r][c] = true;
      }
    }
  }
  return { ...ticket, marked };
}

export function checkWins(ticket: TambolaTicket, claimed: Set<WinType>): WinResult[] {
  const wins: WinResult[] = [];

  // Count total marked
  const totalMarked = ticket.marked.flat().filter(Boolean).length;

  if (!claimed.has('early-five') && totalMarked >= 5) {
    wins.push({ type: 'early-five', ...WIN_DEFINITIONS['early-five'] });
  }

  const rowComplete = [0, 1, 2].map(r =>
    ticket.grid[r].every((v, c) => v === null || ticket.marked[r][c])
  );

  if (!claimed.has('top-line') && rowComplete[0]) {
    wins.push({ type: 'top-line', ...WIN_DEFINITIONS['top-line'] });
  }
  if (!claimed.has('middle-line') && rowComplete[1]) {
    wins.push({ type: 'middle-line', ...WIN_DEFINITIONS['middle-line'] });
  }
  if (!claimed.has('bottom-line') && rowComplete[2]) {
    wins.push({ type: 'bottom-line', ...WIN_DEFINITIONS['bottom-line'] });
  }
  if (!claimed.has('full-house') && rowComplete.every(Boolean)) {
    wins.push({ type: 'full-house', ...WIN_DEFINITIONS['full-house'] });
  }

  return wins;
}
