'use client';

import * as React from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { recordThemeSelection } from '@/lib/theme-history';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export function ThemeToggle() {
  const { theme: currentTheme, setTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleThemeChange = async (theme: string) => {
    try {
      setTheme(theme);
      
      if (user) {
        // Map the theme to a valid theme ID from constants
        let themeToRecord = theme;
        if (['light', 'dark', 'system'].includes(theme)) {
          // For light/dark/system, use a default theme ID
          themeToRecord = 'underwater'; // or any other default theme ID
        }
        
        await recordThemeSelection(themeToRecord);
        toast({
          title: 'Theme updated',
          description: `Switched to ${theme} theme`,
        });
      }
    } catch (error) {
      console.error('Error changing theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to update theme',
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleThemeChange('light')}
          className={currentTheme === 'light' ? 'bg-accent' : ''}
        >
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('dark')}
          className={currentTheme === 'dark' ? 'bg-accent' : ''}
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('system')}
          className={currentTheme === 'system' ? 'bg-accent' : ''}
        >
          <Palette className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
