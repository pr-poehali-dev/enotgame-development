import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { GameState, Enot, Food, Rarity } from '@/types/game';
import { INITIAL_ACHIEVEMENTS, ENOT_PHOTOS, SHOP_ENOTS, CRAFT_ITEMS, UPGRADE_CHANCES } from '@/data/gameData';

const INITIAL_ENOT: Enot = {
  id: 'enot-1',
  name: 'Серый Бродяга',
  rarity: 'Common',
  emoji: '🦝',
  photo: ENOT_PHOTOS.Common[0],
  health: 80,
  mood: 70,
  hunger: 60,
  level: 1,
  experience: 0,
  description: 'Твой первый енот. Дружелюбный и неприхотливый.',
  price: 100,
};

const INITIAL_STATE: GameState = {
  coins: 500,
  woodCoins: 0,
  experience: 0,
  level: 1,
  activeEnotId: 'enot-1',
  enots: [INITIAL_ENOT],
  inventory: { food: [] },
  lastDailyBonus: null,
  lastHourlyBonus: 0,
  lastWalk: null,
  lastFootball: null,
  lastBasketball: null,
  lastFeed: null,
  achievements: INITIAL_ACHIEVEMENTS,
  craftField: Array(8).fill(null).map(() => Array(8).fill(null)),
  craftInventory: [],
  clickCount: 0,
  feedCount: 0,
};

interface GameContextType {
  state: GameState;
  activeEnot: Enot | null;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  buyEnot: (enotData: Omit<Enot, 'id' | 'health' | 'mood' | 'hunger' | 'level' | 'experience'>) => boolean;
  buyFood: (food: Food) => boolean;
  feedEnot: (foodId: string) => { success: boolean; message: string };
  setActiveEnot: (id: string) => void;
  doWalk: () => { success: boolean; message: string };
  doFootball: () => { success: boolean; message: string };
  doBasketball: () => { success: boolean; message: string };
  claimDailyBonus: () => { success: boolean; amount?: number; message: string };
  claimHourlyBonus: () => { success: boolean; amount?: number; message: string };
  clickEnot: () => void;
  addExperience: (amount: number) => void;
  craftMerge: (row: number, col: number, targetRow: number, targetCol: number) => boolean;
  placeCraftItem: (itemId: string, row: number, col: number) => boolean;
  upgradeEnot: (enotId: string, targetRarity: Rarity) => { success: boolean; message: string };
  checkAchievements: () => void;
  addEnotByRarity: (rarity: Rarity) => void;
}

