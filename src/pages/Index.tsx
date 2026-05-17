import { useState } from 'react';
import { GameProvider } from '@/context/GameContext';
import HomePage from './game/HomePage';
import ShopPage from './game/ShopPage';
import GamesPage from './game/GamesPage';
import EarnPage from './game/EarnPage';
import AchievementsPage from './game/AchievementsPage';
import { useGame } from '@/context/GameContext';

type Page = 'home' | 'shop' | 'games' | 'earn' | 'achievements';

const NAV_ITEMS: { id: Page; label: string; emoji: string }[] = [
  { id: 'home', label: 'Главная', emoji: '🏠' },
  { id: 'shop', label: 'Магазин', emoji: '🛍️' },
  { id: 'games', label: 'Игры', emoji: '🎮' },
  { id: 'earn', label: 'Доход', emoji: '💰' },
  { id: 'achievements', label: 'Трофеи', emoji: '🏆' },
];

function CoinDisplay() {
  const { state } = useGame();
  return (
    <div className="flex items-center gap-1.5 bg-enot-gold/10 border border-enot-gold/30 px-3 py-1.5 rounded-full">
      <span className="text-base">🦝</span>
      <span className="font-game text-enot-gold text-sm">{state.coins.toLocaleString()}</span>
    </div>
  );
}

function GameApp() {
  const [page, setPage] = useState<Page>('home');
  const currentNav = NAV_ITEMS.find(n => n.id === page);

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage />;
      case 'shop': return <ShopPage />;
      case 'games': return <GamesPage />;
      case 'earn': return <EarnPage />;
      case 'achievements': return <AchievementsPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-enot-green/5 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-enot-purple/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-enot-blue/3 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between backdrop-blur-xl border-b border-white/5 bg-background/80">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦝</span>
          <span className="font-game text-lg text-white">EnotGame</span>
        </div>
        <div className="flex items-center gap-3">
          <CoinDisplay />
          <span className="text-sm text-gray-500">{currentNav?.emoji} {currentNav?.label}</span>
        </div>
      </header>

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
