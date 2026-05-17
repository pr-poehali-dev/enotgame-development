import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { RARITY_ORDER } from '@/data/gameData';
import RarityBadge from '@/components/game/RarityBadge';
import Toast from '@/components/game/Toast';
import type { Rarity, Enot } from '@/types/game';

const RARITIES: Rarity[] = ['Common', 'Uncommon', 'Epic', 'Mythic', 'Legendary', 'Super', 'Ultra', 'Secret'];

const RARITY_NAMES: Record<Rarity, string> = {
  Common: 'Common', Uncommon: 'Uncommon', Epic: 'Epic',
  Mythic: 'Mythic', Legendary: 'Legendary', Super: 'Super',
  Ultra: 'Ultra', Secret: 'Secret',
};

// Шанс зависит от разницы: +1 ступень = 70%, +2 = 45%, +3 = 25%, +4 = 12%, +5 = 5%, +6 = 2%, +7 = 0.5%
function getUpgradeChance(from: Rarity, to: Rarity): number {
  const diff = RARITY_ORDER[to] - RARITY_ORDER[from];
  if (diff <= 0) return 0;
  const chances: Record<number, number> = { 1: 0.70, 2: 0.45, 3: 0.25, 4: 0.12, 5: 0.05, 6: 0.02, 7: 0.005 };
  return chances[diff] ?? 0;
}

type UpgradePhase = 'idle' | 'spinning' | 'success' | 'fail';

