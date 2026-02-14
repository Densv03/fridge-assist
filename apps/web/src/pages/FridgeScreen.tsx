import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock } from 'lucide-react';
import { mockProducts, categories, categoryEmoji } from '@/data/mockData';

const FridgeScreen = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = mockProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="pb-24 px-4 pt-6">
      <h1 className="text-xl font-bold font-display mb-4">Мой холодильник ❄️</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск продуктов..."
          className="w-full h-11 pl-10 pr-4 rounded-xl glass-input text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-4 h-9 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeCategory === cat.id ? 'bg-primary text-primary-foreground shadow-md' : 'glass-button text-foreground'
            }`}
          >
            <span>{cat.emoji}</span>{cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.03 }} className="glass rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg glass-subtle flex items-center justify-center text-lg">{categoryEmoji(item.category)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.quantity} {item.unit}</p>
            </div>
            {item.expiresIn && item.expiresIn <= 3 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-destructive/15 text-destructive glass-badge">
                <Clock className="w-3 h-3" />{item.expiresIn} дн.
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">Ничего не найдено</div>
      )}
    </div>
  );
};

export default FridgeScreen;
