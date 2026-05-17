import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import Toast from '@/components/game/Toast';
import CraftPage from './CraftPage';
import UpgradePage from './UpgradePage';
import { useCountdown, useCooldownEnd } from '@/hooks/useCountdown';

const HOUR = 3600000;

type SubPage = 'activities' | 'craft' | 'upgrade';

function LiveTimer({ last, duration }: { last: number | null; duration: number }) {
  const end = useCooldownEnd(last, duration);
  const timer = useCountdown(end, 1000);
  if (!timer) return <span className="text-enot-green text-xs">Готово!</span>;
  return <span className="text-gray-500 text-xs tabular-nums">{timer}</span>;
}

export default function GamesPage() {
  const { state, activeEnot, doWalk, doFootball, doBasketball } = useGame();
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [anim, setAnim] = useState<string | null>(null);
  const [subPage, setSubPage] = useState<SubPage>('activities');

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => setToast({ msg, type });

  const play = (action: () => { success: boolean; message: string }, id: string) => {
    const r = action();
    showToast(r.message, r.success ? 'success' : 'error');
    if (r.success) { setAnim(id); setTimeout(() => setAnim(null), 1000); }
  };

  const isOnCooldown = (last: number | null) => {
    if (!last) return false;
    return Date.now() - last < HOUR;
  };

  const activities = [
    {
      id: 'walk', name: 'Прогулка', emoji: '🌳',
      description: '+15 настроения, -10 голода',
      color: 'from-green-500/20 to-emerald-500/10 border-green-500/30',
      action: doWalk, last: state.lastWalk,
    },
    {
      id: 'football', name: 'Футбол', emoji: '⚽',
      description: '+20 настроения, -15 голода, +5 🦝',
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30',
      action: doFootball, last: state.lastFootball,
    },
    {
      id: 'basketball', name: 'Баскетбол', emoji: '🏀',
      description: '+25 настроения, -20 голода, +10 🦝',
      color: 'from-orange-500/20 to-amber-500/10 border-orange-500/30',
      action: doBasketball, last: state.lastBasketball,
    },
  ];

  const SUB_TABS: { id: SubPage; label: string; emoji: string }[] = [
    { id: 'activities', label: 'Активности', emoji: '🌳' },
    { id: 'craft', label: 'Крафт', emoji: '🌿' },
    { id: 'upgrade', label: 'Апгрейд', emoji: '⬆️' },
  ];

  return (
    <div className="space-y-4 pb-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="animate-fade-in">
        <h2 className="font-game text-2xl text-white mb-1">Игры</h2>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-2">
        {SUB_TABS.map(t => (
          <button key={t.id} onClick={() => setSubPage(t.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl font-game text-xs transition-all ${subPage === t.id ? 'bg-enot-green text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            <span>{t.emoji}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {subPage === 'activities' && (
        <div className="space-y-3 animate-fade-in">
          {!activeEnot && (
            <div className="card-glass rounded-2xl p-4 text-center border border-yellow-500/20">
              <p className="text-yellow-400 text-sm">Нужен активный енот для игр</p>
            </div>
          )}

          {activities.map((act, i) => {
            const onCD = isOnCooldown(act.last);
            return (
              <div key={act.id}
                className={`rounded-2xl p-4 bg-gradient-to-br border transition-all animate-fade-in ${act.color} ${anim === act.id ? 'scale-105' : ''}`}
                style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-center gap-4">
                  <div className={`text-3xl ${anim === act.id ? 'animate-float' : ''}`}>{act.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-game text-base text-white">{act.name}</h3>
                    <p className="text-xs text-gray-400">{act.description}</p>
                    <div className="mt-1">
                      <LiveTimer last={act.last} duration={HOUR} />
                    </div>
                  </div>
                  <button
                    onClick={() => play(act.action, act.id)}
                    disabled={onCD || !activeEnot}
                    className={`px-4 py-2 rounded-xl font-game text-xs transition-all ${!onCD && activeEnot ? 'bg-white/20 hover:bg-white/30 text-white active:scale-95' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                  >
                    {onCD ? 'Ждать' : 'Играть!'}
                  </button>
                </div>
              </div>
            );
          })}

          <div className="card-glass rounded-2xl p-3 border border-white/5 animate-fade-in" style={{ animationDelay: '0.35s' }}>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>⏰ Каждая активность доступна раз в час</li>
              <li>🍖 Голод расходуется во время игр</li>
            </ul>
          </div>
        </div>
      )}

      {subPage === 'craft' && <CraftPage />}
      {subPage === 'upgrade' && <UpgradePage />}
    </div>
  );
}