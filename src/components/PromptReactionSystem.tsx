'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Theme = 'default' | 'jungle' | 'space' | 'rain' | 'snow';
type Action = {
  type: 'float' | 'applyTheme' | 'disableGravity';
  payload?: any;
};

const PromptReactionSystem = ({ children }: { children: ReactNode }) => {
  const [prompt, setPrompt] = useState('');
  const [activeTheme, setActiveTheme] = useState<Theme>('default');
  const [isFloating, setIsFloating] = useState(false);
  const [gravityDisabled, setGravityDisabled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  const interpretPrompt = (promptText: string): Action[] => {
    const lowerPrompt = promptText.toLowerCase();
    
    if (lowerPrompt.includes('float')) {
      return [{ type: 'float' }];
    }
    if (lowerPrompt.includes('jungle')) {
      return [{ type: 'applyTheme', payload: 'jungle' }];
    }
    if (lowerPrompt.includes('space')) {
      return [
        { type: 'applyTheme', payload: 'space' },
        { type: 'disableGravity' }
      ];
    }
    if (lowerPrompt.includes('rain')) {
      return [{ type: 'applyTheme', payload: 'rain' }];
    }
    if (lowerPrompt.includes('snow')) {
      return [{ type: 'applyTheme', payload: 'snow' }];
    }
    
    return [];
  };

  const applyActions = (actions: Action[]) => {
    actions.forEach(action => {
      switch (action.type) {
        case 'float':
          setIsFloating(true);
          break;
        case 'applyTheme':
          setActiveTheme(action.payload);
          break;
        case 'disableGravity':
          setGravityDisabled(true);
          break;
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actions = interpretPrompt(prompt);
    applyActions(actions);
    setShowPrompt(false);
  };

  const resetEffects = () => {
    setActiveTheme('default');
    setIsFloating(false);
    setGravityDisabled(false);
    setShowPrompt(true);
  };

  // Apply theme classes to body
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${activeTheme}`);
    
    if (isFloating) {
      document.body.classList.add('floating-mode');
    } else {
      document.body.classList.remove('floating-mode');
    }
    
    if (gravityDisabled) {
      document.body.classList.add('zero-gravity');
    } else {
      document.body.classList.remove('zero-gravity');
    }
  }, [activeTheme, isFloating, gravityDisabled]);

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-500',
      {
        'bg-jungle': activeTheme === 'jungle',
        'bg-space': activeTheme === 'space',
        'bg-rain': activeTheme === 'rain',
        'bg-snow': activeTheme === 'snow',
      }
    )}>
      {showPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background p-8 rounded-lg max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold mb-4">Enter a Prompt</h2>
            <p className="text-muted-foreground mb-6">
              Try words like: float, jungle, space, rain, or snow
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Type your prompt here..."
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      <AnimatePresence>
        {!showPrompt && (
          <motion.button
            onClick={resetEffects}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-40 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-border hover:bg-background transition-colors"
          >
            Reset Effects
          </motion.button>
        )}
      </AnimatePresence>

      {activeTheme === 'rain' && <RainEffect />}
      {activeTheme === 'snow' && <SnowEffect />}
      
      <div className={cn(
        'transition-all duration-500',
        { 'transform-gpu': isFloating }
      )}>
        {children}
      </div>
    </div>
  );
};

// Rain Effect Component
const RainEffect = () => {
  const createRainDrops = (count: number, isBackRow: boolean = false) => {
    const drops = [];
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100;
      const duration = 0.5 + Math.random() * 0.5;
      const delay = Math.random() * 2;
      
      // Add raindrop
      drops.push(
        <div
          key={`drop-${i}`}
          className="drop"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            height: `${20 + Math.random() * 30}px`,
            opacity: 0.4 + Math.random() * 0.4,
          }}
        />
      );
      
      // Add splash effect at the bottom
      if (Math.random() > 0.7) {
        drops.push(
          <div
            key={`splash-${i}`}
            className="splash"
            style={{
              left: `${left}%`,
              bottom: '10%',
              animationDelay: `${delay + duration - 0.2}s`,
            }}
          />
        );
      }
    }
    return drops;
  };

  return (
    <div className="rain-container">
      <div className="rain">
        {createRainDrops(100)}
      </div>
      <div className="rain back-row">
        {createRainDrops(50)}
      </div>
    </div>
  );
};

// Snow Effect Component
const SnowEffect = () => {
  const flakes = Array(50).fill(0);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {flakes.map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/80"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `snowFall ${5 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default PromptReactionSystem;
