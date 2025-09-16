'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getMoodBasedPrompts } from '@/lib/gemini';
import { useStyleStore } from '@/store/style-store';
import { Sparkles, Loader2, Send } from 'lucide-react';

export function AIAssistant() {
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { applyNewCommands } = useStyleStore();
  
  // Get the current theme from body classes
  const getCurrentTheme = () => {
    const bodyClasses = document.body.className;
    const themeMatch = bodyClasses.match(/theme-(\w+)/);
    return themeMatch ? themeMatch[1] : 'default';
  };
  
  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;
    
    setLoading(true);
    setSuggestions([]);
    
    try {
      const currentTheme = getCurrentTheme();
      const prompts = await getMoodBasedPrompts(mood, currentTheme);
      setSuggestions(prompts);
    } catch (error) {
      console.error('Error getting mood-based prompts:', error);
      // Provide fallback suggestions based on mood
      const fallbackSuggestions: Record<string, string[]> = {
        'energetic': ['Add bouncing animations', 'Increase brightness', 'Add sparkle effects', 'Make elements glow', 'Add fast transitions'],
        'calm': ['Add gentle floating', 'Use soft colors', 'Add breathing animation', 'Make elements sway', 'Add peaceful particles'],
        'creative': ['Add random movements', 'Use vibrant colors', 'Add artistic effects', 'Make elements dance', 'Add creative shapes'],
        'focused': ['Add subtle highlights', 'Use clean lines', 'Add concentration effects', 'Make elements stable', 'Add focus indicators'],
        'playful': ['Add fun animations', 'Use bright colors', 'Add bouncing effects', 'Make elements wiggle', 'Add playful sounds'],
        'mysterious': ['Add fog effects', 'Use dark colors', 'Add shadow effects', 'Make elements fade', 'Add mysterious glow'],
        'romantic': ['Add heart particles', 'Use warm colors', 'Add gentle effects', 'Make elements float', 'Add romantic glow'],
        'adventurous': ['Add dynamic effects', 'Use bold colors', 'Add movement effects', 'Make elements explore', 'Add adventure vibes']
      };
      
      const moodKey = mood.toLowerCase();
      const moodSuggestions = fallbackSuggestions[moodKey] || fallbackSuggestions['creative'];
      setSuggestions(moodSuggestions);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    // Apply the suggestion as a command
    applyNewCommands([suggestion], suggestion);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> AI Assistant
        </CardTitle>
        <CardDescription>
          Tell me your mood, and I'll suggest prompts to enhance your experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleMoodSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mood">How are you feeling today?</Label>
            <div className="flex gap-2">
              <Input
                id="mood"
                placeholder="e.g., energetic, calm, creative, focused..."
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !mood.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </form>
        
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {!loading && suggestions.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium">Based on your mood, try these prompts:</h3>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((suggestion, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="justify-start text-left h-auto py-3 hover:bg-primary/10"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}