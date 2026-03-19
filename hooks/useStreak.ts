"use client";

import { useMemo } from "react";
import { calculateStreak } from "@/lib/utils";

export function useStreak(completedDates: string[]) {
    const currentStreak = useMemo(() => {
        return calculateStreak(completedDates);
    }, [completedDates]);

    return { currentStreak };
}

export function useHabitStreak(
    habitId: string,
    habitCompletions: Record<string, Record<string, boolean>>
) {
    const completedDates = useMemo(() => {
        return Object.entries(habitCompletions)
            .filter(([, dayMap]) => dayMap[habitId])
            .map(([date]) => date);
    }, [habitId, habitCompletions]);

    return useStreak(completedDates);
}
