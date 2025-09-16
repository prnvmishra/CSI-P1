'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getUserThemeHistory, getUserThemeStats, ThemeHistoryEntry } from '@/lib/theme-history';
import { THEME_PRESETS } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';
import { Calendar, TrendingUp, Palette, Clock, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff', '#ff0000', '#ffff00'];

export function ThemeDashboard() {
  const [themeHistory, setThemeHistory] = useState<ThemeHistoryEntry[]>([]);
  const [themeStats, setThemeStats] = useState<{themeId: string, themeName: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { user } = useAuth();

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [history, stats] = await Promise.all([
        getUserThemeHistory(),
        getUserThemeStats()
      ]);
      setThemeHistory(history);
      setThemeStats(stats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching theme data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Dashboard
          </CardTitle>
          <CardDescription>Please log in to view your theme usage statistics</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Prepare data for charts
  const chartData = themeStats.map((stat, index) => ({
    name: stat.themeName,
    count: stat.count,
    color: COLORS[index % COLORS.length]
  }));

  const pieData = themeStats.map((stat, index) => ({
    name: stat.themeName,
    value: stat.count,
    color: COLORS[index % COLORS.length]
  }));

  // Group history by day for line chart
  const dailyData = themeHistory.reduce((acc, entry) => {
    const date = entry.timestamp.toDate().toDateString();
    if (!acc[date]) {
      acc[date] = { date, count: 0 };
    }
    acc[date].count++;
    return acc;
  }, {} as Record<string, {date: string, count: number}>);

  const lineData = Object.values(dailyData)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 days

  const totalThemesUsed = themeStats.length;
  const totalSelections = themeStats.reduce((sum, stat) => sum + stat.count, 0);
  const mostUsedTheme = themeStats[0];
  const recentThemes = themeHistory.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="h-6 w-6" />
            Theme Dashboard
          </h2>
          <p className="text-muted-foreground">Track your creative journey through themes</p>
        </div>
        <Button 
          onClick={fetchData} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Themes</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalThemesUsed}</div>
            <p className="text-xs text-muted-foreground">
              Unique themes explored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Selections</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSelections}</div>
            <p className="text-xs text-muted-foreground">
              Theme changes made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {mostUsedTheme?.themeName || 'None'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostUsedTheme?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              times selected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {format(lastUpdated, 'HH:mm')}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(lastUpdated, 'MMM dd, yyyy')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="bar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bar">Usage Chart</TabsTrigger>
          <TabsTrigger value="pie">Distribution</TabsTrigger>
          <TabsTrigger value="line">Timeline</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Usage Statistics</CardTitle>
              <CardDescription>Number of times each theme has been selected</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No theme data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Distribution</CardTitle>
              <CardDescription>Percentage breakdown of theme usage</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No theme data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Activity Timeline</CardTitle>
              <CardDescription>Theme selections over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : lineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No recent activity data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Theme Activity</CardTitle>
              <CardDescription>Your latest theme selections</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentThemes.length > 0 ? (
                <div className="space-y-3">
                  {recentThemes.map((entry, index) => {
                    const theme = THEME_PRESETS.find(t => t.id === entry.themeId);
                    return (
                      <div key={entry.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {theme && <theme.icon className="h-5 w-5" />}
                          <div>
                            <p className="font-medium">{entry.themeName}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(entry.timestamp.toDate(), 'MMM dd, yyyy HH:mm')}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {format(entry.timestamp.toDate(), 'HH:mm')}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No recent activity
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
