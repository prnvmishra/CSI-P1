'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Zap, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserProgress, addXP as addXPToFirebase } from '@/lib/user-progress';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  unlockedThemes: string[];
}

const THEME_UNLOCKS = [
  { level: 3, theme: 'cyberpunk' },
  { level: 5, theme: 'matrix' },
  { level: 8, theme: 'retro' },
  { level: 12, theme: 'dystopian' },
  { level: 15, theme: 'zero-gravity' },
];

export function ProgressSystem() {
  const [progress, setProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    unlockedThemes: ['default']
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [unlockedTheme, setUnlockedTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user progress on mount and auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserProgress();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserProgress = async () => {
    try {
      setLoading(true);
      const userProgress = await getUserProgress();
      if (userProgress) {
        setProgress({
          level: userProgress.level,
          xp: userProgress.xp,
          xpToNextLevel: userProgress.xpToNextLevel,
          unlockedThemes: userProgress.unlockedThemes || ['default']
        });
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add XP and handle level ups
  const addXP = async (amount: number) => {
    if (!auth.currentUser) return;
    
    try {
      const result = await addXPToFirebase(amount);
      if (result) {
        const { levelUp, unlockedThemes } = result;
        
        if (levelUp) {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3000);
          
          if (unlockedThemes && unlockedThemes.length > 0) {
            setUnlockedTheme(unlockedThemes[0]);
            setTimeout(() => setUnlockedTheme(null), 5000);
          }
        }
        
        // Refresh progress
        await loadUserProgress();
      }
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  };

  // Demo function to add XP (for testing)
  const handleAddDemoXP = () => {
    addXP(25);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Level {progress.level}</CardTitle>
            <Badge className="px-2 py-1 text-xs" variant="outline">
              {progress.xp} / {progress.xpToNextLevel} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={(progress.xp / progress.xpToNextLevel) * 100} className="h-2" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Level {progress.level}</span>
            <span>Level {progress.level + 1}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Unlocked Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {THEME_UNLOCKS.map(({ level, theme }) => (
              <div 
                key={theme}
                className={`p-3 rounded-lg border ${
                  progress.unlockedThemes.includes(theme)
                    ? 'bg-primary/10 border-primary/20'
                    : 'bg-muted/50 border-muted'
                }`}
              >
                <div className="flex items-center gap-2">
                  {progress.unlockedThemes.includes(theme) ? (
                    <Unlock className="h-4 w-4 text-primary" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium capitalize">{theme}</p>
                    <p className="text-xs text-muted-foreground">
                      {progress.unlockedThemes.includes(theme)
                        ? 'Unlocked!'
                        : `Unlocks at level ${level}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <span>Level Up! You are now level {progress.level}</span>
            </div>
          </motion.div>
        )}

        {unlockedTheme && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span>New theme unlocked: {unlockedTheme}!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo button - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4">
          <Button onClick={handleAddDemoXP} variant="outline" size="sm">
            Add 25 XP (Demo)
          </Button>
        </div>
      )}
    </div>
  );
}
