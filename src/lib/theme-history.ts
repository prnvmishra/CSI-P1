import { db, auth } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { THEME_PRESETS } from './constants';

export interface ThemeHistoryEntry {
  id?: string;
  themeId: string;
  themeName: string;
  timestamp: Timestamp;
  userId: string;
}

// Store theme selection in Firebase
export async function recordThemeSelection(themeId: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('User not logged in, theme history not recorded');
      return;
    }
    
    // Find theme name from ID
    const theme = THEME_PRESETS.find(preset => preset.id === themeId);
    if (!theme) {
      console.error(`Theme with ID ${themeId} not found`);
      return;
    }
    
    const themeHistoryRef = collection(db, 'themeHistory');
    await addDoc(themeHistoryRef, {
      themeId,
      themeName: theme.name,
      timestamp: Timestamp.now(),
      userId: user.uid
    });
    
    console.log(`Theme selection ${themeId} recorded for user ${user.uid}`);
  } catch (error) {
    console.error('Error recording theme selection:', error);
  }
}

// Get theme history for current user
export async function getUserThemeHistory(): Promise<ThemeHistoryEntry[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('User not logged in, cannot fetch theme history');
      return [];
    }
    
    const themeHistoryRef = collection(db, 'themeHistory');
    const q = query(
      themeHistoryRef, 
      where('userId', '==', user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const history: ThemeHistoryEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<ThemeHistoryEntry, 'id'>;
      history.push({
        id: doc.id,
        ...data
      });
    });
    
    // Sort in memory by timestamp in descending order
    history.sort((a, b) => {
      const timeA = a.timestamp?.seconds || 0;
      const timeB = b.timestamp?.seconds || 0;
      return timeB - timeA;
    });
    
    return history;
  } catch (error) {
    console.error('Error fetching theme history:', error);
    return [];
  }
}

// Get theme usage statistics for the current user
export async function getUserThemeStats(limit: number = 5): Promise<{themeId: string, themeName: string, name: string, count: number}[]> {
  try {
    const history = await getUserThemeHistory();
    
    // Count occurrences of each theme
    const themeCounts = history.reduce((acc, entry) => {
      const { themeId, themeName } = entry;
      if (!acc[themeId]) {
        acc[themeId] = { 
          themeId, 
          themeName, 
          name: themeName, // Add name property for consistency
          count: 0 
        };
      }
      acc[themeId].count++;
      return acc;
    }, {} as Record<string, {themeId: string, themeName: string, name: string, count: number}>);
    
    // Convert to array, sort by count (descending) and limit results
    return Object.values(themeCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting theme stats:', error);
    return [];
  }
}