import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { HistoryItem, Badge } from '@/lib/types';
import { ALL_ACHIEVEMENTS } from '@/lib/constants';

interface StyleState {
  history: HistoryItem[];
  historyIndex: number;
  achievements: Badge[];
  uniquePrompts: Set<string>;
  bodyClasses: string;
  setBodyClasses: (classes: string) => void;
  applyNewCommands: (commands: HistoryItem, prompt: string) => void;
  undo: () => void;
  redo: () => void;
  addAchievement: (id: keyof typeof ALL_ACHIEVEMENTS) => void;
  checkAndApplyAchievements: (promptCount: number, themes: Set<string>) => void;
}

export const useStyleStore = create<StyleState>()(
  devtools(
    persist(
      (set, get) => ({
        history: [[]], // Start with an empty base state
        historyIndex: 0,
        achievements: Object.entries(ALL_ACHIEVEMENTS).map(([id, rest]) => ({ ...rest, id: id as Badge['id'], achieved: false })),
        uniquePrompts: new Set(),
        bodyClasses: '',

        setBodyClasses: (classes: string) => set({ bodyClasses: classes }),

        applyNewCommands: (commands, prompt) => {
          set(state => {
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push(commands);
            
            const newUniquePrompts = new Set(state.uniquePrompts);
            if(prompt) newUniquePrompts.add(prompt.toLowerCase().trim());

            return {
              history: newHistory,
              historyIndex: newHistory.length - 1,
              uniquePrompts: newUniquePrompts,
            };
          });
          get().checkAndApplyAchievements(get().uniquePrompts.size, new Set());
        },
        
        undo: () => {
          set(state => ({
            historyIndex: Math.max(0, state.historyIndex - 1),
          }));
        },

        redo: () => {
          set(state => ({
            historyIndex: Math.min(state.history.length - 1, state.historyIndex + 1),
          }));
        },

        addAchievement: (id) => {
          set(state => ({
            achievements: state.achievements.map(a =>
              a.id === id ? { ...a, achieved: true } : a
            ),
          }));
        },

        checkAndApplyAchievements: (promptCount, themes) => {
          const { addAchievement } = get();
          if (promptCount >= 1) addAchievement('PROMPT_NOVICE');
          if (promptCount >= 5) addAchievement('PROMPT_EXPLORER');
          if (promptCount >= 15) addAchievement('PROMPT_MASTER');

          const appliedThemes = new Set<string>();
          get().history.forEach(h => {
            h.forEach(cmd => {
                if(cmd.startsWith('apply-theme:')) {
                    appliedThemes.add(cmd.split(':')[1]);
                }
            })
          });

          if (appliedThemes.size >= 4) {
            addAchievement('THEME_MASTER');
          }
        }
      }),
      {
        name: 'promptalizer-storage',
        partialize: (state) => ({ 
            achievements: state.achievements,
            uniquePrompts: state.uniquePrompts,
            // Don't persist history to start fresh on reload
        }),
        // Custom serialization for Set
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const { state, version } = JSON.parse(str);
            return {
              state: {
                ...state,
                uniquePrompts: new Set(state.uniquePrompts),
              },
              version,
            };
          },
          setItem: (name, value) => {
            const str = JSON.stringify({
              state: {
                ...value.state,
                uniquePrompts: Array.from(value.state.uniquePrompts as Set<any>),
              },
              version: value.version,
            });
            localStorage.setItem(name, str);
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
      }
    )
  )
);
