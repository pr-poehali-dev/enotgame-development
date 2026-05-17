import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import Toast from '@/components/game/Toast';
import Icon from '@/components/ui/icon';

const HOUR = 60 * 60 * 1000;

function getCooldown(last: number | null): string {
  if (!last) return '';
  const diff = HOUR - (Date.now() - last);
  if (diff <= 0) return '';
  const m = Math.ceil(diff / 60000);
  return `${m} мин`;
}

export default function GamesPage() {
  const { state, activeEnot, doWalk, doFootball, doBasketball } = useGame();
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [anim, setAnim] = useState<string | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => setToast({ msg, type });

  const play = (action: () => { success: boolean; message: string }, id: string) => {
    const r = action();
    showToast(r.message, r.success ? 'success' : 'error');
    if (r.success) { setAnim(id); setTimeout(() => setAnim(null), 1500); }
  };

  const activities = [
    {
      id: 'walk',
      name: 'Прогулка',
      emoji: '🌳',
      description: 'Прогуляйся с енотом в парке',
      effect: '+15 настроения, -10 голода',
      color: 'from-green-500/20 to-emerald-500/10 border-green-500/30',
      action: doWalk,
      last: state.lastWalk,
    },
    {
      id: 'football',
      name: 'Футбол',
      emoji: '⚽',
      description: 'Сыграй в футбол с енотом',
      effect: '+20 настроения, -15 голода, +5 🪙',
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30',
      action: doFootball,
      last: state.lastFootball,
    },
    {
      id: 'basketball',
      name: 'Баскетбол',
      emoji: '🏀',
      description: 'Забрось мяч в корзину вместе с енотом',
      effect: '+25 настроения, -20 голода, +10 🪙',
      color: 'from-orange-500/20 to-amber-500/10 border-orange-500/30',
      action: doBasketball,
      last: state.lastBasketball,
    },
  ];

  return (
    <div className="space-y-4 pb-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="animate-fade-in">
        <h2 className="font-game text-2xl text-white mb-1">Активности</h2>
        <p className="text-sm text-gray-500">Играй с енотом раз в час</p>
      </div>

      {!activeEnot && (
        <div className="card-glass rounded-2xl p-4 text-center border border-yellow-500/20">
          <p className="text-yellow-400 text-sm">Нужен активный енот для игр</p>
        </div>
      )}

      <div className="space-y-3">
        {activities.map((act, i) => {
          const cd = getCooldown(act.last);
          const available = !cd;
          return (
            <div key={act.id}
              className={`rounded-2xl p-5 bg-gradient-to-br border transition-all animate-fade-in ${act.color} ${anim === act.id ? 'scale-105' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start gap-4">
                <div className={`text-4xl transition-transform duration-300 ${anim === act.id ? 'animate-float' : ''}`}>
                  {act.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-game text-lg text-white mb-1">{act.name}</h3>
                  <p className="text-sm text-gray-400 mb-1">{act.description}</p>
                  <p className="text-xs text-gray-500">{act.effect}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                {cd && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Icon name="Clock" size={12} />
                    <span>Снова через {cd}</span>
                  </div>
                )}
                {!cd && <div />}
                <button
                  onClick={() => play(act.action, act.id)}
                  disabled={!available || !activeEnot}
                  className={`px-5 py-2 rounded-xl font-game text-sm transition-all ${available && activeEnot ? 'bg-white/20 hover:bg-white/30 text-white active:scale-95' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                >
                  {available ? 'Играть!' : 'Ждать'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="card-glass rounded-2xl p-4 border border-white/5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h3 className="font-game text-sm text-gray-400 uppercase tracking-widest mb-2">Как это работает</h3>
        <ul className="space-y-1.5 text-xs text-gray-500">
          <li>🌳 Прогулка поднимает настроение и расходует голод</li>
          <li>⚽ Футбол и 🏀 баскетбол дают монеты бонусом</li>
          <li>⏰ Каждая активность доступна раз в час</li>
          <li>🍖 Не забывай кормить енота — голод расходуется на играх</li>
        </ul>
      </div>
    </div>
  );
}
