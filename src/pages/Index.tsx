import { useState } from 'react';
import { GameProvider } from '@/context/GameContext';
import HomePage from './game/HomePage';
import EnotProfilePage from './game/EnotProfilePage';
import ShopPage from './game/ShopPage';
import GamesPage from './game/GamesPage';
import InventoryPage from './game/InventoryPage';
import EarnPage from './game/EarnPage';
import CraftPage from './game/CraftPage';
import UpgradePage from './game/UpgradePage';
import AchievementsPage from './game/AchievementsPage';

type Page = 'home' | 'enot' | 'shop' | 'games' | 'inventory' | 'earn' | 'craft' | 'upgrade' | 'achievements';

const NAV_ITEMS: { id: Page; label: string; emoji: string }[] = [
  { id: 'home', label: 'Главная', emoji: '🏠' },
  { id: 'enot', label: 'Мой енот', emoji: '🦝' },
  { id: 'shop', label: 'Магазин', emoji: '🛍️' },
  { id: 'games', label: 'Игры', emoji: '⚽' },
  { id: 'inventory', label: 'Рюкзак', emoji: '🎒' },
  { id: 'earn', label: 'Доход', emoji: '💰' },
  { id: 'craft', label: 'Крафт', emoji: '🌿' },
  { id: 'upgrade', label: 'Апгрейд', emoji: '⬆️' },
  { id: 'achievements', label: 'Трофеи', emoji: '🏆' },
];

function GameApp() {
  const [page, setPage] = useState<Page>('home');

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage />;
      case 'enot': return <EnotProfilePage />;
      case 'shop': return <ShopPage />;
      case 'games': return <GamesPage />;
      case 'inventory': return <InventoryPage />;
      case 'earn': return <EarnPage />;
      case 'craft': return <CraftPage />;
      case 'upgrade': return <UpgradePage />;
      case 'achievements': return <AchievementsPage />;
      default: return <HomePage />;
    }
  };

  const currentNav = NAV_ITEMS.find(n => n.id === page);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-enot-green/5 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-enot-purple/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-enot-blue/3 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between backdrop-blur-xl border-b border-white/5 bg-background/80">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦝</span>
          <span className="font-game text-lg text-white">EnotGame</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <span>{currentNav?.emoji}</span>
          <span>{currentNav?.label}</span>
        </div>
      </header>

      {/* Scrollable nav tabs */}
      <div className="sticky top-[56px] z-30 px-4 py-2 backdrop-blur-xl border-b border-white/5 bg-background/60 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-game whitespace-nowrap transition-all active:scale-95
                ${page === item.id
                  ? 'bg-enot-green text-black shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Page content */}
      <main className="relative z-10 px-4 py-4 max-w-lg mx-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default function Index() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}
