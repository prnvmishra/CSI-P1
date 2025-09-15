'use client';

import { useStyleStore } from '@/store/style-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Redo, Undo } from 'lucide-react';
import { Badge } from './ui/badge';

export function HistoryPanel() {
  const { history, historyIndex, undo, redo } = useStyleStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <Card>
        <CardHeader>
            <CardTitle>Command History</CardTitle>
            <CardDescription>Review and revert applied transformations.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-2 mb-4">
                <Button onClick={undo} disabled={!canUndo} variant="outline" className="w-full">
                <Undo className="mr-2 h-4 w-4" /> Undo
                </Button>
                <Button onClick={redo} disabled={!canRedo} variant="outline" className="w-full">
                <Redo className="mr-2 h-4 w-4" /> Redo
                </Button>
            </div>
            <ScrollArea className="h-64 w-full rounded-md border p-4">
                {history.length <= 1 ? (
                     <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <History className="h-8 w-8 mb-2"/>
                        <p className="font-semibold">No commands yet!</p>
                        <p className="text-sm">Your prompt history will appear here.</p>
                     </div>
                ) : (
                    <ol className="space-y-4">
                    {[...history].reverse().map((commands, index) => {
                        const originalIndex = history.length - 1 - index;
                        if (originalIndex === 0) return null; // Skip initial empty state
                        
                        const isActive = originalIndex === historyIndex;
                        return (
                        <li
                            key={originalIndex}
                            className={`p-3 rounded-md transition-colors ${
                            isActive ? 'bg-secondary' : 'opacity-60'
                            }`}
                        >
                            <div className="font-semibold text-sm mb-2">Step {originalIndex}</div>
                            <div className="flex flex-wrap gap-1">
                                {commands.map((cmd, cmdIndex) => (
                                    <Badge key={cmdIndex} variant={isActive ? "default" : "outline"}>{cmd}</Badge>
                                ))}
                            </div>
                        </li>
                        );
                    })}
                    </ol>
                )}
            </ScrollArea>
        </CardContent>
    </Card>
  );
}
