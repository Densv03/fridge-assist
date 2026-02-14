import { motion } from 'framer-motion';
import { ChefHat, Plus, AlertTriangle, Clock } from 'lucide-react';
import { mockProducts, categoryEmoji } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();
  const expiringSoon = mockProducts.filter(p => p.expiresIn && p.expiresIn <= 3);
  const recentItems = mockProducts.slice(0, 4);

  return (
    <div className="pb-24 px-4 pt-6">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
        <p className="text-sm text-muted-foreground">Привет 👋</p>
        <h1 className="text-2xl font-bold text-foreground font-display">Что готовим сегодня?</h1>
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3 mb-8">
        <button onClick={() => navigate('/recipes')} className="w-full h-16 rounded-2xl glass-strong flex items-center justify-center gap-3 text-base font-semibold text-foreground active:scale-[0.98] transition-transform">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center"><ChefHat className="w-5 h-5 text-primary" /></div>
          Что приготовить?
        </button>
        <button onClick={() => navigate('/add')} className="w-full h-14 rounded-2xl glass flex items-center justify-center gap-3 text-sm font-medium text-foreground active:scale-[0.98] transition-transform">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Plus className="w-4 h-4 text-primary" /></div>
          Добавить продукты
        </button>
      </motion.div>

      {expiringSoon.length > 0 && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h2 className="text-sm font-semibold text-foreground">Скоро испортится</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {expiringSoon.map((item) => (
              <div key={item.id} className="glass-strong rounded-2xl p-4 min-w-[140px] flex-shrink-0">
                <div className="text-2xl mb-2">{categoryEmoji(item.category)}</div>
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.quantity} {item.unit}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-destructive/15 text-destructive">
                  <Clock className="w-3 h-3" />{item.expiresIn} дн.
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 className="text-sm font-semibold text-foreground mb-3">Последние добавления</h2>
        <div className="space-y-2">
          {recentItems.map((item) => (
            <div key={item.id} className="glass rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg glass-subtle flex items-center justify-center text-lg">{categoryEmoji(item.category)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.quantity} {item.unit}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">{item.addedAt}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomeScreen;
