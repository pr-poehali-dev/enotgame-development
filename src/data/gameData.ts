import type { Enot, Food, Achievement, CraftItem } from '@/types/game';

export const ENOT_PHOTOS: Record<string, string[]> = {
  Common: [
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-common-1&backgroundColor=374151',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-common-2&backgroundColor=374151',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-common-3&backgroundColor=374151',
  ],
  Uncommon: [
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-uncommon-1&backgroundColor=065f46',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-uncommon-2&backgroundColor=065f46',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-uncommon-3&backgroundColor=065f46',
  ],
  Epic: [
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-epic-1&backgroundColor=4c1d95',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-epic-2&backgroundColor=4c1d95',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-epic-3&backgroundColor=4c1d95',
  ],
  Mythic: [
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-mythic-1&backgroundColor=831843',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-mythic-2&backgroundColor=831843',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-mythic-3&backgroundColor=831843',
  ],
  Legendary: [
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-leg-1&backgroundColor=78350f',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-leg-2&backgroundColor=78350f',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-leg-3&backgroundColor=78350f',
  ],
  Super: [
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-super-1&backgroundColor=1e3a8a',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-super-2&backgroundColor=1e3a8a',
  ],
  Ultra: [
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-ultra-1&backgroundColor=7c2d12',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-ultra-2&backgroundColor=7c2d12',
  ],
  Secret: [
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-secret-1&backgroundColor=581c87',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=enot-secret-2&backgroundColor=581c87',
  ],
};

export const SHOP_ENOTS: Omit<Enot, 'id' | 'health' | 'mood' | 'hunger' | 'level' | 'experience'>[] = [
  { name: 'Серый Бродяга', rarity: 'Common', emoji: '🦝', photo: ENOT_PHOTOS.Common[0], description: 'Обычный уличный енот. Дружелюбный и неприхотливый.', price: 100 },
  { name: 'Полосатик', rarity: 'Common', emoji: '🦝', photo: ENOT_PHOTOS.Common[1], description: 'Любит мусорные баки и лунные ночи.', price: 120 },
  { name: 'Зелёный Страж', rarity: 'Uncommon', emoji: '🦝', photo: ENOT_PHOTOS.Uncommon[0], description: 'Необычный енот с зелёными глазами. Умеет находить еду.', price: 350 },
  { name: 'Лесной Хитрец', rarity: 'Uncommon', emoji: '🦝', photo: ENOT_PHOTOS.Uncommon[1], description: 'Вырос в лесу, знает секреты природы.', price: 400 },
  { name: 'Фиолетовый Маг', rarity: 'Epic', emoji: '🦝', photo: ENOT_PHOTOS.Epic[0], description: 'Обладает магическими способностями. Умеет левитировать.', price: 1200 },
  { name: 'Звёздный Странник', rarity: 'Epic', emoji: '🦝', photo: ENOT_PHOTOS.Epic[1], description: 'Пришёл из другой галактики. Светится в темноте.', price: 1500 },
  { name: 'Розовый Фантом', rarity: 'Mythic', emoji: '🦝', photo: ENOT_PHOTOS.Mythic[0], description: 'Легендарный енот-призрак. Появляется только в полнолуние.', price: 4000 },
  { name: 'Кровавый Охотник', rarity: 'Mythic', emoji: '🦝', photo: ENOT_PHOTOS.Mythic[1], description: 'Безжалостный ночной охотник. Боится только кота.', price: 5000 },
  { name: 'Золотой Хранитель', rarity: 'Legendary', emoji: '👑', photo: ENOT_PHOTOS.Legendary[0], description: 'Легендарный страж золотых сокровищ. Очень редкий.', price: 12000 },
  { name: 'Солнечный Король', rarity: 'Legendary', emoji: '☀️', photo: ENOT_PHOTOS.Legendary[1], description: 'Правитель всех енотов. Несёт свет и тепло.', price: 15000 },
  { name: 'Синий Молниевик', rarity: 'Super', emoji: '⚡', photo: ENOT_PHOTOS.Super[0], description: 'Скорость молнии! Самый быстрый енот в мире.', price: 40000 },
  { name: 'Космический', rarity: 'Ultra', emoji: '🌌', photo: ENOT_PHOTOS.Ultra[0], description: 'Прилетел с Марса. Дышит в космосе.', price: 150000 },
  { name: '??? Тайный', rarity: 'Secret', emoji: '🌀', photo: ENOT_PHOTOS.Secret[0], description: 'Никто не знает откуда он. Никто не знает что он умеет.', price: 999999 },
];

