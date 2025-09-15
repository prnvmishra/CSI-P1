'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { PortfolioData } from '@/lib/portfolioData';

interface PortfolioCardProps {
  data: PortfolioData | null;
  onApplyTheme: (theme: string) => void;
}

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

export function PortfolioCard({ data, onApplyTheme }: PortfolioCardProps) {
  if (!data) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Portfolio Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
          <p>Select a role to see a preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={data.theme}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeIn}
        className="h-full"
      >
        <Card className="h-full flex flex-col hover:bg-transparent">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-2xl font-bold">
                {data.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {data.role} • {data.experience}
              </p>
            </motion.div>
          </CardHeader>
          
          <CardContent className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <h3 className="font-medium text-sm flex items-center">
                <span className="w-1.5 h-4 bg-primary rounded-full mr-2" />
                About
              </h3>
              <p className="text-sm text-muted-foreground pl-3">
                {data.bio}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <h3 className="font-medium text-sm flex items-center">
                <span className="w-1.5 h-4 bg-primary rounded-full mr-2" />
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.5 + (i * 0.05),
                      type: 'spring',
                      stiffness: 300,
                      damping: 15
                    }}
                    className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <h3 className="font-medium text-sm flex items-center">
                <span className="w-1.5 h-4 bg-primary rounded-full mr-2" />
                Featured Projects
              </h3>
              <div className="space-y-2">
                {data.projects.map((project, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.6 + (i * 0.1),
                      type: 'spring',
                      stiffness: 300,
                      damping: 15
                    }}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted/60 transition-colors cursor-pointer"
                  >
                    <h4 className="font-medium text-sm">{project.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.tags.map((tag, j) => (
                        <span 
                          key={j}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-background text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </CardContent>

          <CardFooter className="border-t pt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="w-full"
            >
              <Button 
                onClick={() => onApplyTheme(data.theme)}
                className="w-full group"
                size="sm"
              >
                <span className="relative z-10 flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Apply {data.theme.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Theme
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
