import { motion } from 'framer-motion';
import { ChevronLeft, Clock, Users, Check, X, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockRecipes } from '@/data/mockData';

const RecipeDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = mockRecipes.find(r => r.id === id);

  if (!recipe) return <div className="p-6 text-center text-muted-foreground">Рецепт не найден</div>;

  return (
    <div className="pb-24 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl glass flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold font-display truncate">{recipe.name}</h1>
      </div>

      {/* Hero */}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-strong rounded-3xl p-6 text-center mb-5">
        <div className="text-5xl mb-4">{recipe.image}</div>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{recipe.time}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{recipe.servings} порц.</span>
          <span className="glass-badge px-2 py-0.5 rounded-full text-[10px] font-medium">{recipe.difficulty}</span>
        </div>
      </motion.div>

      {/* Ingredients */}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <h2 className="text-sm font-semibold text-foreground mb-3">Ингредиенты</h2>
        <div className="glass rounded-2xl p-3 space-y-2 mb-5">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              {ing.available ? (
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-destructive flex-shrink-0" />
              )}
              <span className={`text-sm flex-1 ${!ing.available ? 'text-muted-foreground' : 'text-foreground'}`}>{ing.name}</span>
              <span className="text-xs text-muted-foreground">{ing.amount}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Steps */}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-sm font-semibold text-foreground mb-3">Приготовление</h2>
        <div className="space-y-3 mb-6">
          {recipe.steps.map((step, i) => (
            <div key={i} className="glass rounded-xl p-3 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <div className="space-y-3">
        <button className="w-full h-13 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
          <CheckCircle2 className="w-4 h-4" />
          Списать использованное
        </button>
        {recipe.missingCount > 0 && (
          <button
            onClick={() => navigate('/shopping')}
            className="w-full h-12 rounded-2xl glass-button text-sm font-medium flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Добавить недостающее в покупки
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailScreen;
