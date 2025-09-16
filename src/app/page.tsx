'use client';
import { useEffect } from 'react';
import { Bot, Settings, Sparkles, User } from 'lucide-react';

import { useStyleStore } from '@/store/style-store';
import { applyCommands, runEffect } from '@/lib/effects';
import { MainContent } from '@/components/main-content';
import { ThemeToggle } from '@/components/theme-toggle';
import { ControlPanel } from '@/components/control-panel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';


export default function Home() {
  const { history, historyIndex, addAchievement, setBodyClasses } = useStyleStore();
  const { user } = useAuth();
  const currentCommands = history[historyIndex] || [];

  useEffect(() => {
    console.log('🎨 Page useEffect triggered with commands:', currentCommands);
    const { classes, effects } = applyCommands(currentCommands);
    console.log('📋 Generated classes:', classes);
    console.log('⚡ Generated effects:', effects);
    setBodyClasses(classes.join(' '));
    
    // Run new JS-based effects
    effects.forEach(effect => {
      console.log('🚀 Running effect:', effect.name, 'with options:', effect.options);
      runEffect(effect.name, effect.options);
      if (effect.name === 'zero-gravity') {
        addAchievement('Gravity Tamer');
      }
    });

    return () => {
      // Cleanup effects on unmount
      console.log('🧹 Cleaning up effects on unmount');
      effects.forEach(effect => {
        runEffect(effect.name, { ...effect.options, cleanup: true });
      });
    };
  }, [history, historyIndex, addAchievement, setBodyClasses]);
  
  useEffect(() => {
    const body = document.body;
    const currentClasses = useStyleStore.getState().bodyClasses;
    
    // First, remove any theme classes that are not in the current state
    body.classList.forEach(c => {
      if (c.startsWith('theme-') && !currentClasses.includes(c)) {
        body.classList.remove(c);
      }
    });

    // Then, add the classes from the current state
    if (currentClasses) {
      currentClasses.split(' ').forEach(c => {
        if (c && !body.classList.contains(c)) {
          body.classList.add(c);
        }
      });
    }
  }, [useStyleStore.getState().bodyClasses]);


  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold font-headline">Promptalizer</h1>
          </div>
          <div className="flex items-center gap-2">
            <ControlPanel />
            <ThemeToggle />
            <Link href={user ? "/profile" : "/login"}>
              <Button variant="outline" size="icon">
                <User />
                <span className="sr-only">{user ? "Profile" : "Login"}</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <MainContent />
      </main>

    </div>
  );
}
