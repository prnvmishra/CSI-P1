'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Code, BarChart, Palette, Zap, ExternalLink } from 'lucide-react';
import { ThemeType } from '@/lib/themeManager';
import { getPortfolioByTheme, PortfolioData } from '@/lib/portfolioData';
import { PortfolioCard } from './PortfolioCard';

interface PortfolioAnalyzerFormProps {
  portfolioUrl: string;
  onPortfolioUrlChange: (url: string) => void;
  onThemeApply: (theme: ThemeType) => void;
  onAnalysisComplete?: (data: any) => void;
}

export function PortfolioAnalyzerForm({ 
  portfolioUrl, 
  onPortfolioUrlChange, 
  onThemeApply, 
  onAnalysisComplete 
}: PortfolioAnalyzerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PortfolioData | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Apply portfolio theme based on job role
  const applyPortfolioTheme = useCallback((jobRole: string) => {
    // Reset to default theme first
    onThemeApply('default');
    
    if (!jobRole) {
      return;
    }
    
    const role = jobRole.toLowerCase().trim();
    let theme: ThemeType | null = null;
    
    // Only apply themes for exact role matches or specific domains
    if (['designer', 'graphic designer'].includes(role) || 
        role.includes('dribbble.com') || 
        role.includes('behance.net')) {
      theme = 'vibrant';
    } else if (['developer', 'software engineer'].includes(role) || 
               role.includes('github.com') || 
               role.includes('gitlab.com')) {
      theme = 'code-style';
    } else if (['analyst', 'data analyst'].includes(role) || 
               role.includes('kaggle.com') || 
               role.includes('tableau.com')) {
      theme = 'data-centric';
    } else if (['ui/ux', 'ui', 'ux'].includes(role) || 
               role.includes('figma.com') || 
               role.includes('sketch.com')) {
      theme = 'smooth-gradient';
    }
    
    // Only apply theme if we have a valid match
    if (theme) {
      const portfolioData = getPortfolioByTheme(theme);
      setPreviewData(portfolioData);
      onThemeApply(theme);
    }
  }, [onThemeApply]);

  // Handle portfolio analysis
  const analyzePortfolio = useCallback(async (url: string) => {
    if (!url) {
      setPreviewData(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll use a simple role detection based on URL
      let role = 'default';
      if (url.includes('dribbble') || url.includes('behance')) {
        role = 'designer';
      } else if (url.includes('github') || url.includes('gitlab')) {
        role = 'developer';
      } else if (url.includes('kaggle') || url.includes('tableau')) {
        role = 'analyst';
      } else if (url.includes('figma') || url.includes('sketch')) {
        role = 'ui/ux';
      }

      // Simulate analysis result
      const mockAnalysis = {
        success: true,
        analysis: {
          jobRole: role,
          skills: [],
          projects: []
        }
      };
      
      if (onAnalysisComplete) {
        await onAnalysisComplete(mockAnalysis);
      }

      // Apply theme based on detected role
      applyPortfolioTheme(role);
    } catch (err) {
      console.error('Error analyzing portfolio:', err);
      setError('Failed to analyze portfolio. Using default theme.');
      applyPortfolioTheme('default');
    } finally {
      setIsLoading(false);
    }
  }, [onAnalysisComplete, applyPortfolioTheme]);

  // Handle portfolio type selection
  const handlePortfolioType = useCallback((type: 'designer' | 'developer' | 'analyst') => {
    setSelectedRole(type);
    let url = '';
    
    switch (type) {
      case 'designer':
        url = 'https://dribbble.com/designer';
        break;
      case 'developer':
        url = 'https://github.com/developer';
        break;
      case 'analyst':
        url = 'https://kaggle.com/analyst';
        break;
    }
    
    onPortfolioUrlChange(url);
    // Only analyze when an example button is clicked
    analyzePortfolio(url);
  }, [analyzePortfolio, onPortfolioUrlChange]);

  // Remove the automatic analysis on URL change
  // We'll only analyze when form is submitted or example button is clicked

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15
      }
    }
  };

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioUrl) {
      setError('Please enter a portfolio URL');
      return;
    }
    // Only analyze when form is explicitly submitted
    analyzePortfolio(portfolioUrl);
  }, [portfolioUrl, analyzePortfolio]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <Card className="w-full h-full group hover:shadow-lg transition-shadow duration-300 flex flex-col">
          <CardHeader>
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Portfolio Analyzer
              </CardTitle>
              <CardDescription className="mt-2">
                Transform your portfolio with AI-powered theme generation
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <label htmlFor="portfolio-url" className="text-sm font-medium flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-primary" />
                    Portfolio URL
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      id="portfolio-url"
                      type="url"
                      placeholder="https://example.com/portfolio"
                      value={portfolioUrl}
                      onChange={(e) => onPortfolioUrlChange(e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze'
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Or try an example:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePortfolioType('designer')}
                      disabled={isLoading}
                      className={`justify-start ${selectedRole === 'designer' ? 'border-primary' : ''}`}
                    >
                      <Palette className="w-4 h-4 mr-2 text-pink-500" />
                      Designer
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePortfolioType('developer')}
                      disabled={isLoading}
                      className={`justify-start ${selectedRole === 'developer' ? 'border-primary' : ''}`}
                    >
                      <Code className="w-4 h-4 mr-2 text-blue-500" />
                      Developer
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePortfolioType('analyst')}
                      disabled={isLoading}
                      className={`justify-start ${selectedRole === 'analyst' ? 'border-primary' : ''}`}
                    >
                      <BarChart className="w-4 h-4 mr-2 text-emerald-500" />
                      Analyst
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <PortfolioCard
        data={previewData}
        onApplyTheme={(theme) => onThemeApply(theme as ThemeType)}
      />
    </div>
  );
};

export default PortfolioAnalyzerForm;
