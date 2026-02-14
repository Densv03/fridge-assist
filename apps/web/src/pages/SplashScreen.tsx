import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Bubbles */}
      <div className="bubble w-32 h-32 top-16 left-8 animate-float opacity-30" />
      <div className="bubble w-20 h-20 top-40 right-12 animate-float opacity-20" style={{ animationDelay: '1s' }} />
      <div className="bubble w-24 h-24 bottom-32 left-16 animate-float opacity-25" style={{ animationDelay: '2s' }} />
      <div className="bubble w-16 h-16 bottom-48 right-8 animate-float opacity-20" style={{ animationDelay: '0.5s' }} />
      <div className="bubble w-40 h-40 top-1/3 left-1/2 -translate-x-1/2 animate-pulse-soft opacity-15" />

      <motion.div
        className="text-center z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-3xl glass-strong flex items-center justify-center text-5xl"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          🧊
        </motion.div>
        <motion.h1
          className="text-4xl font-extrabold text-gradient mb-2 font-display"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          FridgeChef
        </motion.h1>
        <motion.p
          className="text-muted-foreground text-sm"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Готовь из того, что есть
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
