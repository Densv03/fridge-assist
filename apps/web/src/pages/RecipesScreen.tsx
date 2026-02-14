import { motion } from 'framer-motion';
import { Clock, ChefHat, Check, ShoppingCart } from 'lucide-react';
import { mockRecipes } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const RecipesScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-24 px-4 pt-6">
      <h1 className="text-xl font-bold font-display mb-1">Что приготовить? 🍳</h1>
      <p className="text-xs text-muted-foreground mb-5">Рецепты из ваших продуктов</p>

      <div className="space-y-4">
        {mockRecipes.map((recipe, i) => (
          <motion.div
            key={recipe.id}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="glass-strong rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl glass flex items-center justify-center text-3xl flex-shrink-0">
                {recipe.image}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground mb-1">{recipe.name}</h3>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.time}</span>
                  <span className="flex items-center gap-1"><ChefHat className="w-3 h-3" />{recipe.difficulty}</span>
                  <span>👤 {recipe.servings}</span>
                </div>
                {recipe.missingCount === 0 ? (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/15 text-primary glass-badge">
                    <Check className="w-3 h-3" />
                    Всё есть
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-warning/15 text-warning glass-badge">
                    Не хватает {recipe.missingCount}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/recipe/${recipe.id}`); }}
                className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-xs font-medium"
              >
                Готовить
              </button>
              {recipe.missingCount > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/shopping'); }}
                  className="h-9 px-4 rounded-xl glass-button text-xs font-medium flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3 h-3" />
                  Докупить
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecipesScreen;
