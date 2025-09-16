'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useStyleStore } from '@/store/style-store';
import { PortfolioAnalyzerForm } from '@/components/portfolio-analyzer/PortfolioAnalyzerForm';
import { ThemeType, useThemeManager, getThemeName, getThemeDescription } from '@/lib/themeManager';
import { PortfolioData, getPortfolioByTheme } from '@/lib/portfolioData';

export default function PortfolioAnalyzerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  
  // Apply theme effects
  useThemeManager(currentTheme);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  const handleThemeApply = (theme: ThemeType) => {
    setCurrentTheme(theme);
    // Update portfolio data based on the selected theme
    setPortfolioData(getPortfolioByTheme(theme));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 portfolio-section">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Portfolio-Based Theme Generator
          </h1>
          <p className="text-muted-foreground">
            Generate a personalized theme based on your professional portfolio
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Analyze Your Portfolio</CardTitle>
                <CardDescription>
                  Enter your portfolio URL to generate a theme that matches your professional identity
                </CardDescription>
                <div className="mt-2 text-sm">
                  <p className="font-medium mb-1">Try these examples:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPortfolioUrl('https://dribbble.com/')}
                      className="text-xs"
                    >
                      🎨 Design Portfolio
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPortfolioUrl('https://github.com/')}
                      className="text-xs"
                    >
                      💻 Developer Portfolio
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPortfolioUrl('https://www.kaggle.com/')}
                      className="text-xs"
                    >
                      📊 Data Portfolio
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PortfolioAnalyzerForm 
                  portfolioUrl={portfolioUrl}
                  onPortfolioUrlChange={setPortfolioUrl}
                  onThemeApply={handleThemeApply} 
                  onAnalysisComplete={(data) => {
                    console.log('Analysis complete:', data);
                    // You can add additional logic here when analysis is complete
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Current Theme</CardTitle>
                <CardDescription>
                  {getThemeDescription(currentTheme)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-2">{getThemeName(currentTheme)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentTheme === 'default' 
                      ? 'No portfolio analyzed yet. Enter your portfolio URL to generate a theme.'
                      : `This theme was generated based on your portfolio.`}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Preview</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {['default', 'vibrant', 'data-centric', 'code-style', 'smooth-gradient'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setCurrentTheme(theme as ThemeType)}
                        className={`h-12 rounded-md border-2 transition-all ${
                          currentTheme === theme ? 'ring-2 ring-primary ring-offset-2' : ''
                        } ${
                          theme === 'vibrant' ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500' :
                          theme === 'data-centric' ? 'bg-gradient-to-r from-blue-100 to-blue-200' :
                          theme === 'code-style' ? 'bg-gray-900' :
                          theme === 'smooth-gradient' ? 'bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100' :
                          'bg-background'
                        }`}
                        title={getThemeName(theme as ThemeType)}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Theme Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setCurrentTheme('default')}
                      disabled={currentTheme === 'default'}
                    >
                      Reset to Default
                    </Button>
                    <Button className="w-full">
                      Save Theme to Profile
                    </Button>
                    <Button variant="outline" className="w-full">
                      <span className="mr-2">🔗</span> Share This Theme
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2 text-sm">1</span>
                    Enter Your Portfolio URL
                  </h4>
                  <p className="text-sm text-muted-foreground pl-8">
                    Paste the URL of your personal portfolio, blog, or professional website.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2 text-sm">2</span>
                    AI Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground pl-8">
                    Our AI analyzes your portfolio to understand your profession and style.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2 text-sm">3</span>
                    Theme Generation
                  </h4>
                  <p className="text-sm text-muted-foreground pl-8">
                    A custom theme is generated based on your professional identity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
