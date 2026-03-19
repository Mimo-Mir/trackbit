import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeId =
  | 'dark'
  | 'light'
  | 'tokyo-night'
  | 'dracula'
  | 'cyberpunk'
  | 'nord'
  | 'solarized-dark'
  | 'solarized-light';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  isDark: boolean;
}

export const themes: Theme[] = [
  { id: 'dark', name: 'Pixel Dark', description: 'Default neon green pixel theme', isDark: true },
  { id: 'light', name: 'Pixel Light', description: 'Clean light mode with pixel aesthetics', isDark: false },
  { id: 'tokyo-night', name: 'Tokyo Night', description: 'Purple and pink inspired by Tokyo nights', isDark: true },
  { id: 'dracula', name: 'Dracula', description: 'Classic dark theme with purple accents', isDark: true },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon orange and hot pink futuristic', isDark: true },
  { id: 'nord', name: 'Nord', description: 'Arctic, north-bluish color palette', isDark: true },
  { id: 'solarized-dark', name: 'Solarized Dark', description: 'Precision colors for dark environments', isDark: true },
  { id: 'solarized-light', name: 'Solarized Light', description: 'Precision colors for light environments', isDark: false },
];

interface ThemeStore {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'trackbit-theme' }
  )
);

export function getTheme(id: ThemeId): Theme {
  return themes.find(t => t.id === id) || themes[0];
}
