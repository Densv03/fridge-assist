import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConsumptionScreen = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl glass flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold font-display">Списать продукты</h1>
      </div>

      {/* Input */}
      <div className="glass-strong rounded-2xl p-4 mb-4">
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Что вы съели?</label>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="На завтрак съел хлеб и хамон..."
            className="flex-1 h-11 px-4 rounded-xl glass-input text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={() => setSubmitted(true)}
            className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {submitted && (
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-3">
          {/* System message */}
          <div className="glass rounded-2xl p-4 ml-8">
            <p className="text-sm text-foreground mb-1">Понял! Списываю:</p>
            <div className="space-y-1 text-sm text-foreground">
              <p>• Хлеб — 2 ломтика</p>
              <p>• Хамон — ~50 г</p>
            </div>
          </div>

          {/* Clarification question */}
          <div className="glass-strong rounded-2xl p-4 ml-4">
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">Уточните количество хамона:</p>
            </div>
            <div className="flex gap-2 flex-wrap mt-3">
              {['~30 г', '~50 г', '~100 г', 'Весь пакет'].map((opt) => (
                <button key={opt} className="px-4 h-9 rounded-xl glass-button text-xs font-medium">
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Uncertainty badge */}
          <div className="glass rounded-xl p-3 flex items-center gap-2 mx-4">
            <div className="w-8 h-1.5 rounded-full bg-warning/30 overflow-hidden">
              <div className="w-3/4 h-full bg-warning rounded-full" />
            </div>
            <span className="text-[10px] text-muted-foreground">Уверенность: 75%</span>
          </div>
        </motion.div>
      )}

      {!submitted && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🍽️</div>
          <p className="text-sm text-muted-foreground">Напишите что вы съели, и мы спишем продукты</p>
        </div>
      )}
    </div>
  );
};

export default ConsumptionScreen;
