export interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'meat' | 'dairy' | 'vegetables' | 'fruits' | 'other';
  expiresIn?: number;
  addedAt: string;
}

export interface Recipe {
  id: string;
  name: string;
  time: string;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
  image: string;
  missingCount: number;
  ingredients: { name: string; amount: string; available: boolean }[];
  steps: string[];
  servings: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  checked: boolean;
}

export interface RecognizedItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'meat' | 'dairy' | 'vegetables' | 'fruits' | 'other';
}

export const categories = [
  { id: 'all', label: 'Все', emoji: '📦' },
  { id: 'meat', label: 'Мясо', emoji: '🥩' },
  { id: 'dairy', label: 'Молочка', emoji: '🥛' },
  { id: 'vegetables', label: 'Овощи', emoji: '🥦' },
  { id: 'fruits', label: 'Фрукты', emoji: '🍎' },
  { id: 'other', label: 'Другое', emoji: '🧂' },
];

export const categoryEmoji = (cat: string) =>
  cat === 'meat' ? '🥩' : cat === 'dairy' ? '🥛' : cat === 'vegetables' ? '🥦' : cat === 'fruits' ? '🍎' : '🧂';

export const categoryLabel = (cat: string) =>
  cat === 'meat' ? '🥩 Мясо' : cat === 'dairy' ? '🥛 Молочка' : cat === 'vegetables' ? '🥦 Овощи' : cat === 'fruits' ? '🍎 Фрукты' : '📦 Другое';

export const mockProducts: Product[] = [
  { id: '1', name: 'Куриная грудка', quantity: 500, unit: 'г', category: 'meat', expiresIn: 2, addedAt: '2 дня назад' },
  { id: '2', name: 'Молоко', quantity: 1, unit: 'л', category: 'dairy', expiresIn: 3, addedAt: '1 день назад' },
  { id: '3', name: 'Яйца', quantity: 10, unit: 'шт', category: 'dairy', expiresIn: 12, addedAt: '3 дня назад' },
  { id: '4', name: 'Помидоры', quantity: 4, unit: 'шт', category: 'vegetables', expiresIn: 4, addedAt: 'Сегодня' },
  { id: '5', name: 'Сыр Моцарелла', quantity: 200, unit: 'г', category: 'dairy', expiresIn: 5, addedAt: '1 день назад' },
  { id: '6', name: 'Огурцы', quantity: 3, unit: 'шт', category: 'vegetables', expiresIn: 5, addedAt: '2 дня назад' },
  { id: '7', name: 'Бананы', quantity: 5, unit: 'шт', category: 'fruits', expiresIn: 3, addedAt: 'Сегодня' },
  { id: '8', name: 'Рис', quantity: 800, unit: 'г', category: 'other', addedAt: '5 дней назад' },
  { id: '9', name: 'Свинина', quantity: 400, unit: 'г', category: 'meat', expiresIn: 1, addedAt: '3 дня назад' },
  { id: '10', name: 'Яблоки', quantity: 6, unit: 'шт', category: 'fruits', expiresIn: 7, addedAt: '2 дня назад' },
  { id: '11', name: 'Масло сливочное', quantity: 180, unit: 'г', category: 'dairy', expiresIn: 14, addedAt: '4 дня назад' },
  { id: '12', name: 'Лук репчатый', quantity: 5, unit: 'шт', category: 'vegetables', addedAt: '6 дней назад' },
];

export const mockRecipes: Recipe[] = [
  {
    id: '1', name: 'Куриный салат Цезарь', time: '25 мин', difficulty: 'Легко', image: '🥗', missingCount: 0, servings: 2,
    ingredients: [
      { name: 'Куриная грудка', amount: '300 г', available: true },
      { name: 'Помидоры', amount: '2 шт', available: true },
      { name: 'Сыр Моцарелла', amount: '100 г', available: true },
      { name: 'Яйца', amount: '2 шт', available: true },
    ],
    steps: ['Отварите куриную грудку в подсоленной воде 15 минут.', 'Нарежьте помидоры дольками.', 'Порежьте моцареллу кубиками.', 'Отварите яйца вкрутую, порежьте.', 'Соберите салат, заправьте маслом и специями.'],
  },
  {
    id: '2', name: 'Омлет с овощами', time: '15 мин', difficulty: 'Легко', image: '🍳', missingCount: 0, servings: 1,
    ingredients: [
      { name: 'Яйца', amount: '3 шт', available: true },
      { name: 'Молоко', amount: '50 мл', available: true },
      { name: 'Помидоры', amount: '1 шт', available: true },
      { name: 'Сыр Моцарелла', amount: '50 г', available: true },
    ],
    steps: ['Взбейте яйца с молоком.', 'Нарежьте помидоры мелкими кубиками.', 'Разогрейте сковороду с маслом.', 'Вылейте яичную смесь, добавьте помидоры.', 'Посыпьте тёртым сыром, накройте крышкой на 3 минуты.'],
  },
  {
    id: '3', name: 'Рис с курицей по-азиатски', time: '40 мин', difficulty: 'Средне', image: '🍛', missingCount: 2, servings: 3,
    ingredients: [
      { name: 'Куриная грудка', amount: '400 г', available: true },
      { name: 'Рис', amount: '300 г', available: true },
      { name: 'Лук репчатый', amount: '1 шт', available: true },
      { name: 'Соевый соус', amount: '3 ст.л.', available: false },
      { name: 'Имбирь', amount: '10 г', available: false },
    ],
    steps: ['Отварите рис до готовности.', 'Нарежьте курицу полосками, обжарьте.', 'Добавьте нарезанный лук, обжарьте 3 минуты.', 'Добавьте соевый соус и имбирь.', 'Смешайте с рисом и подавайте горячим.'],
  },
  {
    id: '4', name: 'Банановые панкейки', time: '20 мин', difficulty: 'Легко', image: '🥞', missingCount: 1, servings: 2,
    ingredients: [
      { name: 'Бананы', amount: '2 шт', available: true },
      { name: 'Яйца', amount: '2 шт', available: true },
      { name: 'Молоко', amount: '100 мл', available: true },
      { name: 'Мука', amount: '150 г', available: false },
    ],
    steps: ['Разомните бананы вилкой.', 'Добавьте яйца и молоко, перемешайте.', 'Добавьте муку, замесите тесто.', 'Жарьте на среднем огне по 2 минуты с каждой стороны.'],
  },
];

export const mockShoppingList: ShoppingItem[] = [
  { id: '1', name: 'Соевый соус', amount: '1 бутылка', checked: false },
  { id: '2', name: 'Имбирь', amount: '50 г', checked: false },
  { id: '3', name: 'Мука', amount: '1 кг', checked: true },
  { id: '4', name: 'Хлеб', amount: '1 буханка', checked: false },
  { id: '5', name: 'Сметана', amount: '200 г', checked: false },
];

export const recognizedItems: RecognizedItem[] = [
  { id: '1', name: 'Молоко', quantity: 1, unit: 'л', category: 'dairy' },
  { id: '2', name: 'Хлеб белый', quantity: 1, unit: 'шт', category: 'other' },
  { id: '3', name: 'Помидоры', quantity: 500, unit: 'г', category: 'vegetables' },
  { id: '4', name: 'Сыр Гауда', quantity: 200, unit: 'г', category: 'dairy' },
  { id: '5', name: 'Яблоки', quantity: 4, unit: 'шт', category: 'fruits' },
];
