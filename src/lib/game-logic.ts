export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

export interface Rule {
  rank: Rank;
  title: string;
  description: string;
}

export const defaultRules: Rule[] = [
  { rank: 'A', title: 'Waterfall', description: 'Everyone starts drinking. You can only stop when the person to your right stops.' },
  { rank: '2', title: 'You', description: 'Pick someone to take a drink.' },
  { rank: '3', title: 'Me', description: 'Take a drink yourself.' },
  { rank: '4', title: 'Floor', description: 'Last person to touch the floor drinks.' },
  { rank: '5', title: 'Guys', description: 'All the guys drink.' },
  { rank: '6', title: 'Chicks', description: 'All the ladies drink.' },
  { rank: '7', title: 'Heaven', description: 'Last person to point to the sky drinks.' },
  { rank: '8', title: 'Mate', description: 'Pick a drinking buddy. Every time you drink, they drink.' },
  { rank: '9', title: 'Rhyme', description: 'Say a word, and everyone must rhyme with it. First to fail drinks.' },
  { rank: '10', title: 'Categories', description: 'Pick a category. Everyone names something in it. First to fail drinks.' },
  { rank: 'J', title: 'Never Have I Ever', description: 'Play a round of Never Have I Ever.' },
  { rank: 'Q', title: 'Question Master', description: 'You are the Question Master. If anyone answers your question, they drink.' },
  { rank: 'K', title: 'Kings Cup', description: 'Pour some of your drink into the center cup. The person who draws the 4th King drinks the whole cup!' },
];

export const createDeck = (): Card[] => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, id: `${rank}-${suit}` });
    }
  }

  return shuffle(deck);
};

export const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