export default function UpgradePage() {
  const { state, upgradeEnot } = useGame();
  const [selectedEnotId, setSelectedEnotId] = useState<string | null>(null);
  const [targetRarity, setTargetRarity] = useState<Rarity | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [phase, setPhase] = useState<UpgradePhase>('idle');
  const [resultMsg, setResultMsg] = useState('');
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => setToast({ msg, type });

  const selectedEnot = state.enots.find((e: Enot) => e.id === selectedEnotId);

  const nextRarities = selectedEnot
    ? RARITIES.filter(r => RARITY_ORDER[r] > RARITY_ORDER[selectedEnot.rarity])
    : [];

  const chance = selectedEnot && targetRarity ? getUpgradeChance(selectedEnot.rarity, targetRarity) : 0;

  const spawnParticles = (success: boolean) => {
    const colors = success
      ? ['#4ade80', '#86efac', '#fbbf24', '#fde68a', '#a78bfa']
      : ['#f87171', '#fb923c', '#ef4444', '#fca5a5'];
    const pts = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(pts);
    setTimeout(() => setParticles([]), 1200);
  };

  const handleUpgrade = () => {
    if (!selectedEnotId || !targetRarity || phase !== 'idle') return;
    setPhase('spinning');

    setTimeout(() => {
      const result = upgradeEnot(selectedEnotId, targetRarity);
      const success = result.success;
      spawnParticles(success);
      setPhase(success ? 'success' : 'fail');
      setResultMsg(result.message);
      showToast(result.message, success ? 'success' : 'error');

      setTimeout(() => {
        setPhase('idle');
        if (!success) {
          setSelectedEnotId(null);
          setTargetRarity(null);
        }
      }, 2500);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-3 flex gap-2">
        <span>⚠️</span>
        <p className="text-xs text-yellow-300">При провале енот <strong>исчезает навсегда</strong>. Больший прыжок — меньший шанс!</p>
      </div>

      {/* Step 1 */}
      <div className="space-y-2">
        <h3 className="font-game text-xs text-gray-400 uppercase tracking-widest">1. Выбери енота</h3>
        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {state.enots.filter((e: Enot) => e.rarity !== 'Secret').map((enot: Enot) => (
            <button key={enot.id}
              onClick={() => { setSelectedEnotId(enot.id); setTargetRarity(null); setPhase('idle'); }}
              className={`w-full rounded-xl p-3 border transition-all text-left bg-rarity-${enot.rarity.toLowerCase()} ${selectedEnotId === enot.id ? 'ring-2 ring-enot-green' : 'opacity-70 hover:opacity-100'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🦝</span>
                <div className="flex-1">
                  <RarityBadge rarity={enot.rarity} />
                  <p className="text-xs text-gray-400 mt-0.5">{enot.mood}😊 {enot.hunger}🍖</p>
                </div>
                {selectedEnotId === enot.id && <span className="text-enot-green text-lg">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 */}
      {selectedEnot && (
        <div className="space-y-2 animate-scale-in">
          <h3 className="font-game text-xs text-gray-400 uppercase tracking-widest">2. Желаемая редкость</h3>
          <div className="grid grid-cols-2 gap-2">
            {nextRarities.map(r => {
              const ch = getUpgradeChance(selectedEnot.rarity, r);
              return (
                <button key={r} onClick={() => setTargetRarity(r)}
                  className={`rounded-xl p-2.5 border text-center transition-all bg-rarity-${r.toLowerCase()} ${targetRarity === r ? 'ring-2 ring-enot-green scale-105' : 'opacity-60 hover:opacity-90'}`}>
                  <p className={`font-game text-sm rarity-${r.toLowerCase()}`}>{RARITY_NAMES[r]}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{Math.round(ch * 100)}%</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Upgrade card */}
      {selectedEnot && targetRarity && (
        <div className="card-glass rounded-2xl p-5 border border-white/10 space-y-4 animate-scale-in">
          {/* Visual */}
          <div className="relative flex items-center justify-center gap-6">
            {/* Particles */}
            {particles.map(p => (
              <div key={p.id} className="absolute w-2 h-2 rounded-full pointer-events-none"
                style={{
                  left: `${p.x}%`, top: `${p.y}%`,
                  backgroundColor: p.color,
                  animation: 'float 1.2s ease-out forwards',
                  transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`,
                }} />
            ))}

            <div className={`text-center transition-all duration-500 ${phase === 'fail' ? 'opacity-0 scale-50' : phase === 'spinning' ? 'animate-pulse-glow' : ''}`}>
              <div className={`w-16 h-16 rounded-2xl bg-rarity-${selectedEnot.rarity.toLowerCase()} border-2 flex items-center justify-center text-3xl mx-auto mb-1`}>🦝</div>
              <RarityBadge rarity={selectedEnot.rarity} />
            </div>

            <div className={`text-2xl font-game transition-all duration-300 ${phase === 'spinning' ? 'animate-spin text-enot-gold text-3xl' : phase === 'success' ? 'text-enot-green' : phase === 'fail' ? 'text-red-500' : 'text-gray-400'}`}>
              {phase === 'spinning' ? '🎲' : phase === 'success' ? '🎉' : phase === 'fail' ? '💥' : '→'}
            </div>

            <div className={`text-center transition-all duration-500 ${phase === 'success' ? 'scale-110 ring-2 ring-enot-green rounded-2xl' : ''}`}>
              <div className={`w-16 h-16 rounded-2xl bg-rarity-${targetRarity.toLowerCase()} border-2 flex items-center justify-center text-3xl mx-auto mb-1 ${phase === 'success' ? 'animate-pulse-glow' : ''}`}>🦝</div>
              <RarityBadge rarity={targetRarity} />
            </div>
          </div>

          {/* Result message */}
          {(phase === 'success' || phase === 'fail') && (
            <div className={`text-center font-game text-lg animate-scale-in ${phase === 'success' ? 'text-enot-green' : 'text-red-400'}`}>
              {resultMsg}
            </div>
          )}

          {/* Chance */}
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Шанс успеха</p>
            <p className="font-game text-3xl text-enot-gold">{Math.round(chance * 100)}%</p>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-enot-gold to-enot-orange rounded-full transition-all duration-500"
              style={{ width: `${Math.round(chance * 100)}%` }} />
          </div>

          <button onClick={handleUpgrade}
            disabled={phase !== 'idle'}
            className="w-full py-3 rounded-xl font-game text-sm bg-gradient-to-r from-enot-gold to-enot-orange text-black hover:opacity-90 active:scale-95 transition-all glow-gold disabled:opacity-40 disabled:cursor-not-allowed">
            {phase === 'spinning' ? '🎲 Крутим...' : phase === 'idle' ? `🎲 Апгрейд! (${Math.round(chance * 100)}%)` : '...'}
          </button>
        </div>
      )}

      {/* Chance table */}
      <div className="card-glass rounded-2xl p-4 border border-white/5">
        <h3 className="font-game text-xs text-gray-400 uppercase tracking-widest mb-2">Таблица шансов</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {[1,2,3,4,5,6,7].map(diff => {
            const ch = [0.70,0.45,0.25,0.12,0.05,0.02,0.005][diff-1];
            return (
              <div key={diff} className="flex items-center justify-between text-xs">
                <span className="text-gray-500">+{diff} ступ{diff === 1 ? 'ень' : diff < 5 ? 'ени' : 'еней'}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-enot-gold rounded-full" style={{ width: `${ch * 100}%` }} />
                  </div>
                  <span className="text-enot-gold w-8 text-right">{Math.round(ch * 100)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}