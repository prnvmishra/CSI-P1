'use client';

import { History, Medal, Settings, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemePresets } from './theme-presets';
import { HistoryPanel } from './history';
import { Achievements } from './achievements';

export function ControlPanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open Control Panel</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="font-headline">Control Panel</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="presets" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets"><Wand2 className="mr-2 h-4 w-4"/>Presets</TabsTrigger>
            <TabsTrigger value="history"><History className="mr-2 h-4 w-4"/>History</TabsTrigger>
            <TabsTrigger value="achievements"><Medal className="mr-2 h-4 w-4"/>Badges</TabsTrigger>
          </TabsList>
          <TabsContent value="presets" className="mt-4">
            <ThemePresets />
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <HistoryPanel />
          </TabsContent>
          <TabsContent value="achievements" className="mt-4">
            <Achievements />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
