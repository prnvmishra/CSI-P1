import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { auth, db } from './firebase';

type UserProgress = {
  level: number;
  xp: number;
  xpToNextLevel: number;
  unlockedThemes: string[];
  achievements: {
    [key: string]: {
      unlocked: boolean;
      progress: number;
      unlockedAt?: Date;
    };
  };
  totalPoints: number;
  streak: {
    count: number;
    lastLogin: string; // ISO date string
  };
};

const DEFAULT_USER_PROGRESS: UserProgress = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  unlockedThemes: ['default'],
  achievements: {},
  totalPoints: 0,
  streak: {
    count: 0,
    lastLogin: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  }
};

const XP_PER_LEVEL = 100;
const LEVEL_UP_MULTIPLIER = 1.5;

const THEME_UNLOCKS = [
  { level: 5, theme: 'ocean' },
  { level: 10, theme: 'forest' },
  { level: 15, theme: 'sunset' },
  { level: 20, theme: 'midnight' },
  { level: 25, theme: 'cosmic' }
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  progress: number;
  target: number;
  category: 'theme' | 'activity' | 'social' | 'milestone';
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'progress'>[] = [
  {
    id: 'theme_explorer',
    title: 'Theme Explorer',
    description: 'Unlock 3 different themes',
    points: 50,
    target: 3,
    category: 'theme'
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Gain 10 followers',
    points: 100,
    target: 10,
    category: 'social'
  },
  {
    id: 'daily_streak',
    title: 'Daily Streak',
    description: 'Visit the app for 7 days in a row',
    points: 75,
    target: 7,
    category: 'milestone'
  },
  {
    id: 'prompt_master',
    title: 'Prompt Master',
    description: 'Create 20 prompts',
    points: 150,
    target: 20,
    category: 'activity'
  },
  {
    id: 'theme_maestro',
    title: 'Theme Maestro',
    description: 'Unlock all themes',
    points: 200,
    target: 5,
    category: 'theme'
  },
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    description: 'Join during beta',
    points: 25,
    target: 1,
    category: 'milestone'
  },
  {
    id: 'first_post',
    title: 'First Post',
    description: 'Create your first post',
    points: 25,
    target: 1,
    category: 'milestone'
  },
  {
    id: 'commenter',
    title: 'Commenter',
    description: 'Comment on 10 posts',
    points: 50,
    target: 10,
    category: 'social'
  },
  {
    id: 'popular',
    title: 'Popular',
    description: 'Get 100 likes on your posts',
    points: 200,
    target: 100,
    category: 'social'
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Visit the app for 30 days in a row',
    points: 200,
    target: 30,
    category: 'activity'
  },
  {
    id: 'influencer',
    title: 'Influencer',
    description: 'Get 500 followers',
    points: 300,
    target: 500,
    category: 'social'
  },
  {
    id: 'content_creator',
    title: 'Content Creator',
    description: 'Create 50 posts',
    points: 150,
    target: 50,
    category: 'milestone'
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Complete all achievements',
    points: 500,
    target: 1,
    category: 'milestone'
  },
  {
    id: 'weekly_streak',
    title: 'Weekly Streak',
    description: 'Log in for 7 days in a row',
    points: 100,
    target: 1,
    category: 'milestone'
  },
  {
    id: 'monthly_streak',
    title: 'Monthly Streak',
    description: 'Log in for 30 days in a row',
    points: 300,
    target: 1,
    category: 'milestone'
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Log in for 100 days in a row',
    points: 500,
    target: 1,
    category: 'milestone'
  }
];

export async function updateLoginStreak() {
  const user = auth.currentUser;
  if (!user) return null;

  const userRef = doc(db, 'userProgress', user.uid);
  const userProgress = await getUserProgress();
  
  if (!userProgress) return null;
  
  const today = new Date().toISOString().split('T')[0];
  const lastLogin = userProgress.streak?.lastLogin || today;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  let newStreakCount = userProgress.streak?.count || 0;
  
  if (lastLogin === today) {
    // Already logged in today
    return userProgress.streak;
  } else if (lastLogin === yesterdayStr) {
    // Consecutive day
    newStreakCount++;
  } else {
    // Broken streak, reset counter
    newStreakCount = 1;
  }
  
  // Update streak in database
  const updates = {
    'streak.count': newStreakCount,
    'streak.lastLogin': today
  };
  
  await updateDoc(userRef, updates);
  
  // Check for streak-based achievements
  if (newStreakCount >= 7) {
    await updateAchievementProgress('weekly_streak', 1);
  }
  if (newStreakCount >= 30) {
    await updateAchievementProgress('monthly_streak', 1);
  }
  if (newStreakCount >= 100) {
    await updateAchievementProgress('dedicated', 1);
  }
  
  return { count: newStreakCount, lastLogin: today };
}

