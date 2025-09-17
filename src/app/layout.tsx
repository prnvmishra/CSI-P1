import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { MainNav } from '@/components/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { Sparkles, AlertCircle } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div role="alert" className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 rounded-lg border border-destructive/20 bg-destructive/5">
        <div className="flex items-center gap-2 text-destructive mb-4">
          <AlertCircle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Something went wrong</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error: Error) => {
        console.error('Error caught by error boundary:', error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export const metadata: Metadata = {
  title: 'Promptalizer',
  description: 'AI-Powered Dynamic Website Generator',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <AuthProvider>
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                  <Link href="/" className="flex items-center space-x-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      PromptLab
                    </span>
                  </Link>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MainNav />
                  <div className="ml-2">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1">
              <ErrorBoundaryWrapper>
                {children}
              </ErrorBoundaryWrapper>
            </main>
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
