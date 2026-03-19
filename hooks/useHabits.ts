"use client";

import { useMemo } from "react";
import { useStudentStore } from "@/lib/store";
import { getTodayStr, getLastNDays } from "@/lib/utils";

export function useHabits() {
    const { habits, habitCompletions, toggleHabitCompletion } = useStudentStore();

    const today = getTodayStr();

    const todayCompletions = useMemo(() => {
        return habitCompletions[today] || {};
    }, [habitCompletions, today]);

    const getWeeklyGrid = useMemo(() => {
        const days = getLastNDays(7);
        const grid: Record<string, Record<string, boolean>> = {};
        for (const day of days) {
            grid[day] = habitCompletions[day] || {};
        }
        return grid;
    }, [habitCompletions]);

    const weekDays = useMemo(() => getLastNDays(7), []);

    return {
        habits,
        habitCompletions,
        todayCompletions,
        weeklyGrid: getWeeklyGrid,
        weekDays,
        toggleHabitCompletion,
    };
}
