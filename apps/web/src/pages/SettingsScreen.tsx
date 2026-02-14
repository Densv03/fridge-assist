import { motion } from 'framer-motion';
import { Globe, Ruler, Crown, Info, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsScreen = () => {
  const navigate = useNavigate();

  const sections = [
    {
      items: [
        { icon: <Globe className="w-4 h-4" />, label: 'Язык', value: 'Русский', action: true },
        { icon: <Ruler className="w-4 h-4" />, label: 'Единицы измерения', value: 'Метрические', action: true },
      ],
    },
    {
      items: [
        {
          icon: <Crown className="w-4 h-4 text-amber-500" />,
          label: 'Подписка',
          value: 'Free',
          action: true,
          badge: true,
          onClick: () => navigate('/subscription'),
        },
      ],
    },
    {
      items: [
        { icon: <Info className="w-4 h-4" />, label: 'О приложении', value: 'v1.0.0', action: true },
      ],
    },
  ];

  return (
    <div className="pb-24 px-4 pt-6">
      <h1 className="text-xl font-bold font-display mb-6">Настройки ⚙️</h1>

      {sections.map((section, si) => (
        <motion.div
          key={si}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: si * 0.08 }}
          className="glass-strong rounded-2xl mb-4 overflow-hidden"
        >
          {section.items.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-4 cursor-pointer active:bg-white/10 transition-colors ${
                i < section.items.length - 1 ? 'border-b border-white/10' : ''
              }`}
              onClick={item.onClick}
            >
              <div className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-muted-foreground">
                {item.icon}
              </div>
              <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.value}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/15 text-primary glass-badge">
                  Upgrade
                </span>
              )}
              {item.action && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </motion.div>
      ))}

      {/* Subscription promo */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-strong rounded-2xl p-5 text-center cursor-pointer"
        onClick={() => navigate('/subscription')}
      >
        <div className="text-3xl mb-2">👑</div>
        <h3 className="font-semibold text-foreground text-sm mb-1">FridgeChef Premium</h3>
        <p className="text-xs text-muted-foreground mb-3">Разблокируйте AI-функции, голосовой ввод и многое другое</p>
        <button className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/25">
          Узнать больше
        </button>
      </motion.div>
    </div>
  );
};

export default SettingsScreen;
