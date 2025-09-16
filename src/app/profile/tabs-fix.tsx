'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Bookmark, Activity, BarChart2, Trophy, Award } from 'lucide-react';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { ProgressSystem } from '@/components/progress-system';
import { AchievementSystem } from '@/components/achievements/achievement-system';

export function ProfileTabs({ activeTab, onTabChange, children }: {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="overflow-x-auto pb-2">
        <TabsList className="w-full flex flex-nowrap justify-start sm:justify-center">
          <TabsTrigger value="posts" className="flex items-center gap-2 whitespace-nowrap">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2 whitespace-nowrap">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2 whitespace-nowrap">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 whitespace-nowrap">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2 whitespace-nowrap">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2 whitespace-nowrap">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Achievements</span>
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Posts Content */}
      <TabsContent value="posts" className="space-y-4">
        {children}
      </TabsContent>

      {/* Saved Content */}
      <TabsContent value="saved" className="space-y-4">
        <div className="text-center py-8">
          <Bookmark className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-medium">Saved Items</h3>
          <p className="text-muted-foreground">Save posts to view them here</p>
        </div>
      </TabsContent>

      {/* Activity Content */}
      <TabsContent value="activity" className="space-y-4">
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
              <div className="bg-primary/10 p-2 rounded-full">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">John Doe</span> liked your post
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Analytics Content */}
      <TabsContent value="analytics" className="space-y-4">
        <AnalyticsDashboard />
      </TabsContent>

      {/* Progress Content */}
      <TabsContent value="progress" className="space-y-4">
        <ProgressSystem />
      </TabsContent>

      {/* Achievements Content */}
      <TabsContent value="achievements" className="space-y-4">
        <AchievementSystem />
      </TabsContent>
    </Tabs>
  );
}
