import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import Toast from '@/components/game/Toast';
import RarityBadge from '@/components/game/RarityBadge';

type Tab = 'enots' | 'food';

export default function InventoryPage() {
  const { state, feedEnot, setActiveEnot } = useGame();
  const [tab, setTab] = useState<Tab>('enots');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [feedMenu, setFeedMenu] = useState<string | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => setToast({ msg, type });

  const handleFeed = (foodId: string) => {
    const r = feedEnot(foodId);
    showToast(r.message, r.success ? 'success' : 'error');
    setFeedMenu(null);
  };

  const FEED_COOLDOWN = 30 * 60 * 1000;
  const feedCooldown = state.lastFeed ? Math.max(0, Math.ceil((FEED_COOLDOWN - (Date.now() - state.lastFeed)) / 60000)) : 0;

  return (
    <div className="space-y-4 pb-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="animate-fade-in">
        <h2 className="font-game text-2xl text-white mb-1">Инвентарь</h2>
        <p className="text-sm text-gray-500">Все твои еноты и запасы еды</p>
      </div>

      <div className="flex gap-2">
        {([['enots', `🦝 Еноты (${state.enots.length})`], ['food', `🍱 Еда (${state.inventory.food.reduce((a, f) => a + f.quantity, 0)})`]] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2.5 rounded-xl font-game text-sm transition-all ${tab === key ? 'bg-enot-green text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Feed cooldown info */}
      {feedCooldown > 0 && tab === 'food' && (
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-xl p-3">
          <span>⏰</span>
          <p className="text-sm text-orange-300">Следующая кормёжка через <strong>{feedCooldown} мин</strong></p>
        </div>
      )}

      {/* Enots */}
      {tab === 'enots' && (
        <div className="space-y-3 animate-fade-in">
          {state.enots.length === 0 ? (
            <div className="card-glass rounded-2xl p-8 text-center">
              <div className="text-5xl mb-3">🦝</div>
              <p className="text-gray-400">Нет енотов. Купи в магазине!</p>
            </div>
          ) : state.enots.map(enot => (
            <div key={enot.id}
              className={`rounded-2xl p-4 border transition-all bg-rarity-${enot.rarity.toLowerCase()} hover-lift`}>
              <div className="flex items-center gap-3">
                <img src={enot.photo} alt={enot.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-game text-sm text-white">{enot.name}</span>
                    <RarityBadge rarity={enot.rarity} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>❤️ {enot.health}</span>
                    <span>😊 {enot.mood}</span>
                    <span>🍖 {enot.hunger}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveEnot(enot.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-game transition-all ${state.activeEnotId === enot.id ? 'bg-enot-green text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {state.activeEnotId === enot.id ? 'Активный' : 'Выбрать'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Food */}
      {tab === 'food' && (
        <div className="space-y-2 animate-fade-in">
          {state.inventory.food.length === 0 ? (
            <div className="card-glass rounded-2xl p-8 text-center">
              <div className="text-5xl mb-3">🍱</div>
              <p className="text-gray-400">Нет еды. Купи в магазине!</p>
            </div>
          ) : state.inventory.food.map(food => (
            <div key={food.id} className="relative">
              <div className="card-glass rounded-2xl p-4 border border-white/5 hover-lift transition-all">
                <div className="flex items-center gap-3">
                  <div className="text-3xl w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl">{food.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-game text-sm text-white">{food.name}</span>
                      <span className="text-sm font-bold text-enot-gold">×{food.quantity}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {food.healthRestore > 0 && <span>❤️ +{food.healthRestore}</span>}
                      {food.hungerRestore > 0 && <span>🍖 +{food.hungerRestore}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => setFeedMenu(feedMenu === food.id ? null : food.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-game bg-enot-orange/20 text-enot-orange hover:bg-enot-orange/30 transition-all active:scale-95"
                  >
                    Дать
                  </button>
                </div>
              </div>
              {feedMenu === food.id && (
                <div className="mt-1 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 p-3 animate-scale-in">
                  <p className="text-xs text-gray-400 mb-2">Покормить активного енота?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFeed(food.id)}
                      className="flex-1 py-2 rounded-xl text-xs font-game bg-enot-green text-black hover:opacity-90 active:scale-95 transition-all"
                    >
                      ✓ Покормить
                    </button>
                    <button
                      onClick={() => setFeedMenu(null)}
                      className="px-4 py-2 rounded-xl text-xs font-game bg-white/10 text-gray-400 hover:bg-white/20 transition-all"
                    >
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
  );
}
