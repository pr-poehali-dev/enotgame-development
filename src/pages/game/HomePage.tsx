import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import StatBar from '@/components/game/StatBar';
import Toast from '@/components/game/Toast';
import RarityBadge from '@/components/game/RarityBadge';

export default function HomePage() {
  const { state, activeEnot, clickEnot, claimDailyBonus, claimHourlyBonus, setActiveEnot } = useGame();
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [clickAnim, setClickAnim] = useState(false);
  const [floats, setFloats] = useState<{ id: number; x: number; y: number }[]>([]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => setToast({ msg, type });

  const handleClick = (e: React.MouseEvent) => {
    clickEnot();
    setClickAnim(true);
    setTimeout(() => setClickAnim(false), 200);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setFloats(f => [...f, { id, x, y }]);
    setTimeout(() => setFloats(f => f.filter(i => i.id !== id)), 1000);
  };

  const handleDaily = () => {
    const r = claimDailyBonus();
    showToast(r.message, r.success ? 'success' : 'error');
  };

  const handleHourly = () => {
    const r = claimHourlyBonus();
    showToast(r.message, r.success ? 'success' : 'error');
  };

  const expPct = Math.round((state.experience / (state.level * 200)) * 100);

  return (
    <div className="space-y-5 pb-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Player header */}
      <div className="card-glass rounded-3xl p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Игрок</p>
            <h2 className="font-game text-2xl text-white">Охотник на енотов</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-enot-gold/10 border border-enot-gold/30 px-3 py-1.5 rounded-full">
              <span className="text-lg">🪙</span>
              <span className="font-game text-enot-gold">{state.coins.toLocaleString()}</span>
            </div>
          </div>
        </div>
        {/* Level bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Уровень {state.level}</span>
            <span>{state.experience} / {state.level * 200} XP</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-enot-purple to-enot-blue transition-all duration-700"
              style={{ width: `${expPct}%` }} />
          </div>
        </div>
      </div>

      {/* Active enot */}
      {activeEnot ? (
        <div className="card-glass rounded-3xl p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex gap-4 mb-4">
            <div className="relative">
              <button
                onClick={handleClick}
                className={`w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 flex-shrink-0 cursor-pointer transition-transform duration-150 select-none ${clickAnim ? 'scale-90' : 'scale-100'}`}
              >
                <img src={activeEnot.photo} alt={activeEnot.name} className="w-full h-full object-cover" />
                {floats.map(f => (
                  <div key={f.id} className="absolute pointer-events-none text-enot-gold font-bold text-sm"
                    style={{ left: f.x, top: f.y, animation: 'float 1s ease-out forwards', opacity: 0 }}>
                    +1
                  </div>
                ))}
              </button>
              <div className="absolute -bottom-1 -right-1 text-xl">{activeEnot.emoji}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-game text-lg text-white truncate">{activeEnot.name}</h3>
                <RarityBadge rarity={activeEnot.rarity} />
              </div>
              <p className="text-xs text-gray-500 mb-3">{activeEnot.description}</p>
              <div className="space-y-2">
                <StatBar label="Здоровье" value={activeEnot.health} color="linear-gradient(90deg,#f43f5e,#ec4899)" emoji="❤️" />
                <StatBar label="Настроение" value={activeEnot.mood} color="linear-gradient(90deg,#a78bfa,#818cf8)" emoji="😊" />
                <StatBar label="Голод" value={activeEnot.hunger} color="linear-gradient(90deg,#fb923c,#f59e0b)" emoji="🍖" />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 text-center">👆 Тапай по еноту чтобы получить опыт и разблокировать достижения</p>
        </div>
      ) : (
        <div className="card-glass rounded-3xl p-8 text-center animate-fade-in">
          <div className="text-5xl mb-3">🦝</div>
          <p className="text-gray-400">Нет активного енота</p>
        </div>
      )}

      {/* Bonuses */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <button onClick={handleDaily}
          className="card-glass rounded-2xl p-4 text-left hover-lift border border-enot-gold/20 active:scale-95 transition-all">
          <div className="text-2xl mb-2">🎁</div>
          <p className="font-game text-sm text-white">Дневной бонус</p>
          <p className="text-xs text-gray-500">100–400 монет</p>
        </button>
        <button onClick={handleHourly}
          className="card-glass rounded-2xl p-4 text-left hover-lift border border-enot-blue/20 active:scale-95 transition-all">
          <div className="text-2xl mb-2">⏰</div>
          <p className="font-game text-sm text-white">Часовой бонус</p>
          <p className="text-xs text-gray-500">1–100 монет</p>
        </button>
      </div>

      {/* Enot collection */}
      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-game text-lg text-white">Мои еноты</h3>
          <span className="text-sm text-gray-500">{state.enots.length} / ∞</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {state.enots.map(enot => (
            <button key={enot.id}
              onClick={() => setActiveEnot(enot.id)}
              className={`rounded-2xl p-2 text-center transition-all border hover-lift active:scale-95 bg-rarity-${enot.rarity.toLowerCase()} ${state.activeEnotId === enot.id ? 'ring-2 ring-enot-green' : ''}`}
            >
              <img src={enot.photo} alt={enot.name} className="w-full aspect-square rounded-xl object-cover mb-1" />
              <p className="text-xs text-white font-semibold truncate">{enot.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="card-glass rounded-3xl p-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h3 className="font-game text-sm text-gray-400 uppercase tracking-widest mb-3">Статистика</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-game text-enot-green">{state.clickCount}</p>
            <p className="text-xs text-gray-500">кликов</p>
          </div>
          <div>
            <p className="text-2xl font-game text-enot-orange">{state.feedCount}</p>
            <p className="text-xs text-gray-500">кормёжек</p>
          </div>
          <div>
            <p className="text-2xl font-game text-enot-purple">{state.achievements.filter(a => a.unlocked).length}</p>
            <p className="text-xs text-gray-500">достижений</p>
          </div>
        </div>
      </div>
    </div>
  );
}