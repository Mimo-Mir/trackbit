import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppLanguage = 'ENGLISH' | 'HINDI';

interface SettingsStore {
  language: AppLanguage;
  timezone: string;
  autoTimezone: boolean;
  dailyReminders: boolean;
  streakAlerts: boolean;
  focusDoNotDisturb: boolean;
  setLanguage: (language: AppLanguage) => void;
  setTimezone: (timezone: string) => void;
  toggleAutoTimezone: () => void;
  toggleDailyReminders: () => void;
  toggleStreakAlerts: () => void;
  toggleFocusDoNotDisturb: () => void;
}

const detectTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      language: 'ENGLISH',
      timezone: detectTimezone(),
      autoTimezone: true,
      dailyReminders: true,
      streakAlerts: true,
      focusDoNotDisturb: false,
      setLanguage: (language) => set({ language }),
      setTimezone: (timezone) => set({ timezone }),
      toggleAutoTimezone: () =>
        set((state) => ({
          autoTimezone: !state.autoTimezone,
          timezone: !state.autoTimezone ? state.timezone : detectTimezone(),
        })),
      toggleDailyReminders: () => set((state) => ({ dailyReminders: !state.dailyReminders })),
      toggleStreakAlerts: () => set((state) => ({ streakAlerts: !state.streakAlerts })),
      toggleFocusDoNotDisturb: () => set((state) => ({ focusDoNotDisturb: !state.focusDoNotDisturb })),
    }),
    { name: 'trackbit-settings' }
  )
);