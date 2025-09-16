'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { motion } from 'framer-motion';
import PromptReactionSystem from '@/components/PromptReactionSystem';
import { Zap, Lightbulb, Wand2, Loader2, SendHorizontal, Info } from 'lucide-react';

const promptSuggestions = [
  { text: 'float', emoji: '✨', description: 'Make elements float gently' },
  { text: 'jungle', emoji: '🌴', description: 'Transform into a jungle theme' },
  { text: 'space', emoji: '🚀', description: 'Explore the cosmos' },
  { text: 'rain', emoji: '🌧️', description: 'Experience a rainy day' },
  { text: 'snow', emoji: '❄️', description: 'Winter wonderland effect' },
  { text: 'ocean', emoji: '🌊', description: 'Dive into the deep blue' },
  { text: 'sunset', emoji: '🌅', description: 'Warm sunset colors' },
  { text: 'neon', emoji: '💡', description: 'Neon glow effects' },
];

export default function PromptLab() {
  const [showPrompt, setShowPrompt] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setIsLoading(true);
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowPrompt(false);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setPrompt(suggestion);
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setShowPrompt(false);
    setIsLoading(false);
  };

  return (
    <PromptReactionSystem>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 -z-10" />
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Prompt Reaction Lab
                  </CardTitle>
                  <CardDescription className="mt-1 text-muted-foreground">
                    Transform the website with AI-powered effects
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                      Try these prompts:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {promptSuggestions.map((suggestion) => (
                        <motion.div
                          key={suggestion.text}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full"
                        >
                          <Button
                            variant="outline"
                            className="w-full h-auto py-3 justify-start text-left group"
                            onClick={() => handleSuggestionClick(suggestion.text)}
                          >
                            <span className="text-xl mr-3 group-hover:scale-110 transition-transform">
                              {suggestion.emoji}
                            </span>
                            <div className="text-left">
                              <div className="font-medium">{suggestion.text}</div>
                              <div className="text-xs text-muted-foreground">
                                {suggestion.description}
                              </div>
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Wand2 className="mr-2 h-5 w-5 text-purple-500" />
                      Or create your own:
                    </h3>
                    <form onSubmit={handlePromptSubmit} className="space-y-4">
                      <div className="relative">
                        <Input
                          type="text"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Type your prompt here..."
                          className="h-12 text-base pl-4 pr-12 border-border/70 hover:border-primary/50 transition-colors"
                        />
                        <Button
                          type="submit"
                          size="icon"
                          className="absolute right-1 top-1 h-10 w-10"
                          disabled={!prompt.trim() || isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <SendHorizontal className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Info className="h-3.5 w-3.5 mr-1.5" />
                        Try combining effects like "jungle with floating elements"
                      </div>
                    </form>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p>
                      The website will transform based on your prompt. Try different combinations to discover all the effects!
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <Card className="bg-card/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Floating Elements</h4>
                      <p className="text-sm text-muted-foreground">Try: "float" to make elements float around</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Themes</h4>
                      <p className="text-sm text-muted-foreground">Try: "jungle", "space", "rain", or "snow"</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Zero Gravity</h4>
                      <p className="text-sm text-muted-foreground">Try: "space" to enable zero gravity effect</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PromptReactionSystem>
  );
}
