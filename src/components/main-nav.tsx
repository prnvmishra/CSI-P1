'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sparkles, Home, Zap, User, Palette } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();
  
  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/prompt-lab",
      label: "Prompt Lab",
      icon: Zap,
      active: pathname === "/prompt-lab",
    },
    {
      href: "/portfolio-analyzer",
      label: "Portfolio Analyzer",
      icon: Palette,
      active: pathname === "/portfolio-analyzer",
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile",
    },
  ];

  return (
    <nav className="flex items-center space-x-1 p-1 bg-muted/40 rounded-full">
      {routes.map((route) => {
        const Icon = route.icon;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              route.active 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline-block">{route.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
