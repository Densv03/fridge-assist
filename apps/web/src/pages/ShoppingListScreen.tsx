import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowDownToLine } from 'lucide-react';
import { mockShoppingList, type ShoppingItem } from '@/data/mockData';

const ShoppingListScreen = () => {
  const [items, setItems] = useState<ShoppingItem[]>(mockShoppingList);
  const [newItem, setNewItem] = useState('');

  const toggle = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, { id: Date.now().toString(), name: newItem.trim(), amount: '', checked: false }]);
    setNewItem('');
  };

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="pb-24 px-4 pt-6">
      <h1 className="text-xl font-bold font-display mb-1">Список покупок 🛒</h1>
      <p className="text-xs text-muted-foreground mb-5">{checkedCount} из {items.length} куплено</p>

      {/* Add input */}
      <div className="flex gap-2 mb-5">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          placeholder="Добавить продукт..."
          className="flex-1 h-11 px-4 rounded-xl glass-input text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={addItem}
          className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`glass rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-opacity ${item.checked ? 'opacity-50' : ''}`}
            onClick={() => toggle(item.id)}
          >
            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors ${
              item.checked ? 'bg-primary border-primary' : 'border-foreground/20'
            }`}>
              {item.checked && <span className="text-primary-foreground text-xs">✓</span>}
            </div>
            <span className={`flex-1 text-sm ${item.checked ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}`}>
              {item.name}
            </span>
            {item.amount && <span className="text-xs text-muted-foreground">{item.amount}</span>}
          </motion.div>
        ))}
      </div>

      {/* Transfer Button */}
      {checkedCount > 0 && (
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileTap={{ scale: 0.97 }}
          className="w-full h-14 mt-6 rounded-2xl glass-strong text-sm font-semibold flex items-center justify-center gap-2 text-foreground"
        >
          <ArrowDownToLine className="w-4 h-4" />
          Перенести купленное в холодильник ({checkedCount})
        </motion.button>
      )}
    </div>
  );
};

export default ShoppingListScreen;
