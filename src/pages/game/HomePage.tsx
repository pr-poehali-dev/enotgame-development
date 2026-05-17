import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import StatBar from '@/components/game/StatBar';
import Toast from '@/components/game/Toast';
import RarityBadge from '@/components/game/RarityBadge';
import { useCountdown, useCooldownEnd } from '@/hooks/useCountdown';

const HOUR = 3600000;
const DAY = 86400000;
const FEED_COOLDOWN = 30 * 60 * 1000;

const RARITY_NAMES: Record<string, string> = {
  Common: 'Common', Uncommon: 'Uncommon', Epic: 'Epic',
  Mythic: 'Mythic', Legendary: 'Legendary', Super: 'Super',
  Ultra: 'Ultra', Secret: 'Secret',
};

type Tab = 'enot' | 'inventory';

export default function HomePage() {
  const { state, activeEnot, clickEnot, claimDailyBonus, claimHourlyBonus, setActiveEnot, feedEnot, addExperience } = useGame();
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [clickAnim, setClickAnim] = useState(false);
  const [floats, setFloats] = useState<{ id: number; x: number; y: number }[]>([]);
  const [tab, setTab] = useState<Tab>('enot');
  const [feedMenu, setFeedMenu] = useState<string | null>(null);

  const dailyEnd = useCooldownEnd(state.lastDailyBonus, DAY);
  const hourlyEnd = useCooldownEnd(state.lastHourlyBonus, HOUR);
  const feedEnd = useCooldownEnd(state.lastFeed, FEED_COOLDOWN);

  const dailyTimer = useCountdown(dailyEnd, 1000);
  const hourlyTimer = useCountdown(hourlyEnd, 1000);
  const feedTimer = useCountdown(feedEnd, 1000);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => setToast({ msg, type });

  const handleClick = (e: React.MouseEvent) => {
    clickEnot();
    addExperience(1);
    setClickAnim(true);
    setTimeout(() => setClickAnim(false), 150);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setFloats(f => [...f, { id, x, y }]);
    setTimeout(() => setFloats(f => f.filter(i => i.id !== id)), 800);
  };

  const handleDaily = () => {
    const r = claimDailyBonus();
    showToast(r.message, r.success ? 'success' : 'error');
  };

  const handleHourly = () => {
    const r = claimHourlyBonus();
    showToast(r.message, r.success ? 'success' : 'error');
  };

  const handleFeed = (foodId: string) => {
    const r = feedEnot(foodId);
    showToast(r.message, r.success ? 'success' : 'error');
    setFeedMenu(null);
  };

  const expPct = Math.min(100, Math.round((state.experience / (state.level * 200)) * 100));
  const totalFood = state.inventory.food.reduce((a, f) => a + f.quantity, 0);

  return (
    <div className="space-y-4 pb-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Player header */}
      <div className="card-glass rounded-3xl p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Игрок</p>
            <h2 className="font-game text-xl text-white">Охотник на енотов</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Уровень</p>
            <p className="font-game text-2xl text-enot-purple">{state.level}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{state.experience} / {state.level * 200} XP</span>
            <span>{expPct}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-enot-purple to-enot-blue transition-all duration-700"
              style={{ width: `${expPct}%` }} />
          </div>
        </div>
      </div>

      {/* Bonuses */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in">
        <button onClick={handleDaily}
          className="card-glass rounded-2xl p-3 text-left hover-lift border border-enot-gold/20 active:scale-95 transition-all">
          <div className="text-xl mb-1">🎁</div>
          <p className="font-game text-xs text-white">Дневной бонус</p>
          {dailyTimer
            ? <p className="text-xs text-gray-500 tabular-nums">{dailyTimer}</p>
            : <p className="text-xs text-enot-green">Доступен!</p>}
        </button>
        <button onClick={handleHourly}
          className="card-glass rounded-2xl p-3 text-left hover-lift border border-enot-blue/20 active:scale-95 transition-all">
          <div className="text-xl mb-1">⏰</div>
          <p className="font-game text-xs text-white">Часовой бонус</p>
          {hourlyTimer
            ? <p className="text-xs text-gray-500 tabular-nums">{hourlyTimer}</p>
            : <p className="text-xs text-enot-green">Доступен!</p>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([['enot', `🦝 Мой енот`], ['inventory', `🍱 Инвентарь (${totalFood})`]] as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2.5 rounded-xl font-game text-xs transition-all ${tab === key ? 'bg-enot-green text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Enot tab */}
      {tab === 'enot' && (
        <div className="space-y-3 animate-fade-in">
          {activeEnot ? (
            <>
              {/* Main enot card */}
              <div className={`rounded-3xl p-5 bg-rarity-${activeEnot.rarity.toLowerCase()} border animate-fade-in`}>
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={handleClick}
                      className={`w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 cursor-pointer select-none transition-transform duration-100 ${clickAnim ? 'scale-90' : 'scale-100'}`}
                    >
                      <img src={activeEnot.photo} alt={activeEnot.rarity} className="w-full h-full object-cover" />
                      {floats.map(f => (
                        <div key={f.id} className="absolute pointer-events-none font-game text-enot-gold font-bold text-xs"
                          style={{ left: f.x - 10, top: f.y - 10, animation: 'float 0.8s ease-out forwards' }}>
                          +1 XP
                        </div>
                      ))}
                    </button>
                    <div className="absolute -bottom-1 -right-1 text-lg">🦝</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <RarityBadge rarity={activeEnot.rarity} />
                        <p className="text-xs text-gray-400 mt-1">{activeEnot.description}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <StatBar label="Настроение" value={activeEnot.mood} color="linear-gradient(90deg,#a78bfa,#818cf8)" emoji="😊" />
                      <StatBar label="Голод" value={activeEnot.hunger} color="linear-gradient(90deg,#fb923c,#f59e0b)" emoji="🍖" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/40 text-center mt-3">👆 Тапай — получай XP и монеты</p>
              </div>

              {/* All enots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-game text-sm text-gray-400 uppercase tracking-widest">Все еноты</h3>
                  <span className="text-xs text-gray-600">{state.enots.length} шт.</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {state.enots.map(enot => (
                    <button key={enot.id} onClick={() => setActiveEnot(enot.id)}
                      className={`rounded-xl p-1.5 text-center transition-all border hover-lift active:scale-95 bg-rarity-${enot.rarity.toLowerCase()} ${state.activeEnotId === enot.id ? 'ring-2 ring-enot-green' : 'opacity-70'}`}>
                      <img src={enot.photo} alt={enot.rarity} className="w-full aspect-square rounded-lg object-cover mb-1" />
                      <p className={`text-[9px] font-game truncate rarity-${enot.rarity.toLowerCase()}`}>{RARITY_NAMES[enot.rarity]}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats mini */}
              <div className="card-glass rounded-2xl p-3 border border-white/5">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-game text-enot-green">{state.clickCount}</p>
                    <p className="text-[10px] text-gray-600">кликов</p>
                  </div>
                  <div>
                    <p className="text-lg font-game text-enot-orange">{state.feedCount}</p>
                    <p className="text-[10px] text-gray-600">кормёжек</p>
                  </div>
                  <div>
                    <p className="text-lg font-game text-enot-purple">{state.achievements.filter(a => a.unlocked).length}</p>
                    <p className="text-[10px] text-gray-600">достижений</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card-glass rounded-3xl p-8 text-center">
              <div className="text-5xl mb-3">🦝</div>
              <p className="text-gray-400">Купи енота в магазине!</p>
            </div>
          )}
        </div>
      )}

      {/* Inventory tab */}
      {tab === 'inventory' && (
        <div className="space-y-3 animate-fade-in">
          {/* Feed cooldown */}
          {feedTimer && (
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-xl p-3">
              <span>⏰</span>
              <p className="text-sm text-orange-300">Следующая кормёжка через <strong className="tabular-nums">{feedTimer}</strong></p>
            </div>
          )}

          {state.inventory.food.length === 0 ? (
            <div className="card-glass rounded-2xl p-8 text-center">
              <div className="text-5xl mb-3">🍱</div>
              <p className="text-gray-400">Нет еды. Купи в магазине!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {state.inventory.food.map(food => (
                <div key={food.id} className="relative">
                  <div className="card-glass rounded-2xl p-3 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl flex-shrink-0">{food.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-game text-sm text-white">{food.name}</span>
                          <span className="text-sm font-bold text-enot-gold">×{food.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {food.hungerRestore > 0 && <span>🍖 +{food.hungerRestore}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => setFeedMenu(feedMenu === food.id ? null : food.id)}
                        disabled={!!feedTimer}
                        className={`px-3 py-1.5 rounded-lg text-xs font-game transition-all active:scale-95 ${feedTimer ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-enot-orange/20 text-enot-orange hover:bg-enot-orange/30'}`}
                      >
                        Дать
                      </button>
                    </div>
                  </div>
                  {feedMenu === food.id && !feedTimer && (
                    <div className="mt-1 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 p-3 animate-scale-in">
                      <p className="text-xs text-gray-400 mb-2">Покормить активного енота?</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleFeed(food.id)}
                          className="flex-1 py-2 rounded-xl text-xs font-game bg-enot-green text-black hover:opacity-90 active:scale-95 transition-all">
                          ✓ Покормить
                        </button>
                        <button onClick={() => setFeedMenu(null)}
                          className="px-4 py-2 rounded-xl text-xs font-game bg-white/10 text-gray-400 hover:bg-white/20 transition-all">
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
