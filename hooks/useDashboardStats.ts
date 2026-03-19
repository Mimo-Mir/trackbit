"use client";

import { useMemo } from "react";
import { useStudentStore } from "@/lib/store";
import { getTodayStr, getLastNDays, calculateStreak, pct } from "@/lib/utils";
import type { DashboardStats } from "@/types";

export function useDashboardStats(): DashboardStats {
    const { tasks, focusSessions, habits, habitCompletions } = useStudentStore();
    const today = getTodayStr();

    return useMemo(() => {
        // Tasks completed today
        const todayTasks = tasks.filter(t => t.date === today);
        const tasksCompletedToday = todayTasks.filter(t => t.completed).length;
        const totalTasksToday = todayTasks.length;

        // Focus minutes today
        const focusMinutesToday = focusSessions
            .filter(s => s.started_at.startsWith(today) && s.session_type === "focus")
            .reduce((sum, s) => sum + s.duration_minutes, 0);

        // Streak: days where at least one habit was completed
        const allDatesWithCompletions = Object.entries(habitCompletions)
            .filter(([, dayMap]) => Object.values(dayMap).some(Boolean))
            .map(([date]) => date);
        const streakDays = calculateStreak(allDatesWithCompletions);

        // Weekly completion rate
        const last7Days = getLastNDays(7);
        let totalPossible = 0;
        let totalDone = 0;
        for (const day of last7Days) {
            const dayMap = habitCompletions[day] || {};
            totalPossible += habits.length;
            totalDone += Object.values(dayMap).filter(Boolean).length;
        }
        const weeklyCompletionRate = pct(totalDone, totalPossible);

        // Longest streak across all habits
        let longestStreak = streakDays;
        for (const habit of habits) {
            const dates = Object.entries(habitCompletions)
                .filter(([, dayMap]) => dayMap[habit.id])
                .map(([date]) => date);
            const s = calculateStreak(dates);
            if (s > longestStreak) longestStreak = s;
        }

        return {
            streakDays,
            tasksCompletedToday,
            totalTasksToday,
            focusMinutesToday,
            weeklyCompletionRate,
            longestStreak,
        };
    }, [tasks, focusSessions, habits, habitCompletions, today]);
}
