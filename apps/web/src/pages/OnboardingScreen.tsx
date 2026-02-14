import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const slides = [
  { emoji: '📷', title: 'Добавь продукты', desc: 'Сфотографируй чек, скажи голосом или введи вручную — мы всё запомним.' },
  { emoji: '🍳', title: 'Найди рецепт', desc: 'Мы подберём блюда из того, что уже есть в холодильнике.' },
  { emoji: '✅', title: 'Готовь и списывай', desc: 'Скажи что съел — продукты спишутся автоматически.' },
];

const OnboardingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else onFinish();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="bubble w-28 h-28 top-10 right-4 animate-float opacity-20" />
      <div className="bubble w-20 h-20 bottom-28 left-6 animate-float opacity-15" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-sm flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="glass-strong rounded-3xl p-8 text-center"
          >
            <div className="text-6xl mb-6">{slides[current].emoji}</div>
            <h2 className="text-xl font-bold text-foreground mb-3 font-display">{slides[current].title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{slides[current].desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-primary' : 'w-2 bg-foreground/15'
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={next}
          className="mt-8 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
        >
          {current < slides.length - 1 ? (
            <>Далее <ChevronRight className="w-5 h-5" /></>
          ) : (
            'Начать'
          )}
        </motion.button>

        {current < slides.length - 1 && (
          <button onClick={onFinish} className="mt-3 text-sm text-muted-foreground mx-auto block">
            Пропустить
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
