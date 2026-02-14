import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import SplashScreen from "./pages/SplashScreen";
import AuthScreen from "./pages/AuthScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import HomeScreen from "./pages/HomeScreen";
import AddItemsScreen from "./pages/AddItemsScreen";
import FridgeScreen from "./pages/FridgeScreen";
import RecipesScreen from "./pages/RecipesScreen";
import RecipeDetailScreen from "./pages/RecipeDetailScreen";
import ConsumptionScreen from "./pages/ConsumptionScreen";
import ShoppingListScreen from "./pages/ShoppingListScreen";
import SettingsScreen from "./pages/SettingsScreen";
import SubscriptionScreen from "./pages/SubscriptionScreen";
import BottomNav from "./components/BottomNav";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type AppPhase = 'splash' | 'auth' | 'onboarding' | 'app';

const AppContent = () => {
  const [phase, setPhase] = useState<AppPhase>('splash');

  if (phase === 'splash') {
    return (
      <AnimatePresence>
        <SplashScreen onFinish={() => setPhase('auth')} />
      </AnimatePresence>
    );
  }

  if (phase === 'auth') {
    return <AuthScreen onLogin={() => setPhase('onboarding')} />;
  }

  if (phase === 'onboarding') {
    return <OnboardingScreen onFinish={() => setPhase('app')} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen relative">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/add" element={<AddItemsScreen />} />
        <Route path="/fridge" element={<FridgeScreen />} />
        <Route path="/recipes" element={<RecipesScreen />} />
        <Route path="/recipe/:id" element={<RecipeDetailScreen />} />
        <Route path="/consume" element={<ConsumptionScreen />} />
        <Route path="/shopping" element={<ShoppingListScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/subscription" element={<SubscriptionScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
