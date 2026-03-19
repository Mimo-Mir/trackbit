"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useStudentStore, generateId } from "@/lib/store";
import type { SessionType } from "@/types";

const DEFAULT_DURATIONS: Record<SessionType, number> = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

export function useTimer() {
    const { timerSettings, addFocusSession } = useStudentStore();
    const durations: Record<SessionType, number> = {
        focus: timerSettings.focusDuration * 60,
        shortBreak: timerSettings.shortBreakDuration * 60,
        longBreak: timerSettings.longBreakDuration * 60,
    };

    const [sessionType, setSessionType] = useState<SessionType>("focus");
    const [timeRemaining, setTimeRemaining] = useState(durations.focus);
    const [isRunning, setIsRunning] = useState(false);
    const [completedSessions, setCompletedSessions] = useState(0);
    const [distractionCount, setDistractionCount] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const sessionStartRef = useRef<string | null>(null);

    const duration = durations[sessionType] || DEFAULT_DURATIONS[sessionType];
    const progress = 1 - timeRemaining / duration;

    // Timer tick
    useEffect(() => {
        if (isRunning) {
            if (!sessionStartRef.current) {
                sessionStartRef.current = new Date().toISOString();
            }
            intervalRef.current = setInterval(() => {
                setTimeRemaining(t => {
                    if (t <= 1) {
                        clearInterval(intervalRef.current!);
                        setIsRunning(false);
                        setCompletedSessions(c => c + 1);
                        // Persist the completed session
                        addFocusSession({
                            id: `fs-${generateId()}`,
                            duration_minutes: Math.round(duration / 60),
                            distraction_count: distractionCount,
                            session_type: sessionType,
                            started_at: sessionStartRef.current!,
                            ended_at: new Date().toISOString(),
                        });
                        sessionStartRef.current = null;
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, sessionType, duration, distractionCount, addFocusSession]);

    const start = useCallback(() => setIsRunning(true), []);
    const pause = useCallback(() => setIsRunning(false), []);
    const reset = useCallback(() => {
        setIsRunning(false);
        setTimeRemaining(duration);
        setDistractionCount(0);
        sessionStartRef.current = null;
    }, [duration]);

    const skip = useCallback(() => {
        setIsRunning(false);
        const next: SessionType = sessionType === "focus" ? "shortBreak" : "focus";
        setSessionType(next);
        setTimeRemaining(durations[next]);
        setDistractionCount(0);
        sessionStartRef.current = null;
    }, [sessionType, durations]);

    const changeSession = useCallback((type: SessionType) => {
        setSessionType(type);
        setIsRunning(false);
        setTimeRemaining(durations[type]);
        setDistractionCount(0);
        sessionStartRef.current = null;
    }, [durations]);

    const incrementDistraction = useCallback(() => {
        setDistractionCount(c => c + 1);
    }, []);

    return {
        sessionType,
        timeRemaining,
        isRunning,
        completedSessions,
        distractionCount,
        progress,
        duration,
        start,
        pause,
        reset,
        skip,
        changeSession,
        incrementDistraction,
    };
}