export async function getUserProgress() {
  const user = auth.currentUser;
  if (!user) return null;

  const userRef = doc(db, 'userProgress', user.uid);
  const docSnap = await getDoc(userRef);
  
  if (!docSnap.exists()) {
    await setDoc(userRef, DEFAULT_USER_PROGRESS);
    return { ...DEFAULT_USER_PROGRESS, id: user.uid };
  }
  
  // Ensure all required fields exist
  const data = docSnap.data();
  const progress = { 
    ...DEFAULT_USER_PROGRESS, 
    ...data,
    streak: {
      ...DEFAULT_USER_PROGRESS.streak,
      ...(data.streak || {})
    }
  };
  
  return { id: user.uid, ...progress } as UserProgress & { id: string };
}

export async function addXP(amount: number) {
  const user = auth.currentUser;
  if (!user) return null;

  const userRef = doc(db, 'userProgress', user.uid);
  let levelUp = false;
  let unlockedThemes: string[] = [];
  
  // Get current progress
  const userProgress = await getUserProgress();
  if (!userProgress) return null;
  
  let { level, xp, xpToNextLevel } = userProgress;
  let newXp = xp + amount;
  
  // Check for level up
  while (newXp >= xpToNextLevel) {
    newXp -= xpToNextLevel;
    level++;
    levelUp = true;
    xpToNextLevel = Math.floor(xpToNextLevel * LEVEL_UP_MULTIPLIER);
    
    // Check for theme unlocks
    const themeUnlock = THEME_UNLOCKS.find(t => t.level === level);
    if (themeUnlock && !userProgress.unlockedThemes.includes(themeUnlock.theme)) {
      unlockedThemes.push(themeUnlock.theme);
      await updateDoc(userRef, {
        unlockedThemes: arrayUnion(themeUnlock.theme)
      });
      
      // Update theme-related achievements
      await updateAchievementProgress('theme_explorer', 1);
      if (unlockedThemes.length >= 5) {
        await updateAchievementProgress('theme_maestro', 1);
      }
    }
  }

  // Update the user's XP and level
  await updateDoc(userRef, {
    xp: newXp,
    level,
    xpToNextLevel
  });

  return { levelUp, unlockedThemes };
}

export async function updateAchievementProgress(
  achievementId: string, 
  progressIncrement: number = 1
) {
  const user = auth.currentUser;
  if (!user) return null;

  const userRef = doc(db, 'userProgress', user.uid);
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId) as Omit<Achievement, 'unlocked' | 'progress'> | undefined;
  
  if (!achievement) return null;
  
  // Get current progress
  const userProgress = await getUserProgress();
  if (!userProgress) return null;
  
  const currentAchievement = userProgress.achievements[achievementId] || {
    unlocked: false,
    progress: 0
  };
  
  // If already unlocked, no need to update
  if (currentAchievement.unlocked) return null;
  
  const newProgress = currentAchievement.progress + progressIncrement;
  const isUnlocked = newProgress >= achievement.target;
  
  const updates: any = {
    [`achievements.${achievementId}`]: {
      unlocked: isUnlocked,
      progress: Math.min(newProgress, achievement.target),
      ...(isUnlocked && { unlockedAt: new Date() })
    }
  };
  
  // Add points if achievement is unlocked
  if (isUnlocked) {
    updates.totalPoints = increment(achievement.points);
  }
  
  await updateDoc(userRef, updates);
  
  // If this was a completionist check, see if all achievements are now unlocked
  if (isUnlocked && achievementId !== 'completionist') {
    await checkCompletionistAchievement(userRef, userProgress);
  }
  
  return {
    unlocked: isUnlocked,
    progress: Math.min(newProgress, achievement.target),
    points: achievement.points
  };
}

async function checkCompletionistAchievement(
  userRef: any,
  userProgress: UserProgress
) {
  // Count how many achievements are unlocked
  const unlockedCount = ACHIEVEMENTS.filter(
    a => userProgress.achievements[a.id]?.unlocked
  ).length;
  
  const totalAchievements = ACHIEVEMENTS.length;
  
  // If all achievements except completionist are unlocked
  if (unlockedCount >= totalAchievements - 1) {
    await updateAchievementProgress('completionist', 1);
  }
}

export async function getAchievementProgress() {
  const user = auth.currentUser;
  if (!user) return null;
  
  const userProgress = await getUserProgress();
  if (!userProgress) return null;
  
  const achievements = userProgress.achievements;
  const achievementProgress: { [id: string]: Achievement } = {};
  
  for (const achievement of ACHIEVEMENTS) {
    achievementProgress[achievement.id] = {
      ...achievement,
      unlocked: achievements[achievement.id]?.unlocked || false,
      progress: achievements[achievement.id]?.progress || 0
    };
  }
  
  return achievementProgress;
}
