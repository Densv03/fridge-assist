import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Snowflake, CookingPot, ShoppingCart, Settings } from 'lucide-react';

const tabs = [
  { path: '/', icon: Home, label: 'Главная' },
  { path: '/fridge', icon: Snowflake, label: 'Холодильник' },
  { path: '/recipes', icon: CookingPot, label: 'Рецепты' },
  { path: '/shopping', icon: ShoppingCart, label: 'Покупки' },
  { path: '/settings', icon: Settings, label: 'Настройки' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-md mx-auto px-3 pb-2">
        <div className="glass-strong rounded-2xl px-2 py-2 flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
