import { useEffect, useState } from 'react';
import { recordThemeSelection } from './theme-history';

export type ThemeType = 'default' | 'vibrant' | 'data-centric' | 'code-style' | 'smooth-gradient';

interface ThemeConfig {
  name: string;
  className: string;
  description: string;
  typography?: string;
  styles?: string;
  applyEffects?: () => void;
  cleanupEffects?: () => void;
}

export const themes: Record<ThemeType, ThemeConfig> = {
  'default': {
    name: 'Professional',
    className: 'bg-background text-foreground',
    description: 'Clean and professional theme suitable for any portfolio',
  },
  'vibrant': {
    name: 'Creative Designer',
    className: 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white',
    description: 'Bold colors and artistic elements for creative professionals',
    typography: 'font-sans font-medium',
    styles: `
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
      }
      .bg-pattern {
        background: radial-gradient(circle at 10% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 20%),
                    radial-gradient(circle at 90% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 20%),
                    radial-gradient(circle at 30% 60%, rgba(255, 255, 0, 0.1) 0%, transparent 20%);
      }
      /* Remove hover effects from the entire section */
      .portfolio-section {
        pointer-events: none;
      }
      /* Only apply hover effects to specific interactive elements */
      .portfolio-section * {
        pointer-events: auto;
      }
      .portfolio-card.hover-effect {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .portfolio-card.hover-effect:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      }
    `,
    applyEffects: () => {
      // Add vibrant theme specific effects here
      const style = document.createElement('style');
      style.id = 'vibrant-theme-effects';
      style.textContent = `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .float-shape {
          position: fixed;
          opacity: 0.2;
          border-radius: 50%;
          background: rgba(255,255,255,0.8);
          pointer-events: none;
          z-index: 0;
          animation: float 15s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);

      // Add floating shapes
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
      for (let i = 0; i < 10; i++) {
        const shape = document.createElement('div');
        shape.className = 'float-shape';
        shape.style.width = `${Math.random() * 100 + 50}px`;
        shape.style.height = shape.style.width;
        shape.style.left = `${Math.random() * 100}vw`;
        shape.style.top = `${Math.random() * 100}vh`;
        shape.style.animationDelay = `${Math.random() * 5}s`;
        shape.style.animationDuration = `${Math.random() * 10 + 10}s`;
        shape.style.background = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(shape);
      }
    },
    cleanupEffects: () => {
      // Remove vibrant theme effects
      document.getElementById('vibrant-theme-effects')?.remove();
      document.querySelectorAll('.float-shape').forEach(el => el.remove());
    },
  },
  'data-centric': {
    name: 'Data Analyst',
    className: 'bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800',
    description: 'Clean, analytical theme with data visualization elements',
    typography: 'font-sans',
    styles: `
      .bg-pattern {
        background-image: 
          radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 20%),
          linear-gradient(45deg, rgba(59, 130, 246, 0.05) 25%, transparent 25%) 0 0,
          linear-gradient(-45deg, rgba(59, 130, 246, 0.05) 25%, transparent 25%) 0 0;
        background-size: 100px 100px;
      }
      .data-point {
        position: relative;
        transition: all 0.3s ease;
      }
      .data-point:hover {
        transform: scale(1.1);
        z-index: 10;
      }
      .data-point::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        transform: scale(0);
        transition: transform 0.3s ease;
      }
      .data-point:hover::after {
        transform: scale(1.5);
        opacity: 0;
      }
    `,
    applyEffects: () => {
      // Add data-centric theme specific effects here
      const style = document.createElement('style');
      style.id = 'datacentric-theme-effects';
      style.textContent = `
        .data-point {
          position: fixed;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.2);
          pointer-events: none;
          z-index: 0;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .data-point:hover {
          transform: scale(1.5);
          opacity: 0.8;
        }
      `;
      document.head.appendChild(style);

      // Add data points
      for (let i = 0; i < 20; i++) {
        const point = document.createElement('div');
        point.className = 'data-point';
        const size = Math.random() * 10 + 5;
        point.style.width = `${size}px`;
        point.style.height = `${size}px`;
        point.style.left = `${Math.random() * 100}vw`;
        point.style.top = `${Math.random() * 100}vh`;
        point.style.opacity = '0.4';
        point.style.background = `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.2})`;
        document.body.appendChild(point);
      }
    },
    cleanupEffects: () => {
      // Remove data-centric theme effects
      document.getElementById('datacentric-theme-effects')?.remove();
      document.querySelectorAll('.data-point').forEach(el => el.remove());
    },
  },
  'code-style': {
    name: 'Web Developer',
    className: 'bg-gray-900 text-green-400',
    description: 'Dark theme with code-like aesthetics for developers',
    typography: 'font-mono',
    styles: `
      @keyframes cursor-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .cursor {
        display: inline-block;
        width: 10px;
        height: 20px;
        background: #4ade80;
        margin-left: 4px;
        animation: cursor-blink 1s step-end infinite;
      }
      .code-bg {
        background: #1a1a1a;
        position: relative;
        overflow: hidden;
      }
      .code-bg::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px) 0 0 / 20px 20px,
          linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px) 0 0 / 20px 20px;
        pointer-events: none;
      }
    `,
    applyEffects: () => {
      // Add code-style theme specific effects here
      const style = document.createElement('style');
      style.id = 'codestyle-theme-effects';
      style.textContent = `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor {
          display: inline-block;
          width: 10px;
          height: 20px;
          background: #4ade80;
          margin-left: 4px;
          animation: blink 1s step-end infinite;
        }
        .code-line {
          font-family: 'Fira Code', monospace;
          opacity: 0;
          transform: translateY(10px);
          animation: fadeIn 0.5s forwards;
        }
        @keyframes fadeIn {
          to { opacity: 0.7; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);

      // Add code-like elements
      const codeContainer = document.createElement('div');
      codeContainer.className = 'fixed bottom-0 right-0 p-4 text-xs opacity-70 pointer-events-none z-10';
      codeContainer.style.fontFamily = "'Fira Code', monospace";
      
      const codeLines = [
        '// Portfolio analysis complete',
        'const theme = {',
        '  name: "Code Style",',
        '  colors: {',
        '    background: "#1a1a1a",',
        '    text: "#4ade80",',
        '    accent: "#60a5fa"',
        '  }',
        '};',
        'applyTheme(theme);<span class="cursor"></span>'
      ];
      
      codeLines.forEach((line, i) => {
        const lineEl = document.createElement('div');
        lineEl.className = 'code-line';
        lineEl.style.animationDelay = `${i * 0.1}s`;
        lineEl.innerHTML = line;
        codeContainer.appendChild(lineEl);
      });
      
      document.body.appendChild(codeContainer);
    },
    cleanupEffects: () => {
      // Remove code-style theme effects
      document.getElementById('codestyle-theme-effects')?.remove();
      document.querySelectorAll('.code-line, .cursor').forEach(el => el.remove());
    },
  },
  'smooth-gradient': {
    name: 'UX/UI Designer',
    className: 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800',
    description: 'Elegant gradients with smooth transitions and subtle animations',
    typography: 'font-sans font-light',
    styles: `
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .bg-gradient-animated {
        background-size: 200% 200%;
        animation: gradient-shift 15s ease infinite;
      }
      .hover-lift {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-lift:hover {
        transform: translateY(-4px);
      }
      .smooth-transition {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `,
    applyEffects: () => {
      // Add smooth gradient theme specific effects here
      const style = document.createElement('style');
      style.id = 'gradient-theme-effects';
      style.textContent = `
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite;
          opacity: 0.2;
        }
      `;
      document.head.appendChild(style);

      const gradientBg = document.createElement('div');
      gradientBg.className = 'gradient-bg';
      document.body.appendChild(gradientBg);
    },
    cleanupEffects: () => {
      // Remove smooth gradient theme effects
      document.getElementById('gradient-theme-effects')?.remove();
      document.querySelectorAll('.gradient-bg').forEach(el => el.remove());
    },
  },
};

export function useThemeManager(theme: ThemeType) {
  const [previousTheme, setPreviousTheme] = useState<ThemeType | null>(null);
  
  useEffect(() => {
    // Only log theme changes, not initial load
    if (previousTheme && previousTheme !== theme) {
      // Log the theme change
      recordThemeSelection(theme).catch((error: Error) => {
        console.error('Failed to log theme change:', error);
      });
    }
    
    // Clean up previous theme effects
    Object.values(themes).forEach((t) => {
      if (t.cleanupEffects) t.cleanupEffects();
    });

    // Apply new theme
    const currentTheme = themes[theme];
    if (currentTheme.applyEffects) {
      currentTheme.applyEffects();
    }

    // Update previous theme
    setPreviousTheme(theme);

    // Clean up on unmount
    return () => {
      if (currentTheme.cleanupEffects) {
        currentTheme.cleanupEffects();
      }
    };
  }, [theme, previousTheme]);
}

export function getThemeClass(theme: ThemeType): string {
  return themes[theme]?.className || themes['default'].className;
}

export function getThemeName(theme: ThemeType): string {
  return themes[theme]?.name || 'Default';
}

export function getThemeDescription(theme: ThemeType): string {
  return themes[theme]?.description || 'Standard theme with default styling';
}