const GameContext = createContext<GameContextType | null>(null);

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('enotgame-state');
    if (saved) {
      try { return { ...INITIAL_STATE, ...JSON.parse(saved) }; }
      catch (_e) { return INITIAL_STATE; }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('enotgame-state', JSON.stringify(state));
  }, [state]);

  const activeEnot = state.enots.find(e => e.id === state.activeEnotId) ?? null;

  const addCoins = useCallback((amount: number) => {
    setState(s => ({ ...s, coins: s.coins + amount }));
  }, []);

  const spendCoins = useCallback((amount: number): boolean => {
    let ok = false;
    setState(s => {
      if (s.coins >= amount) { ok = true; return { ...s, coins: s.coins - amount }; }
      return s;
    });
    return ok;
  }, []);

  const addExperience = useCallback((amount: number) => {
    setState(s => {
      const newExp = s.experience + amount;
      const expToLevel = s.level * 200;
      if (newExp >= expToLevel) {
        return { ...s, experience: newExp - expToLevel, level: s.level + 1 };
      }
      return { ...s, experience: newExp };
    });
  }, []);

  const checkAchievements = useCallback(() => {
    setState(s => {
      const updated = s.achievements.map(a => {
        if (a.unlocked) return a;
        let progress = a.progress;
        if (a.id === 'first_feed' || a.id === 'feed_10') progress = s.feedCount;
        if (a.id === 'click_100' || a.id === 'click_500' || a.id === 'click_1000') progress = s.clickCount;
        if (a.id === 'first_walk') progress = s.lastWalk ? 1 : 0;
        if (a.id === 'level_5') progress = s.level;
        if (a.id === 'coins_1000') progress = s.coins;
        const shouldUnlock = progress >= a.target;
        return { ...a, progress, unlocked: shouldUnlock };
      });
      return { ...s, achievements: updated };
    });
  }, []);

  const addEnotByRarity = useCallback((rarity: Rarity) => {
    const matching = SHOP_ENOTS.filter((e) => e.rarity === rarity);
    const base = matching[Math.floor(Math.random() * matching.length)] || SHOP_ENOTS[0];
    const newEnot: Enot = {
      ...base,
      id: `enot-${Date.now()}`,
      health: 100,
      mood: 80,
      hunger: 70,
      level: 1,
      experience: 0,
      photo: ENOT_PHOTOS[rarity]?.[Math.floor(Math.random() * (ENOT_PHOTOS[rarity]?.length || 1))] || base.photo,
    };
    setState(s => ({ ...s, enots: [...s.enots, newEnot] }));
  }, []);

  const buyEnot = useCallback((enotData: Omit<Enot, 'id' | 'health' | 'mood' | 'hunger' | 'level' | 'experience'>): boolean => {
    let ok = false;
    setState(s => {
      if (s.coins < enotData.price) return s;
      ok = true;
      const newEnot: Enot = {
        ...enotData,
        id: `enot-${Date.now()}`,
        health: 100, mood: 80, hunger: 70, level: 1, experience: 0,
        photo: ENOT_PHOTOS[enotData.rarity]?.[Math.floor(Math.random() * (ENOT_PHOTOS[enotData.rarity]?.length || 1))] || enotData.photo,
      };
      const newAch = s.achievements.map(a => a.id === 'first_buy' ? { ...a, progress: 1, unlocked: true } : a);
      return { ...s, coins: s.coins - enotData.price, enots: [...s.enots, newEnot], achievements: newAch };
    });
    return ok;
  }, []);

  const buyFood = useCallback((food: Food): boolean => {
    let ok = false;
    setState(s => {
      if (s.coins < food.price) return s;
      ok = true;
      const existing = s.inventory.food.find(f => f.id === food.id);
      const newFood = existing
        ? s.inventory.food.map(f => f.id === food.id ? { ...f, quantity: f.quantity + 1 } : f)
        : [...s.inventory.food, { ...food, quantity: 1 }];
      const newAch = s.achievements.map(a => a.id === 'first_buy' ? { ...a, progress: 1, unlocked: true } : a);
      return { ...s, coins: s.coins - food.price, inventory: { food: newFood }, achievements: newAch };
    });
    return ok;
  }, []);

  const feedEnot = useCallback((foodId: string): { success: boolean; message: string } => {
    const now = Date.now();
    const FEED_COOLDOWN = 30 * 60 * 1000;
    let result = { success: false, message: '' };
    setState(s => {
      if (s.lastFeed && now - s.lastFeed < FEED_COOLDOWN) {
        const rem = Math.ceil((FEED_COOLDOWN - (now - s.lastFeed)) / 60000);
        result = { success: false, message: `Следующая кормёжка через ${rem} мин` };
        return s;
      }
      const foodItem = s.inventory.food.find(f => f.id === foodId);
      if (!foodItem || foodItem.quantity <= 0) {
        result = { success: false, message: 'Еда не найдена' };
        return s;
      }
      if (!s.activeEnotId) {
        result = { success: false, message: 'Нет активного енота' };
        return s;
      }
      result = { success: true, message: `Еда даёт +${foodItem.healthRestore} здоровья, +${foodItem.hungerRestore} голода` };
      const newFood = foodItem.quantity <= 1
        ? s.inventory.food.filter(f => f.id !== foodId)
        : s.inventory.food.map(f => f.id === foodId ? { ...f, quantity: f.quantity - 1 } : f);
      const newEnots = s.enots.map(e => {
        if (e.id !== s.activeEnotId) return e;
        return {
          ...e,
          health: Math.min(100, e.health + foodItem.healthRestore),
          hunger: Math.min(100, e.hunger + foodItem.hungerRestore),
        };
      });
      const newFeedCount = s.feedCount + 1;
      const newAch = s.achievements.map(a => {
        if (a.id === 'first_feed') return { ...a, progress: newFeedCount, unlocked: newFeedCount >= 1 };
        if (a.id === 'feed_10') return { ...a, progress: newFeedCount, unlocked: newFeedCount >= 10 };
        return a;
      });
      return { ...s, enots: newEnots, inventory: { food: newFood }, lastFeed: now, feedCount: newFeedCount, achievements: newAch };
    });
    return result;
  }, []);

  const setActiveEnot = useCallback((id: string) => {
    setState(s => ({ ...s, activeEnotId: id }));
  }, []);

  const doWalk = useCallback((): { success: boolean; message: string } => {
    const now = Date.now();
    let result = { success: false, message: '' };
    setState(s => {
      if (s.lastWalk && now - s.lastWalk < HOUR) {
        const rem = Math.ceil((HOUR - (now - s.lastWalk)) / 60000);
        result = { success: false, message: `Прогулка снова через ${rem} мин` };
        return s;
      }
      if (!s.activeEnotId) { result = { success: false, message: 'Нет активного енота' }; return s; }
      result = { success: true, message: '+15 настроения, -10 голода' };
      const newEnots = s.enots.map(e => {
        if (e.id !== s.activeEnotId) return e;
        return { ...e, mood: Math.min(100, e.mood + 15), hunger: Math.max(0, e.hunger - 10) };
      });
      const newAch = s.achievements.map(a => a.id === 'first_walk' ? { ...a, progress: 1, unlocked: true } : a);
      return { ...s, enots: newEnots, lastWalk: now, achievements: newAch };
    });
    return result;
  }, []);

  const doFootball = useCallback((): { success: boolean; message: string } => {
    const now = Date.now();
    let result = { success: false, message: '' };
    setState(s => {
      if (s.lastFootball && now - s.lastFootball < HOUR) {
        const rem = Math.ceil((HOUR - (now - s.lastFootball)) / 60000);
        result = { success: false, message: `Футбол снова через ${rem} мин` };
        return s;
      }
      if (!s.activeEnotId) { result = { success: false, message: 'Нет активного енота' }; return s; }
      result = { success: true, message: '+20 настроения, -15 голода, +5 монет' };
      const newEnots = s.enots.map(e => {
        if (e.id !== s.activeEnotId) return e;
        return { ...e, mood: Math.min(100, e.mood + 20), hunger: Math.max(0, e.hunger - 15) };
      });
      return { ...s, enots: newEnots, lastFootball: now, coins: s.coins + 5 };
    });
    return result;
  }, []);

  const doBasketball = useCallback((): { success: boolean; message: string } => {
    const now = Date.now();
    let result = { success: false, message: '' };
    setState(s => {
      if (s.lastBasketball && now - s.lastBasketball < HOUR) {
        const rem = Math.ceil((HOUR - (now - s.lastBasketball)) / 60000);
        result = { success: false, message: `Баскетбол снова через ${rem} мин` };
        return s;
      }
      if (!s.activeEnotId) { result = { success: false, message: 'Нет активного енота' }; return s; }
      result = { success: true, message: '+25 настроения, -20 голода, +10 монет' };
      const newEnots = s.enots.map(e => {
        if (e.id !== s.activeEnotId) return e;
        return { ...e, mood: Math.min(100, e.mood + 25), hunger: Math.max(0, e.hunger - 20) };
      });
      return { ...s, enots: newEnots, lastBasketball: now, coins: s.coins + 10 };
    });
    return result;
  }, []);

  const claimDailyBonus = useCallback((): { success: boolean; amount?: number; message: string } => {
    const now = Date.now();
    let result: { success: boolean; amount?: number; message: string } = { success: false, message: '' };
    setState(s => {
      if (s.lastDailyBonus && now - s.lastDailyBonus < DAY) {
        const rem = Math.ceil((DAY - (now - s.lastDailyBonus)) / HOUR);
        result = { success: false, message: `Следующий бонус через ${rem} ч` };
        return s;
      }
      const amount = Math.floor(Math.random() * 300) + 100;
      result = { success: true, amount, message: `Получено ${amount} монет!` };
      return { ...s, coins: s.coins + amount, lastDailyBonus: now };
    });
    return result;
  }, []);

  const claimHourlyBonus = useCallback((): { success: boolean; amount?: number; message: string } => {
    const now = Date.now();
    let result: { success: boolean; amount?: number; message: string } = { success: false, message: '' };
    setState(s => {
      if (s.lastHourlyBonus && now - s.lastHourlyBonus < HOUR) {
        const rem = Math.ceil((HOUR - (now - s.lastHourlyBonus)) / 60000);
        result = { success: false, message: `Следующий бонус через ${rem} мин` };
        return s;
      }
      const amount = Math.floor(Math.random() * 100) + 1;
      result = { success: true, amount, message: `Получено ${amount} монет!` };
      return { ...s, coins: s.coins + amount, lastHourlyBonus: now };
    });
    return result;
  }, []);

  const clickEnot = useCallback(() => {
    setState(s => {
      const newCount = s.clickCount + 1;
      const newAch = s.achievements.map(a => {
        if (a.id === 'click_100') return { ...a, progress: newCount, unlocked: newCount >= 100 };
        if (a.id === 'click_500') return { ...a, progress: newCount, unlocked: newCount >= 500 };
        if (a.id === 'click_1000') return { ...a, progress: newCount, unlocked: newCount >= 1000 };
        return a;
      });
      return { ...s, clickCount: newCount, achievements: newAch };
    });
  }, []);

  const craftMerge = useCallback((row: number, col: number, targetRow: number, targetCol: number): boolean => {
    let ok = false;
    setState(s => {
      const field = s.craftField.map(r => [...r]);
      const source = field[row][col];
      const target = field[targetRow][targetCol];
      if (!source || !target) return s;
      if (source.id !== target.id || source.level !== target.level) return s;
      const nextItem = CRAFT_ITEMS.find((i) => i.level === source.level + 1);
      if (!nextItem) return s;
      ok = true;
      field[row][col] = null;
      field[targetRow][targetCol] = nextItem;
      const newExp = s.experience + source.expReward;
      const expToLevel = s.level * 200;
      const craftCount = s.achievements.find(a => a.id === 'craft_10')?.progress || 0;
      const newAch = s.achievements.map(a => {
        if (a.id === 'craft_10') return { ...a, progress: craftCount + 1, unlocked: craftCount + 1 >= 10 };
        return a;
      });
      if (newExp >= expToLevel) {
        return { ...s, craftField: field, experience: newExp - expToLevel, level: s.level + 1, achievements: newAch };
      }
      return { ...s, craftField: field, experience: newExp, achievements: newAch };
    });
    return ok;
  }, []);

  const placeCraftItem = useCallback((itemId: string, row: number, col: number): boolean => {
    let ok = false;
    setState(s => {
      if (s.craftField[row][col] !== null) return s;
      const item = s.craftInventory.find(i => i.id === itemId);
      if (!item) return s;
      ok = true;
      const field = s.craftField.map(r => [...r]);
      field[row][col] = item;
      const newInv = s.craftInventory.filter((_, i) => s.craftInventory.indexOf(item) !== i);
      return { ...s, craftField: field, craftInventory: newInv };
    });
    return ok;
  }, []);

  const upgradeEnot = useCallback((enotId: string, targetRarity: Rarity): { success: boolean; message: string } => {
    let result = { success: false, message: '' };
    setState(s => {
      const enot = s.enots.find(e => e.id === enotId);
      if (!enot) { result = { success: false, message: 'Енот не найден' }; return s; }
      const chance = UPGRADE_CHANCES[enot.rarity] ?? 0;
      const roll = Math.random();
      if (roll > chance) {
        result = { success: false, message: `Провал! Шанс был ${Math.round(chance * 100)}%` };
        const newEnots = s.enots.filter(e => e.id !== enotId);
        return { ...s, enots: newEnots };
      }
      const matching = SHOP_ENOTS.filter((e) => e.rarity === targetRarity);
      const base = matching[Math.floor(Math.random() * matching.length)];
      if (!base) { result = { success: false, message: 'Нет енотов нужной редкости' }; return s; }
      result = { success: true, message: `Успех! Енот стал ${targetRarity}!` };
      const newEnot: Enot = {
        ...base,
        id: enotId,
        health: enot.health,
        mood: enot.mood,
        hunger: enot.hunger,
        level: enot.level,
        experience: enot.experience,
        photo: ENOT_PHOTOS[targetRarity]?.[Math.floor(Math.random() * (ENOT_PHOTOS[targetRarity]?.length || 1))] || base.photo,
      };
      const newEnots = s.enots.map(e => e.id === enotId ? newEnot : e);
      return { ...s, enots: newEnots };
    });
    return result;
  }, []);

  return (
    <GameContext.Provider value={{
      state, activeEnot, addCoins, spendCoins, buyEnot, buyFood, feedEnot,
      setActiveEnot, doWalk, doFootball, doBasketball, claimDailyBonus,
      claimHourlyBonus, clickEnot, addExperience, craftMerge, placeCraftItem,
      upgradeEnot, checkAchievements, addEnotByRarity,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};