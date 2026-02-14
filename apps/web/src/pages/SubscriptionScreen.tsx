import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, Bot, Mic, BarChart3, Bell, ShoppingCart, Users, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const benefits = [
  { icon: <Bot className="w-5 h-5" />, title: 'AI-распознавание по фото', desc: 'Без ограничений' },
  { icon: <Mic className="w-5 h-5" />, title: 'Голосовой ввод и списание', desc: 'Говорите — мы запишем' },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'Умные рекомендации', desc: 'Рецепты под ваши вкусы' },
  { icon: <Bell className="w-5 h-5" />, title: 'Уведомления о сроках', desc: 'Не дайте продуктам пропасть' },
  { icon: <ShoppingCart className="w-5 h-5" />, title: 'Автосписки покупок', desc: 'Умное планирование' },
  { icon: <Users className="w-5 h-5" />, title: 'Семейный доступ', desc: 'Общий холодильник' },
  { icon: <Ban className="w-5 h-5" />, title: 'Без рекламы', desc: 'Чистый опыт' },
];

const plans = [
  { id: 'month', label: 'Месяц', price: '299 ₽', period: '/мес', popular: false },
  { id: 'year', label: 'Год', price: '1 990 ₽', period: '/год', popular: true, discount: '-45%' },
  { id: 'lifetime', label: 'Навсегда', price: '4 990 ₽', period: '', popular: false },
];

const SubscriptionScreen = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('year');

  return (
    <div className="min-h-screen pb-12 px-4 pt-6 relative overflow-hidden">
      <div className="bubble w-40 h-40 -top-16 -right-16 animate-float opacity-15" />
      <div className="bubble w-24 h-24 bottom-24 -left-10 animate-float opacity-10" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl glass flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-6">
        <div className="text-4xl mb-3">👑</div>
        <h1 className="text-2xl font-extrabold text-gradient font-display mb-1">FridgeChef Premium</h1>
        <p className="text-sm text-muted-foreground">Готовьте умнее каждый день</p>
      </motion.div>

      {/* Benefits */}
      <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-strong rounded-2xl p-4 mb-6">
        <div className="space-y-3">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl glass-subtle flex items-center justify-center text-primary">
                {b.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{b.title}</p>
                <p className="text-[11px] text-muted-foreground">{b.desc}</p>
              </div>
              <Check className="w-4 h-4 text-primary" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Plans */}
      <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-3 mb-6">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${
              selected === plan.id
                ? 'glass-strong ring-2 ring-primary/40'
                : 'glass'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selected === plan.id ? 'border-primary bg-primary' : 'border-foreground/20'
            }`}>
              {selected === plan.id && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{plan.label}</span>
                {plan.popular && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary text-primary-foreground">
                    ПОПУЛЯРНЫЙ
                  </span>
                )}
                {plan.discount && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-warning/20 text-warning">
                    {plan.discount}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-foreground">{plan.price}</span>
              <span className="text-[10px] text-muted-foreground">{plan.period}</span>
            </div>
          </button>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.97 }}
        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/30"
      >
        Попробовать бесплатно 7 дней
      </motion.button>

      <p className="text-[10px] text-muted-foreground text-center mt-3 leading-relaxed">
        Подписка продлевается автоматически. Отмена в любой момент.<br />
        Оплата будет списана после окончания пробного периода.
      </p>
    </div>
  );
};

export default SubscriptionScreen;