export const FOODS: Food[] = [
  { id: 'apple', name: 'Яблоко', emoji: '🍎', price: 10, healthRestore: 5, hungerRestore: 10, description: 'Свежее яблочко' },
  { id: 'banana', name: 'Банан', emoji: '🍌', price: 15, healthRestore: 8, hungerRestore: 15, description: 'Сладкий банан' },
  { id: 'fish', name: 'Рыбка', emoji: '🐟', price: 30, healthRestore: 15, hungerRestore: 25, description: 'Свежая рыба' },
  { id: 'berry', name: 'Ягоды', emoji: '🍓', price: 25, healthRestore: 12, hungerRestore: 20, description: 'Лесные ягоды' },
  { id: 'crab', name: 'Краб', emoji: '🦀', price: 60, healthRestore: 25, hungerRestore: 40, description: 'Морской деликатес' },
  { id: 'pizza', name: 'Пицца', emoji: '🍕', price: 80, healthRestore: 20, hungerRestore: 50, description: 'Любимое блюдо' },
  { id: 'sushi', name: 'Суши', emoji: '🍣', price: 120, healthRestore: 35, hungerRestore: 60, description: 'Японский деликатес' },
  { id: 'steak', name: 'Стейк', emoji: '🥩', price: 200, healthRestore: 50, hungerRestore: 80, description: 'Сочный стейк' },
  { id: 'potion', name: 'Зелье здоровья', emoji: '🧪', price: 300, healthRestore: 100, hungerRestore: 0, description: 'Полностью восстанавливает здоровье' },
  { id: 'feast', name: 'Пир', emoji: '🍱', price: 500, healthRestore: 60, hungerRestore: 100, description: 'Восстанавливает всё сразу!' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_feed', name: 'Первая кормёжка', description: 'Покорми енота первый раз', emoji: '🍎', reward: { coins: 50 }, unlocked: false, progress: 0, target: 1 },
  { id: 'feed_10', name: 'Заботливый хозяин', description: 'Покорми енота 10 раз', emoji: '🍱', reward: { coins: 200 }, unlocked: false, progress: 0, target: 10 },
  { id: 'click_100', name: '100 кликов', description: 'Кликни по еноту 100 раз', emoji: '👆', reward: { coins: 100 }, unlocked: false, progress: 0, target: 100 },
  { id: 'click_500', name: '500 кликов', description: 'Кликни по еноту 500 раз', emoji: '💥', reward: { enot: 'Uncommon' }, unlocked: false, progress: 0, target: 500 },
  { id: 'click_1000', name: '1000 кликов', description: 'Кликни по еноту 1000 раз', emoji: '🚀', reward: { enot: 'Epic', coins: 500 }, unlocked: false, progress: 0, target: 1000 },
  { id: 'first_walk', name: 'Первая прогулка', description: 'Погуляй с енотом', emoji: '🌳', reward: { coins: 30 }, unlocked: false, progress: 0, target: 1 },
  { id: 'first_buy', name: 'Первая покупка', description: 'Купи что-нибудь в магазине', emoji: '🛍️', reward: { coins: 25 }, unlocked: false, progress: 0, target: 1 },
  { id: 'craft_10', name: 'Крафтер', description: 'Сделай 10 крафтов', emoji: '🌿', reward: { coins: 150 }, unlocked: false, progress: 0, target: 10 },
  { id: 'level_5', name: 'Уровень 5', description: 'Достигни 5 уровня', emoji: '⭐', reward: { enot: 'Epic' }, unlocked: false, progress: 0, target: 5 },
  { id: 'coins_1000', name: 'Богатей', description: 'Накопи 1000 монет', emoji: '💰', reward: { coins: 200 }, unlocked: false, progress: 0, target: 1000 },
];

export const CRAFT_ITEMS: CraftItem[] = [
  { id: 'cucumber', name: 'Огурец', emoji: '🥒', level: 1, expReward: 5 },
  { id: 'carrot', name: 'Морковь', emoji: '🥕', level: 2, expReward: 10 },
  { id: 'tomato', name: 'Помидор', emoji: '🍅', level: 3, expReward: 20 },
  { id: 'apple_c', name: 'Яблоко', emoji: '🍎', level: 4, expReward: 35 },
  { id: 'strawberry', name: 'Клубника', emoji: '🍓', level: 5, expReward: 55 },
  { id: 'watermelon', name: 'Арбуз', emoji: '🍉', level: 6, expReward: 80 },
  { id: 'pineapple', name: 'Ананас', emoji: '🍍', level: 7, expReward: 110 },
  { id: 'mango', name: 'Манго', emoji: '🥭', level: 8, expReward: 150 },
  { id: 'coconut', name: 'Кокос', emoji: '🥥', level: 9, expReward: 200 },
  { id: 'peach', name: 'Персик', emoji: '🍑', level: 10, expReward: 260 },
  { id: 'dragon_fruit', name: 'Дракон-фрукт', emoji: '🌺', level: 11, expReward: 330 },
  { id: 'golden_fruit', name: 'Золотой фрукт', emoji: '✨', level: 12, expReward: 500 },
];

export const RARITY_ORDER: Record<string, number> = {
  Common: 0, Uncommon: 1, Epic: 2, Mythic: 3, Legendary: 4, Super: 5, Ultra: 6, Secret: 7
};

export const UPGRADE_CHANCES: Record<string, number> = {
  Common: 0.8,
  Uncommon: 0.6,
  Epic: 0.45,
  Mythic: 0.3,
  Legendary: 0.2,
  Super: 0.1,
  Ultra: 0.05,
  Secret: 0,
};
