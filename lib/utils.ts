import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isToday, isYesterday, differenceInCalendarDays } from "date-fns";

// ─── Tailwind class merger ─────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ─── Date helpers ──────────────────────────────────────────────────────────
export function formatDate(dateStr: string): string {
    const d = parseISO(dateStr);
    if (isToday(d)) return "Today";
    if (isYesterday(d)) return "Yesterday";
    return format(d, "MMM d, yyyy");
}

export function getTodayStr(): string {
    return format(new Date(), "yyyy-MM-dd");
}

export function getDateStr(date: Date): string {
    return format(date, "yyyy-MM-dd");
}

export function getLastNDays(n: number): string[] {
    const days: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(getDateStr(d));
    }
    return days;
}

// ─── Timer helpers ─────────────────────────────────────────────────────────
export function formatSeconds(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Streak helpers ────────────────────────────────────────────────────────
export function calculateStreak(completedDates: string[]): number {
    if (!completedDates.length) return 0;
    const sorted = [...completedDates].sort().reverse();
    let streak = 0;
    let current = new Date();

    for (const dateStr of sorted) {
        const d = parseISO(dateStr);
        const diff = differenceInCalendarDays(current, d);
        if (diff === 0 || diff === 1) {
            streak++;
            current = d;
        } else {
            break;
        }
    }
    return streak;
}

// ─── Color helpers ────────────────────────────────────────────────────────
export const COLORS = [
    "#39ff14", "#ff44cc", "#00dd88", "#ffcc00",
    "#00ccff", "#ff4455", "#00ffaa", "#eebb00"
];

export const HABIT_ICONS = [
    "💪", "📚", "🧘", "🏃", "💧", "🥗", "😴", "🎨",
    "🎵", "💻", "✍️", "🌿", "🏊", "🧠", "❤️", "⭐",
];

// ─── Percentage helper ────────────────────────────────────────────────────
export function pct(value: number, total: number): number {
    if (!total) return 0;
    return Math.round((value / total) * 100);
}

// ─── Generate ID (client-side) ────────────────────────────────────────────
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Clamp ────────────────────────────────────────────────────────────────
export function clamp(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
}
