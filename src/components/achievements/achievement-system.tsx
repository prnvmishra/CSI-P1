'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Star, CheckCircle, Gift, Flame, Award, Palette, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  unlocked: boolean;
  progress: number;
  target: number;
  category: 'theme' | 'activity' | 'social' | 'milestone';
};

export function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'theme_explorer',
      title: 'Theme Explorer',
      description: 'Unlock 3 different themes',
      icon: <Palette className="h-5 w-5" />,
      points: 50,
      unlocked: false,
      progress: 1,
      target: 3,
      category: 'theme'
    },
    {
      id: 'social_butterfly',
      title: 'Social Butterfly',
      description: 'Gain 10 followers',
      icon: <UserPlus className="h-5 w-5" />,
      points: 100,
      unlocked: false,
      progress: 0,
      target: 10,
      category: 'social'
    },
    {
      id: 'daily_streak',
      title: 'Daily Streak',
      description: 'Visit the app for 7 days in a row',
      icon: <Flame className="h-5 w-5" />,
      points: 75,
      unlocked: false,
      progress: 0,
      target: 7,
      category: 'milestone'
    },
    {
      id: 'prompt_master',
      title: 'Prompt Master',
      description: 'Create 20 prompts',
      icon: <Zap className="h-5 w-5" />,
      points: 150,
      unlocked: false,
      progress: 0,
      target: 20,
      category: 'activity'
    },
    {
      id: 'theme_maestro',
      title: 'Theme Maestro',
      description: 'Unlock all themes',
      icon: <Award className="h-5 w-5" />,
      points: 200,
      unlocked: false,
      progress: 1,
      target: 5,
      category: 'theme'
    },
    {
      id: 'early_adopter',
      title: 'Early Adopter',
      description: 'Join during beta',
      icon: <Star className="h-5 w-5" />,
      points: 25,
      unlocked: true,
      progress: 1,
      target: 1,
      category: 'milestone'
    }
  ]);

  const [totalPoints, setTotalPoints] = useState(0);
  const [showNotification, setShowNotification] = useState<{title: string, points: number} | null>(null);

  // Simulate unlocking achievements (in a real app, this would come from your backend)
  useEffect(() => {
    const timer = setTimeout(() => {
      const updated = [...achievements];
      let pointsEarned = 0;
      
      updated.forEach(ach => {
        if (!ach.unlocked && ach.progress >= ach.target) {
          ach.unlocked = true;
          pointsEarned += ach.points;
          setShowNotification({ title: ach.title, points: ach.points });
          setTimeout(() => setShowNotification(null), 3000);
        }
      });
      
      if (pointsEarned > 0) {
        setAchievements(updated);
        setTotalPoints(prev => prev + pointsEarned);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [achievements]);

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'theme': return 'bg-purple-100 text-purple-800';
      case 'activity': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'milestone': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Achievements</h2>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full">
          <span className="font-mono text-lg font-bold">{totalPoints}</span>
          <span className="text-sm text-muted-foreground">Points</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`h-full transition-all ${achievement.unlocked ? 'border-blue-200 bg-blue-50' : 'opacity-80'}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`${getCategoryColor(achievement.category)}`}
                    variant="outline"
                  >
                    {achievement.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    {achievement.points} pts
                  </span>
                  <span className="font-medium">
                    {Math.min(achievement.progress, achievement.target)}/{achievement.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      achievement.unlocked ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{
                      width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  />
                </div>
                {achievement.unlocked && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Unlocked!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievement Unlock Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-green-200 flex items-center gap-3 z-50"
        >
          <div className="bg-green-100 p-2 rounded-full">
            <Trophy className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="font-medium">Achievement Unlocked!</p>
            <p className="text-sm text-muted-foreground">
              {showNotification.title} (+{showNotification.points} pts)
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
