'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Loader2, BarChart2, PieChart as PieChartIcon, Clock, Calendar, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getDocs, collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { getUserThemeStats } from '@/lib/theme-history';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff'];

interface ThemeHistoryEntry {
  id?: string;
  themeId: string;
  themeName: string;
  timestamp: Timestamp;
  userId: string;
}

interface PromptHistoryEntry {
  id?: string;
  prompt: string;
  response: string;
  timestamp: Timestamp;
  userId: string;
  model?: string;
  tokensUsed?: number;
}

export function AnalyticsDashboard() {
  interface ThemeStat {
    themeId: string;
    themeName: string;
    name: string;
    count: number;
  }

  const [themeHistory, setThemeHistory] = useState<ThemeHistoryEntry[]>([]);
  const [themeStats, setThemeStats] = useState<ThemeStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('themes');

  const fetchThemeHistory = async () => {
    if (!auth.currentUser) return [];
    
    try {
      const themeQuery = query(
        collection(db, 'themeHistory'),
        where('userId', '==', auth.currentUser.uid)
      );
      const themeSnapshot = await getDocs(themeQuery);
      const entries = themeSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ThemeHistoryEntry[];
      
      // Sort in memory by timestamp in descending order
      return entries.sort((a, b) => {
        const timeA = a.timestamp?.toMillis() || 0;
        const timeB = b.timestamp?.toMillis() || 0;
        return timeB - timeA;
      });
    } catch (error) {
      console.error('Error fetching theme history:', error);
      return [];
    }
  };

  const fetchThemeStats = async () => {
    try {
      const stats = await getUserThemeStats();
      return stats;
    } catch (error) {
      console.error('Error fetching theme stats:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      
      setLoading(true);
      try {
        const [history, stats] = await Promise.all([
          fetchThemeHistory(),
          fetchThemeStats()
        ]);
        
        setThemeHistory(history);
        setThemeStats(stats);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format theme stats for charts
  const chartData = themeStats.map(stat => ({
    name: stat.themeName,
    themeName: stat.themeName,
    count: stat.count,
    themeId: stat.themeId
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value="themes" className="w-full">
        <TabsList className="w-full max-w-xs">
          <TabsTrigger value="themes">
            <Palette className="w-4 h-4 mr-2" />
            Theme Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Theme Changes</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{themeHistory.length}</div>
                <p className="text-xs text-muted-foreground">
                  {new Date(themeHistory[0]?.timestamp?.toDate()).toLocaleDateString() || 'N/A'} - Now
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Themes Used</CardTitle>
                <Palette className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(themeHistory.map(t => t.themeName)).size}
                </div>
                <p className="text-xs text-muted-foreground">Different themes in your history</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Used Theme</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {themeStats[0]?.name || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {themeStats[0]?.count || 0} uses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Changed</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {themeHistory[0] ? 
                    new Date(themeHistory[0].timestamp.toDate()).toLocaleDateString() : 
                    'Never'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last theme change
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Theme Usage</CardTitle>
                <p className="text-sm text-muted-foreground">Your most used themes</p>
              </CardHeader>
              <CardContent className="h-[300px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="themeName" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                      <Bar dataKey="count" fill="#8884d8" name="Uses" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No theme usage data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Theme Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Distribution of your theme usage</p>
              </CardHeader>
              <CardContent className="h-[300px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [`${value} uses`, props.payload.name]} 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No theme usage data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Theme Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {themeHistory.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div 
                          className="h-8 w-8 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.themeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.timestamp.toDate().toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {new Date(item.timestamp.toDate()).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
                {themeHistory.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No theme history found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
