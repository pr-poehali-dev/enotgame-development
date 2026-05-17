import { useState, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import Toast from '@/components/game/Toast';
import Icon from '@/components/ui/icon';

type GameMode = 'menu' | 'clicker' | 'mines';

const MINE_SIZE = 5;
const MINE_COUNT = 5;

function generateMineField(): { mine: boolean; revealed: boolean; flagged: boolean }[][] {
  const field = Array(MINE_SIZE).fill(null).map(() =>
    Array(MINE_SIZE).fill(null).map(() => ({ mine: false, revealed: false, flagged: false }))
  );
  let placed = 0;
  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * MINE_SIZE);
    const c = Math.floor(Math.random() * MINE_SIZE);
    if (!field[r][c].mine) { field[r][c].mine = true; placed++; }
  }
  return field;
}

function countAdjacentMines(field: { mine: boolean }[][], row: number, col: number): number {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++)
    for (let c = col - 1; c <= col + 1; c++)
      if (r >= 0 && r < MINE_SIZE && c >= 0 && c < MINE_SIZE && field[r][c].mine) count++;
  return count;
}

function ClickerGame({ onEarn }: { onEarn: (n: number) => void }) {
  const [clicks, setClicks] = useState(0);
  const [session, setSession] = useState(0);
  const [floats, setFloats] = useState<{ id: number; x: number; y: number; val: number }[]>([]);
  const multiplier = 1 + Math.floor(session / 10);

  const handleClick = (e: React.MouseEvent) => {
    const earned = multiplier;
    setClicks(c => c + 1);
    setSession(s => s + 1);
    onEarn(earned);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = Date.now();
    setFloats(f => [...f, { id, x: e.clientX - rect.left, y: e.clientY - rect.top, val: earned }]);
    setTimeout(() => setFloats(f => f.filter(i => i.id !== id)), 800);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center">
        <p className="text-gray-400 text-sm">Кликай по еноту и зарабатывай монеты!</p>
        <p className="text-xs text-gray-600 mt-1">Множитель: ×{multiplier} (растёт каждые 10 кликов)</p>
      </div>
      <div className="flex justify-center">
        <div className="relative">
          <button
            onClick={handleClick}
            className="w-36 h-36 rounded-3xl bg-gradient-to-br from-enot-green/20 to-enot-blue/20 border border-enot-green/30 flex items-center justify-center text-7xl hover:scale-105 active:scale-90 transition-all duration-150 select-none glow-green"
          >
            🦝
          </button>
          {floats.map(f => (
            <div key={f.id} className="absolute pointer-events-none font-game text-enot-gold font-bold text-sm"
              style={{ left: f.x, top: f.y, animation: 'float 0.8s ease-out forwards' }}>
              +{f.val}🦝
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="card-glass rounded-2xl p-3 text-center border border-white/5">
          <p className="text-2xl font-game text-enot-green">{session}</p>
          <p className="text-xs text-gray-500">кликов за сессию</p>
        </div>
        <div className="card-glass rounded-2xl p-3 text-center border border-white/5">
          <p className="text-2xl font-game text-enot-gold">×{multiplier}</p>
          <p className="text-xs text-gray-500">монет за клик</p>
        </div>
      </div>
    </div>
  );
}

function MinesGame({ onEarn }: { onEarn: (n: number) => void }) {
  const [field, setField] = useState(() => generateMineField());
  const [status, setStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [bet, setBet] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [safeRevealed, setSafeRevealed] = useState(0);

  const startGame = () => {
    setField(generateMineField());
    setStatus('playing');
    setMultiplier(1);
    setSafeRevealed(0);
  };

  const reset = () => setStatus('idle');

  const reveal = (row: number, col: number) => {
    if (status !== 'playing' || field[row][col].revealed) return;
    const newField = field.map(r => r.map(c => ({ ...c })));
    if (newField[row][col].mine) {
      newField.forEach(r => r.forEach(c => { if (c.mine) c.revealed = true; }));
      setField(newField); setStatus('lost');
    } else {
      newField[row][col].revealed = true;
      const safe = safeRevealed + 1;
      setSafeRevealed(safe);
      const newMult = parseFloat((multiplier * 1.3).toFixed(2));
      setMultiplier(newMult);
      setField(newField);
      if (safe >= MINE_SIZE * MINE_SIZE - MINE_COUNT) setStatus('won');
    }
  };

  const cashOut = () => {
    const earned = Math.floor(bet * multiplier);
    onEarn(earned);
    setStatus('won');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Открывай клетки, избегай мин!</p>
          <p className="text-xs text-gray-600">{MINE_COUNT} мин на поле {MINE_SIZE}×{MINE_SIZE}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-game text-enot-gold">×{multiplier}</p>
          <p className="text-xs text-gray-500">множитель</p>
        </div>
      </div>

      {/* Bet */}
      <div className="flex items-center gap-2 card-glass rounded-xl p-3 border border-white/5">
        <span className="text-sm text-gray-400">Ставка:</span>
        <div className="flex gap-1.5 flex-1">
          {[10, 25, 50, 100].map(v => (
            <button key={v} onClick={() => setBet(v)} disabled={status === 'playing'}
              className={`flex-1 py-1 rounded-lg text-xs font-game transition-all ${bet === v ? 'bg-enot-gold text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'} ${status === 'playing' ? 'opacity-40 cursor-not-allowed' : ''}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Field */}
      <div className="relative">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${MINE_SIZE}, 1fr)` }}>
          {field.map((row, r) => row.map((cell, c) => (
            <button key={`${r}-${c}`}
              onClick={() => reveal(r, c)}
              disabled={status !== 'playing' || cell.revealed}
              className={`aspect-square rounded-xl flex items-center justify-center text-lg font-bold transition-all
                ${cell.revealed
                  ? cell.mine ? 'bg-red-500/30 border border-red-500/50' : 'bg-enot-green/20 border border-enot-green/30'
                  : status === 'playing' ? 'bg-white/10 border border-white/10 hover:bg-white/20 active:scale-90' : 'bg-white/5 border border-white/5'
                }`}>
              {cell.revealed ? (cell.mine ? '💣' : countAdjacentMines(field, r, c) > 0 ? <span className="text-sm text-white">{countAdjacentMines(field, r, c)}</span> : '✓') : ''}
            </button>
          )))}
        </div>

        {/* Overlay when idle */}
        {status === 'idle' && (
          <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <button onClick={startGame}
              className="px-8 py-3 rounded-xl font-game text-base bg-gradient-to-r from-red-500 to-rose-600 text-white hover:opacity-90 active:scale-95 transition-all shadow-lg">
              💣 Начать игру
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      {status === 'playing' && safeRevealed > 0 && (
        <button onClick={cashOut}
          className="w-full py-3 rounded-xl font-game text-sm bg-enot-gold text-black hover:opacity-90 active:scale-95 transition-all glow-gold">
          🦝 Забрать {Math.floor(bet * multiplier)} монет
        </button>
      )}
      {status === 'lost' && (
        <div className="text-center space-y-2">
          <p className="text-red-400 font-game text-lg">💥 Мина! Ставка сгорела</p>
          <button onClick={reset} className="px-6 py-2 rounded-xl font-game text-sm bg-white/10 text-white hover:bg-white/20 transition-all">
            Попробовать снова
          </button>
        </div>
      )}
      {status === 'won' && (
        <div className="text-center space-y-2">
          <p className="text-enot-green font-game text-lg">🎉 +{Math.floor(bet * multiplier)} монет!</p>
          <button onClick={reset} className="px-6 py-2 rounded-xl font-game text-sm bg-enot-green text-black hover:opacity-90 transition-all">
            Играть снова
          </button>
        </div>
      )}
    </div>
  );
}

export default function EarnPage() {
  const { addCoins, state } = useGame();
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleEarn = useCallback((n: number) => {
    addCoins(n);
  }, [addCoins]);

  if (gameMode === 'clicker') {
    return (
      <div className="space-y-4 pb-4">
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        <div className="flex items-center gap-3">
          <button onClick={() => setGameMode('menu')} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
            <Icon name="ArrowLeft" size={20} className="text-white" />
          </button>
          <h2 className="font-game text-xl text-white">Кликер</h2>
          <div className="ml-auto flex items-center gap-1 bg-enot-gold/10 border border-enot-gold/30 px-3 py-1.5 rounded-full">
            <span>🦝</span><span className="font-game text-enot-gold">{state.coins.toLocaleString()}</span>
          </div>
        </div>
        <ClickerGame onEarn={handleEarn} />
      </div>
    );
  }

  if (gameMode === 'mines') {
    return (
      <div className="space-y-4 pb-4">
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        <div className="flex items-center gap-3">
          <button onClick={() => setGameMode('menu')} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
            <Icon name="ArrowLeft" size={20} className="text-white" />
          </button>
          <h2 className="font-game text-xl text-white">Мины</h2>
          <div className="ml-auto flex items-center gap-1 bg-enot-gold/10 border border-enot-gold/30 px-3 py-1.5 rounded-full">
            <span>🦝</span><span className="font-game text-enot-gold">{state.coins.toLocaleString()}</span>
          </div>
        </div>
        <MinesGame onEarn={(n) => { handleEarn(n); setToast({ msg: `+${n} монет!`, type: 'success' }); }} />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="animate-fade-in">
        <h2 className="font-game text-2xl text-white mb-1">Заработок</h2>
        <p className="text-sm text-gray-500">Играй и зарабатывай монеты</p>
      </div>

      <div className="space-y-3">
        <button onClick={() => setGameMode('clicker')}
          className="w-full rounded-2xl p-5 bg-gradient-to-br from-enot-green/20 to-emerald-500/10 border border-enot-green/30 text-left hover-lift active:scale-95 transition-all animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🖱️</div>
            <div>
              <h3 className="font-game text-lg text-white">Кликер</h3>
              <p className="text-sm text-gray-400">Кликай по еноту, зарабатывай монеты</p>
              <p className="text-xs text-gray-600 mt-1">Множитель растёт с каждым кликом</p>
            </div>
          </div>
        </button>

        <button onClick={() => setGameMode('mines')}
          className="w-full rounded-2xl p-5 bg-gradient-to-br from-red-500/20 to-rose-500/10 border border-red-500/30 text-left hover-lift active:scale-95 transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">💣</div>
            <div>
              <h3 className="font-game text-lg text-white">Мины</h3>
              <p className="text-sm text-gray-400">Открывай клетки без мин</p>
              <p className="text-xs text-gray-600 mt-1">Множитель растёт за каждую открытую клетку</p>
            </div>
          </div>
        </button>
      </div>

      <div className="card-glass rounded-2xl p-4 border border-white/5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-game text-sm text-gray-400 uppercase tracking-widest mb-2">Советы</h3>
        <ul className="space-y-1.5 text-xs text-gray-500">
          <li>💡 В кликере множитель растёт каждые 10 кликов</li>
          <li>💡 В минах забирай выигрыш вовремя — можно потерять всё</li>
          <li>💡 Не забывай про часовой бонус на главной</li>
        </ul>
      </div>
    </div>
  );
}