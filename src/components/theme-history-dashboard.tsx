'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserThemeHistory, getUserThemeStats, ThemeHistoryEntry } from '@/lib/theme-history';
import { Loader2, BarChart3, Clock, History } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function ThemeHistoryDashboard() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<ThemeHistoryEntry[]>([]);
  const [stats, setStats] = useState<{themeId: string, themeName: string, count: number}[]>([]);
  const { user } = useAuth();
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];
  
  useEffect(() => {
    async function loadThemeData() {
      if (!user) return;
      
      setLoading(true);
      try {
        const [historyData, statsData] = await Promise.all([
          getUserThemeHistory(),
          getUserThemeStats()
        ]);
        
        setHistory(historyData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading theme data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadThemeData();
  }, [user]);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Theme History Dashboard
          </CardTitle>
          <CardDescription>Loading your theme selection history...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Theme History Dashboard
          </CardTitle>
          <CardDescription>Please log in to view your theme history</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Theme History Dashboard
          </CardTitle>
          <CardDescription>Your theme selection history will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No theme selections recorded yet. Try selecting some themes!
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" /> Theme History Dashboard
        </CardTitle>
        <CardDescription>Your theme selection history and statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Theme Usage Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Theme Usage Statistics
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats}>
                  <XAxis dataKey="themeName" tick={{fontSize: 12}} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} uses`, 'Count']}
                    labelFormatter={(label) => `Theme: ${label}`}
                  />
                  <Bar dataKey="count" fill="#8884d8">
                    {stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Recent Theme Selections */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History className="h-4 w-4" /> Recent Theme Selections
            </h3>
            <div className="space-y-2">
              {history.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-3 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[COLORS.length % history.indexOf(entry)] }} />
                    <span>{entry.themeName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{format(entry.timestamp.toDate(), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}