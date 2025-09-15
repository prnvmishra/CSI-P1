'use client';

import { useState, useEffect } from 'react';
import { THEME_PRESETS } from '@/lib/constants';
import { useStyleStore } from '@/store/style-store';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getSuggestedPrompts } from '@/app/actions';
import { Sparkles, Loader2 } from 'lucide-react';
import { recordThemeSelection } from '@/lib/theme-history';
import { useAuth } from '@/hooks/use-auth';

export function ThemePresets() {
  const { applyNewCommands, checkAndApplyAchievements } = useStyleStore();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (selectedTheme) {
      setLoadingSuggestions(true);
      getSuggestedPrompts(selectedTheme).then(prompts => {
        setSuggestions(prompts);
        setLoadingSuggestions(false);
      });
    } else {
      setSuggestions([]);
    }
  }, [selectedTheme]);
  
  const handlePresetClick = (preset) => {
    console.log('🎯 Theme preset clicked:', preset.name, 'with commands:', preset.commands);
    applyNewCommands(preset.commands, `preset: ${preset.name}`);
    const appliedThemes = new Set(useStyleStore.getState().history.flatMap(h => h.filter(cmd => cmd.startsWith('apply-theme:')).map(cmd => cmd.split(':')[1])));
    checkAndApplyAchievements(useStyleStore.getState().uniquePrompts.size, appliedThemes);
    setSelectedTheme(preset.name);
    
    // Record theme selection in Firebase if user is logged in
    if (user) {
      recordThemeSelection(preset.id).catch(error => {
        console.error('Error recording theme selection:', error);
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Theme Presets</CardTitle>
          <CardDescription>Click a preset to instantly transform the website.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {THEME_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant={selectedTheme === preset.name ? "default" : "secondary"}
              className="h-20 flex flex-col gap-2"
              onClick={() => handlePresetClick(preset)}
            >
              <preset.icon className="h-6 w-6" />
              <span className="font-semibold">{preset.name}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
      {selectedTheme && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> Prompt Suggestions</CardTitle>
            <CardDescription>Try these prompts to enhance the '{selectedTheme}' theme:</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSuggestions ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
              </div>
            ) : (
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              {suggestions.map((s, i) => (
                <li key={i}>"{s}"</li>
              ))}
            </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
