import { useGame } from '@/context/GameContext';
import StatBar from '@/components/game/StatBar';
import RarityBadge from '@/components/game/RarityBadge';
import Icon from '@/components/ui/icon';

export default function EnotProfilePage() {
  const { state, activeEnot, setActiveEnot } = useGame();

  if (!activeEnot) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-7xl mb-4 animate-float">🦝</div>
        <p className="text-gray-400 text-lg">У тебя нет активного енота</p>
        <p className="text-gray-600 text-sm mt-2">Купи енота в магазине</p>
      </div>
    );
  }

  const rarityColors: Record<string, string> = {
    Common: '#9ca3af', Uncommon: '#34d399', Epic: '#a78bfa',
    Mythic: '#f472b6', Legendary: '#fbbf24', Super: '#60a5fa',
    Ultra: '#f97316', Secret: '#e879f9',
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Main card */}
      <div className={`rounded-3xl overflow-hidden bg-rarity-${activeEnot.rarity.toLowerCase()} border animate-fade-in`}>
        <div className="p-6">
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              <img
                src={activeEnot.photo}
                alt={activeEnot.name}
                className="w-28 h-28 rounded-2xl object-cover border-2"
                style={{ borderColor: rarityColors[activeEnot.rarity] }}
              />
              <div className="absolute -bottom-2 -right-2 text-2xl animate-float">{activeEnot.emoji}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <RarityBadge rarity={activeEnot.rarity} />
              </div>
              <h2 className="font-game text-2xl text-white mb-1">{activeEnot.name}</h2>
              <p className="text-sm text-gray-300 leading-relaxed">{activeEnot.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Icon name="Star" size={14} className="text-enot-gold" />
                  <span>Ур. {activeEnot.level}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Icon name="Zap" size={14} className="text-enot-purple" />
                  <span>{activeEnot.experience} XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="card-glass rounded-3xl p-5 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h3 className="font-game text-sm text-gray-400 uppercase tracking-widest">Характеристики</h3>
        <StatBar label="Здоровье" value={activeEnot.health} color="linear-gradient(90deg,#f43f5e,#ec4899)" emoji="❤️" />
        <StatBar label="Настроение" value={activeEnot.mood} color="linear-gradient(90deg,#a78bfa,#818cf8)" emoji="😊" />
        <StatBar label="Голод" value={activeEnot.hunger} color="linear-gradient(90deg,#fb923c,#f59e0b)" emoji="🍖" />

        {/* Health status */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[
            { label: 'Состояние', value: activeEnot.health >= 70 ? '😄 Отлично' : activeEnot.health >= 40 ? '😐 Норм' : '😰 Плохо' },
            { label: 'Настрой', value: activeEnot.mood >= 70 ? '🥳 Весёлый' : activeEnot.mood >= 40 ? '🙂 Спокойный' : '😒 Грустный' },
            { label: 'Аппетит', value: activeEnot.hunger >= 70 ? '😊 Сытый' : activeEnot.hunger >= 40 ? '🙂 Терпит' : '😩 Голодный' },
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-xl p-2 text-center">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-xs font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Switch enot */}
      {state.enots.length > 1 && (
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-game text-lg text-white mb-3">Сменить енота</h3>
          <div className="grid grid-cols-3 gap-2">
            {state.enots.map(enot => (
              <button
                key={enot.id}
                onClick={() => setActiveEnot(enot.id)}
                className={`rounded-2xl p-2 text-center transition-all border hover-lift active:scale-95 bg-rarity-${enot.rarity.toLowerCase()} ${state.activeEnotId === enot.id ? 'ring-2 ring-enot-green' : 'opacity-70'}`}
              >
                <img src={enot.photo} alt={enot.name} className="w-full aspect-square rounded-xl object-cover mb-1" />
                <p className="text-xs text-white font-semibold truncate">{enot.name}</p>
                {state.activeEnotId === enot.id && (
                  <p className="text-xs text-enot-green">Активный</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
