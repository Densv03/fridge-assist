import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, PenLine, Check, ChevronLeft, Sparkles } from 'lucide-react';
import { recognizedItems, categoryEmoji, categoryLabel } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

type Tab = 'photo' | 'voice' | 'text';

const AddItemsScreen = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('photo');
  const [showConfirm, setShowConfirm] = useState(false);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'photo', label: 'Фото', icon: <Camera className="w-4 h-4" /> },
    { id: 'voice', label: 'Голос', icon: <Mic className="w-4 h-4" /> },
    { id: 'text', label: 'Текст', icon: <PenLine className="w-4 h-4" /> },
  ];

  if (showConfirm) {
    return (
      <div className="pb-24 px-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setShowConfirm(false)} className="w-9 h-9 rounded-xl glass flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold font-display">Подтвердите продукты</h1>
        </div>

        <div className="flex items-center gap-2 mb-4 px-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-xs text-muted-foreground">Распознано {recognizedItems.length} продуктов</p>
        </div>

        <div className="space-y-3">
          {recognizedItems.map((item) => (
            <motion.div key={item.id} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-strong rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center text-lg">
                  {categoryEmoji(item.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    defaultValue={item.name}
                    className="w-full text-sm font-medium bg-transparent border-none outline-none text-foreground"
                  />
                  <div className="flex gap-2 mt-1">
                    <input
                      defaultValue={item.quantity}
                      className="w-16 text-xs bg-transparent border-none outline-none text-muted-foreground"
                    />
                    <span className="text-xs text-muted-foreground">{item.unit}</span>
                  </div>
                </div>
                <div className="glass-badge rounded-lg px-2 py-1 text-[10px] font-medium text-muted-foreground">
                  {categoryLabel(item.category)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          className="w-full h-14 mt-6 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
        >
          <Check className="w-5 h-5" />
          Сохранить
        </motion.button>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl glass flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold font-display">Добавить продукты</h1>
      </div>

      {/* Tabs */}
      <div className="glass-strong rounded-2xl p-1.5 flex gap-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${
              tab === t.id ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          {tab === 'photo' && (
            <div className="glass-strong rounded-3xl p-8 text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl glass flex items-center justify-center text-4xl mb-4">📷</div>
              <h3 className="font-semibold text-foreground mb-2">Сфотографируйте продукты</h3>
              <p className="text-xs text-muted-foreground mb-6">Сделайте фото чека, полки или отдельных продуктов</p>
              <button onClick={() => setShowConfirm(true)} className="w-full h-12 rounded-xl glass-button text-sm font-medium">📷 Открыть камеру</button>
            </div>
          )}
          {tab === 'voice' && (
            <div className="glass-strong rounded-3xl p-8 text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl glass flex items-center justify-center text-4xl mb-4">🎤</div>
              <h3 className="font-semibold text-foreground mb-2">Скажите что купили</h3>
              <p className="text-xs text-muted-foreground mb-6">"Купил яйца 10 штук, молоко 1 литр..."</p>
              <button onClick={() => setShowConfirm(true)} className="w-20 h-20 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
                <Mic className="w-8 h-8" />
              </button>
              <p className="text-xs text-muted-foreground mt-4">Нажмите и говорите</p>
            </div>
          )}
          {tab === 'text' && (
            <div className="glass-strong rounded-3xl p-6">
              <h3 className="font-semibold text-foreground mb-3">Введите продукты</h3>
              <textarea placeholder={"Молоко 1л\nЯйца 10шт\nХлеб 1шт"} rows={6} className="w-full rounded-xl glass-input p-3 text-sm placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button onClick={() => setShowConfirm(true)} className="w-full h-12 mt-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25">Распознать</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AddItemsScreen;
