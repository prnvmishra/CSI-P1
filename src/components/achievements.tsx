'use client';

import { useStyleStore } from '@/store/style-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function Achievements() {
  const { achievements, uniquePrompts } = useStyleStore();
  const achievedCount = achievements.filter(a => a.achieved).length;

  return (
    <Card>
        <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>
                You've earned {achievedCount} of {achievements.length} badges and used {uniquePrompts.size} unique prompts.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <TooltipProvider>
                <div className="grid grid-cols-4 gap-4">
                    {achievements.map((badge) => (
                    <Tooltip key={badge.id}>
                        <TooltipTrigger asChild>
                        <div
                            className={`flex flex-col items-center justify-center p-4 aspect-square rounded-lg border-2 transition-all duration-300
                            ${badge.achieved
                                ? 'border-primary bg-primary/10 text-primary scale-105 shadow-lg'
                                : 'border-dashed bg-muted/50 text-muted-foreground opacity-60'
                            }`}
                        >
                            <Medal className="h-8 w-8" />
                        </div>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p className="font-bold">{badge.name} {badge.achieved && '✓'}</p>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        </TooltipContent>
                    </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
        </CardContent>
    </Card>
  );
}
