import { useGame } from '@/context/GameContext';

export default function AchievementsPage() {
  const { state } = useGame();
  const { achievements } = state;

  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-4 pb-4">
      <div className="animate-fade-in">
        <h2 className="font-game text-2xl text-white mb-1">Достижения</h2>
        <p className="text-sm text-gray-500">{unlocked} / {achievements.length} разблокировано</p>
      </div>

      {/* Progress */}
      <div className="card-glass rounded-2xl p-4 border border-white/5 animate-fade-in">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Прогресс</span>
          <span>{Math.round((unlocked / achievements.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-enot-gold to-enot-orange rounded-full transition-all duration-700"
            style={{ width: `${(unlocked / achievements.length) * 100}%` }} />
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {achievements.map((a, i) => (
          <div
            key={a.id}
            className={`rounded-2xl p-4 border transition-all animate-fade-in ${a.unlocked
              ? 'bg-gradient-to-r from-enot-gold/10 to-enot-orange/5 border-enot-gold/30'
              : 'card-glass border-white/5 opacity-70'
              }`}
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="flex items-center gap-3">
              <div className={`text-3xl w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 ${a.unlocked ? 'bg-enot-gold/20' : 'bg-white/5'}`}>
                {a.unlocked ? a.emoji : '🔒'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className={`font-game text-sm ${a.unlocked ? 'text-enot-gold' : 'text-gray-300'}`}>{a.name}</p>
                  {a.unlocked && <span className="text-xs text-enot-green">✓ Получено</span>}
                </div>
                <p className="text-xs text-gray-500 mb-1.5">{a.description}</p>

                {/* Progress bar */}
                {!a.unlocked && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Прогресс</span>
                      <span>{Math.min(a.progress, a.target)} / {a.target}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-enot-purple to-enot-blue rounded-full transition-all"
                        style={{ width: `${Math.min((a.progress / a.target) * 100, 100)}%` }} />
                    </div>
                  </div>
                )}

                {/* Reward */}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-gray-600">Награда:</span>
                  {a.reward.coins && (
                    <span className="text-xs text-enot-gold">🪙 {a.reward.coins} монет</span>
                  )}
                  {a.reward.enot && (
                    <span className="text-xs text-enot-purple">🦝 {a.reward.enot} енот</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
