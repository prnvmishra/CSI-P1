'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { convertPromptToEffects } from '@/lib/gemini';
import { useStyleStore } from '@/store/style-store';
import { Wand2, Loader2, Send } from 'lucide-react';

export function PromptMaterializer() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [materializedEffects, setMaterializedEffects] = useState<string[]>([]);
  const { applyNewCommands } = useStyleStore();
  
  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setMaterializedEffects([]);
    
    try {
      const effects = await convertPromptToEffects(prompt);
      setMaterializedEffects(effects);
      
      // Automatically apply the effects
      if (effects.length > 0) {
        applyNewCommands(effects, prompt);
      }
    } catch (error) {
      console.error('Error converting prompt to effects:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" /> Prompt Materializer
        </CardTitle>
        <CardDescription>
          Describe what you want to see, and I'll convert it into visual effects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePromptSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Enter your creative prompt</Label>
            <div className="flex gap-2">
              <Input
                id="prompt"
                placeholder="e.g., make the page feel underwater, add floating particles..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !prompt.trim()}>
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
        
        {!loading && materializedEffects.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium">Your prompt has been materialized into:</h3>
            <div className="flex flex-wrap gap-2">
              {materializedEffects.map((effect, index) => (
                <div 
                  key={index} 
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                >
                  {effect}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}