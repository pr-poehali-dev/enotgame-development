import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { UPGRADE_CHANCES, RARITY_ORDER } from '@/data/gameData';
import RarityBadge from '@/components/game/RarityBadge';
import Toast from '@/components/game/Toast';
import type { Rarity } from '@/types/game';

const RARITIES: Rarity[] = ['Common', 'Uncommon', 'Epic', 'Mythic', 'Legendary', 'Super', 'Ultra', 'Secret'];

const RARITY_NAMES: Record<Rarity, string> = {
  Common: 'Обычный', Uncommon: 'Необычный', Epic: 'Эпический',
  Mythic: 'Мифический', Legendary: 'Легендарный', Super: 'Супер',
  Ultra: 'Ультра', Secret: 'Секретный',
};

export default function UpgradePage() {
  const { state, upgradeEnot } = useGame();
  const [selectedEnotId, setSelectedEnotId] = useState<string | null>(null);
  const [targetRarity, setTargetRarity] = useState<Rarity | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [animResult, setAnimResult] = useState<'success' | 'fail' | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => setToast({ msg, type });

  const selectedEnot = state.enots.find(e => e.id === selectedEnotId);

  const nextRarities = selectedEnot
    ? RARITIES.filter(r => RARITY_ORDER[r] > RARITY_ORDER[selectedEnot.rarity])
    : [];

  const handleUpgrade = () => {
    if (!selectedEnotId || !targetRarity) return;
    const result = upgradeEnot(selectedEnotId, targetRarity);
    setAnimResult(result.success ? 'success' : 'fail');
    showToast(result.message, result.success ? 'success' : 'error');
    setTimeout(() => {
      setAnimResult(null);
      if (!result.success) { setSelectedEnotId(null); setTargetRarity(null); }
    }, 1500);
  };

  const chance = selectedEnot ? UPGRADE_CHANCES[selectedEnot.rarity] : 0;

  return (
    <div className="space-y-4 pb-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="animate-fade-in">
        <h2 className="font-game text-2xl text-white mb-1">Апгрейд</h2>
        <p className="text-sm text-gray-500">Рискни! Улучши редкость енота или потеряй его</p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-3 flex gap-2 animate-fade-in">
        <span>⚠️</span>
        <p className="text-xs text-yellow-300">При провале апгрейда енот <strong>исчезает навсегда</strong>. Это риск!</p>
      </div>

      {/* Step 1: Choose enot */}
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h3 className="font-game text-sm text-gray-400 uppercase tracking-widest">1. Выбери енота для апгрейда</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {state.enots.filter(e => e.rarity !== 'Secret').map(enot => (
            <button
              key={enot.id}
              onClick={() => { setSelectedEnotId(enot.id); setTargetRarity(null); }}
              className={`w-full rounded-xl p-3 border transition-all text-left bg-rarity-${enot.rarity.toLowerCase()} ${selectedEnotId === enot.id ? 'ring-2 ring-enot-green' : 'opacity-70 hover:opacity-100'}`}
            >
              <div className="flex items-center gap-3">
                <img src={enot.photo} alt={enot.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-game text-sm text-white truncate">{enot.name}</p>
                  <RarityBadge rarity={enot.rarity} />
                </div>
                {selectedEnotId === enot.id && <span className="text-enot-green">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Choose target rarity */}
      {selectedEnot && (
        <div className="space-y-2 animate-scale-in">
          <h3 className="font-game text-sm text-gray-400 uppercase tracking-widest">2. Выбери желаемую редкость</h3>
          <div className="grid grid-cols-2 gap-2">
            {nextRarities.map(r => (
              <button
                key={r}
                onClick={() => setTargetRarity(r)}
                className={`rounded-xl p-3 border text-center transition-all bg-rarity-${r.toLowerCase()} ${targetRarity === r ? 'ring-2 ring-enot-green scale-105' : 'opacity-70 hover:opacity-100'}`}
              >
                <p className={`font-game text-sm rarity-${r.toLowerCase()}`}>{RARITY_NAMES[r]}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade card */}
      {selectedEnot && targetRarity && (
        <div className="card-glass rounded-2xl p-5 border border-white/10 space-y-4 animate-scale-in">
          <div className="flex items-center justify-center gap-4">
            <div className={`text-center transition-all duration-300 ${animResult === 'fail' ? 'opacity-0 scale-50' : ''}`}>
              <img src={selectedEnot.photo} alt={selectedEnot.name} className="w-16 h-16 rounded-2xl object-cover mx-auto mb-1" />
              <RarityBadge rarity={selectedEnot.rarity} />
            </div>
            <div className={`text-2xl transition-all duration-500 ${animResult === 'success' ? 'text-enot-green scale-125' : animResult === 'fail' ? 'text-red-500' : 'text-gray-400'}`}>
              {animResult === 'success' ? '🎉' : animResult === 'fail' ? '💥' : '→'}
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl border-2 mx-auto mb-1 flex items-center justify-center text-2xl bg-rarity-${targetRarity.toLowerCase()} ${animResult === 'success' ? 'ring-2 ring-enot-green' : ''}`}>
                🦝
              </div>
              <RarityBadge rarity={targetRarity} />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">Шанс успеха</p>
            <p className="font-game text-3xl text-enot-gold">{Math.round(chance * 100)}%</p>
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-enot-gold to-enot-orange rounded-full"
              style={{ width: `${Math.round(chance * 100)}%` }} />
          </div>

          <button
            onClick={handleUpgrade}
            disabled={!!animResult}
            className="w-full py-3 rounded-xl font-game text-sm bg-gradient-to-r from-enot-gold to-enot-orange text-black hover:opacity-90 active:scale-95 transition-all glow-gold disabled:opacity-50"
          >
            {animResult ? '...' : `🎲 Попытать удачу (${Math.round(chance * 100)}%)`}
          </button>
        </div>
      )}

      {/* Info */}
      <div className="card-glass rounded-2xl p-4 border border-white/5 animate-fade-in">
        <h3 className="font-game text-sm text-gray-400 uppercase tracking-widest mb-2">Шансы апгрейда</h3>
        <div className="space-y-1.5">
          {RARITIES.filter(r => r !== 'Secret').map(r => (
            <div key={r} className="flex items-center justify-between text-xs">
              <span className={`rarity-${r.toLowerCase()}`}>{RARITY_NAMES[r]}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-current rounded-full" style={{ width: `${UPGRADE_CHANCES[r] * 100}%` }} />
                </div>
                <span className="text-gray-400 w-8 text-right">{Math.round(UPGRADE_CHANCES[r] * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
