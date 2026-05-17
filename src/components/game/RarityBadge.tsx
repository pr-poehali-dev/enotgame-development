import type { Rarity } from '@/types/game';

const labels: Record<Rarity, string> = {
  Common: 'Обычный',
  Uncommon: 'Необычный',
  Epic: 'Эпический',
  Mythic: 'Мифический',
  Legendary: 'Легендарный',
  Super: 'Супер',
  Ultra: 'Ультра',
  Secret: 'Секретный',
};

export default function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span className={`text-xs font-game px-2 py-0.5 rounded-full border rarity-${rarity.toLowerCase()} bg-rarity-${rarity.toLowerCase()}`}>
      {labels[rarity]}
    </span>
  );
}
