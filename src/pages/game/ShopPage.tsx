import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { SHOP_ENOTS, FOODS } from '@/data/gameData';
import RarityBadge from '@/components/game/RarityBadge';
import Toast from '@/components/game/Toast';
import type { Enot, Food, Rarity } from '@/types/game';

type Tab = 'enots' | 'food';

export default function ShopPage() {
  const { state, buyEnot, buyFood } = useGame();
  const [tab, setTab] = useState<Tab>('enots');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => setToast({ msg, type });

  const handleBuyEnot = (enot: typeof SHOP_ENOTS[0]) => {
    const ok = buyEnot(enot as Omit<Enot, 'id' | 'health' | 'mood' | 'hunger' | 'level' | 'experience'>);
    showToast(ok ? `🦝 ${enot.name} теперь твой!` : '❌ Недостаточно монет', ok ? 'success' : 'error');
  };

  const handleBuyFood = (food: Food) => {
    const ok = buyFood(food);
    showToast(ok ? `${food.emoji} ${food.name} куплена!` : '❌ Недостаточно монет', ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-4 pb-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <h2 className="font-game text-2xl text-white">Магазин</h2>
        <div className="flex items-center gap-1.5 bg-enot-gold/10 border border-enot-gold/30 px-3 py-1.5 rounded-full">
          <span>🪙</span>
          <span className="font-game text-enot-gold">{state.coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 animate-fade-in" style={{ animationDelay: '0.05s' }}>
        {([['enots', '🦝 Еноты'], ['food', '🍎 Еда']] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2.5 rounded-xl font-game text-sm transition-all ${tab === key ? 'bg-enot-green text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Enots grid */}
      {tab === 'enots' && (
        <div className="space-y-3 animate-fade-in">
          {SHOP_ENOTS.map((enot, i) => (
            <div key={i}
              className={`rounded-2xl p-4 border transition-all hover-lift bg-rarity-${enot.rarity.toLowerCase()}`}
              style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="flex items-center gap-3">
                <img src={enot.photo} alt={enot.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-game text-white text-sm">{enot.name}</span>
                    <RarityBadge rarity={enot.rarity as Rarity} />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{enot.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span>🪙</span>
                      <span className="font-game text-enot-gold text-sm">{enot.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => handleBuyEnot(enot)}
                      disabled={state.coins < enot.price}
                      className={`px-3 py-1.5 rounded-lg text-xs font-game transition-all ${state.coins >= enot.price ? 'bg-enot-green text-black hover:opacity-90 active:scale-95' : 'bg-white/10 text-gray-600 cursor-not-allowed'}`}
                    >
                      Купить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Food grid */}
      {tab === 'food' && (
        <div className="grid grid-cols-2 gap-3 animate-fade-in">
          {FOODS.map((food, i) => (
            <div key={food.id}
              className="card-glass rounded-2xl p-4 border border-white/5 hover-lift transition-all"
              style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="text-3xl mb-2">{food.emoji}</div>
              <h4 className="font-game text-sm text-white mb-1">{food.name}</h4>
              <p className="text-xs text-gray-500 mb-2">{food.description}</p>
              <div className="space-y-1 mb-3">
                {food.healthRestore > 0 && (
                  <div className="flex items-center gap-1 text-xs text-red-400">
                    <span>❤️</span><span>+{food.healthRestore} здоровья</span>
                  </div>
                )}
                {food.hungerRestore > 0 && (
                  <div className="flex items-center gap-1 text-xs text-orange-400">
                    <span>🍖</span><span>+{food.hungerRestore} голода</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span>🪙</span>
                  <span className="font-game text-enot-gold text-sm">{food.price}</span>
                </div>
                <button
                  onClick={() => handleBuyFood(food)}
                  disabled={state.coins < food.price}
                  className={`px-3 py-1.5 rounded-lg text-xs font-game transition-all ${state.coins >= food.price ? 'bg-enot-green text-black hover:opacity-90 active:scale-95' : 'bg-white/10 text-gray-600 cursor-not-allowed'}`}
                >
                  Купить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
