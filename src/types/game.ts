export type Rarity = 'Common' | 'Uncommon' | 'Epic' | 'Mythic' | 'Legendary' | 'Super' | 'Ultra' | 'Secret';

export interface Enot {
  id: string;
  name: string;
  rarity: Rarity;
  emoji: string;
  photo: string;
  health: number;
  mood: number;
  hunger: number;
  level: number;
  experience: number;
  description: string;
  price: number;
}

export interface Food {
  id: string;
  name: string;
  emoji: string;
  price: number;
  healthRestore: number;
  hungerRestore: number;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  reward: { coins?: number; enot?: Rarity };
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface CraftItem {
  id: string;
  name: string;
  emoji: string;
  level: number;
  expReward: number;
}

export interface GameState {
  coins: number;
  woodCoins: number;
  experience: number;
  level: number;
  activeEnotId: string | null;
  enots: Enot[];
  inventory: { food: (Food & { quantity: number })[] };
  lastDailyBonus: number | null;
  lastHourlyBonus: number;
  lastWalk: number | null;
  lastFootball: number | null;
  lastBasketball: number | null;
  lastFeed: number | null;
  achievements: Achievement[];
  craftField: (CraftItem | null)[][];
  craftInventory: CraftItem[];
  clickCount: number;
  feedCount: number;
}
