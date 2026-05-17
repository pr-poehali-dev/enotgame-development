import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { CRAFT_ITEMS } from '@/data/gameData';
import Toast from '@/components/game/Toast';
import type { CraftItem } from '@/types/game';

export default function CraftPage() {
  const { state, craftMerge } = useGame();
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [craftField, setCraftField] = useState<(CraftItem | null)[][]>(
    () => state.craftField
  );

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => setToast({ msg, type });

  const handleCellClick = (row: number, col: number) => {
    const cell = craftField[row][col];
    if (!selected) {
      if (cell) setSelected({ row, col });
      return;
    }
    if (selected.row === row && selected.col === col) {
      setSelected(null);
      return;
    }
    const src = craftField[selected.row][selected.col];
    const tgt = craftField[row][col];

    if (!tgt) {
      // Move
      const newField = craftField.map(r => [...r]);
      newField[row][col] = src;
      newField[selected.row][selected.col] = null;
      setCraftField(newField);
      setSelected(null);
      return;
    }

    if (src && tgt && src.id === tgt.id && src.level === tgt.level) {
      const nextItem = CRAFT_ITEMS.find(i => i.level === src.level + 1);
      if (!nextItem) {
        showToast('Это максимальный уровень!', 'info');
        setSelected(null);
        return;
      }
      const newField = craftField.map(r => [...r]);
      newField[selected.row][selected.col] = null;
      newField[row][col] = nextItem;
      setCraftField(newField);
      setSelected(null);
      showToast(`✨ ${src.name} → ${nextItem.name}! +${src.expReward} XP`, 'success');
      craftMerge(selected.row, selected.col, row, col);
    } else {
      // Swap
      const newField = craftField.map(r => [...r]);
      newField[selected.row][selected.col] = tgt;
      newField[row][col] = src;
      setCraftField(newField);
      setSelected(null);
    }
  };

  const addStarterItem = () => {
    const starter = CRAFT_ITEMS[0];
    const newField = craftField.map(r => [...r]);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (!newField[r][c]) {
          newField[r][c] = starter;
          setCraftField(newField);
          showToast(`${starter.emoji} ${starter.name} добавлен!`, 'success');
          return;
        }
      }
    }
    showToast('Поле заполнено!', 'error');
  };

  const expPct = Math.round((state.experience / (state.level * 200)) * 100);

  return (
    <div className="space-y-4 pb-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="animate-fade-in">
        <h2 className="font-game text-2xl text-white mb-1">Крафт</h2>
        <p className="text-sm text-gray-500">Соединяй одинаковые предметы для получения новых</p>
      </div>

      {/* Level XP */}
      <div className="card-glass rounded-2xl p-4 border border-white/5 animate-fade-in">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Уровень {state.level}</span>
          <span>{state.experience} / {state.level * 200} XP</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-enot-purple to-enot-blue rounded-full transition-all duration-700"
            style={{ width: `${expPct}%` }} />
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-2 overflow-x-auto pb-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {CRAFT_ITEMS.map(item => (
          <div key={item.id} className="flex-shrink-0 flex flex-col items-center gap-1 text-center w-12">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg">
              {item.emoji}
            </div>
            <span className="text-[9px] text-gray-600 leading-tight">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Field */}
      <div className="card-glass rounded-2xl p-3 border border-white/5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="grid gap-1.5 mb-3" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
          {craftField.map((row, r) => row.map((cell, c) => {
            const isSelected = selected?.row === r && selected?.col === c;
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`aspect-square rounded-lg flex items-center justify-center text-base transition-all border
                  ${isSelected
                    ? 'bg-enot-green/30 border-enot-green scale-110 ring-1 ring-enot-green'
                    : cell
                      ? 'bg-white/10 border-white/15 hover:bg-white/20 active:scale-90'
                      : 'bg-white/3 border-white/5 hover:bg-white/8'
                  }`}
              >
                {cell ? cell.emoji : ''}
              </button>
            );
          }))}
        </div>

        <button
          onClick={addStarterItem}
          className="w-full py-2.5 rounded-xl font-game text-sm bg-enot-purple/20 text-enot-purple border border-enot-purple/30 hover:bg-enot-purple/30 active:scale-95 transition-all"
        >
          + Добавить {CRAFT_ITEMS[0].emoji} {CRAFT_ITEMS[0].name}
        </button>
      </div>

      {/* Guide */}
      <div className="card-glass rounded-2xl p-4 border border-white/5 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h3 className="font-game text-sm text-gray-400 uppercase tracking-widest mb-2">Как играть</h3>
        <ul className="space-y-1.5 text-xs text-gray-500">
          <li>🖱️ Нажми на предмет чтобы выбрать его</li>
          <li>🔀 Нажми на другую клетку чтобы переместить или соединить</li>
          <li>✨ Два одинаковых предмета объединяются в более редкий</li>
          <li>⭐ Каждое объединение даёт опыт и повышает уровень</li>
          <li>🎁 За достижение уровней получай енотов и монеты</li>
        </ul>
      </div>
    </div>
  );
}
