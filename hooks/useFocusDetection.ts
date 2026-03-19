"use client";

import { useState, useEffect, useCallback } from "react";

type DistractionLevel = "none" | "gentle" | "loud";

interface UseFocusDetectionOptions {
    isRunning: boolean;
    isFocusSession: boolean;
    onDistraction: () => void;
}

export function useFocusDetection({ isRunning, isFocusSession, onDistraction }: UseFocusDetectionOptions) {
    const [distractionLevel, setDistractionLevel] = useState<DistractionLevel>("none");
    const [showOverlay, setShowOverlay] = useState(false);

    const triggerDistraction = useCallback(() => {
        if (!isRunning || !isFocusSession) return;
        onDistraction();
        setDistractionLevel("gentle");
        setTimeout(() => {
            setDistractionLevel(prev => prev !== "none" ? "loud" : "none");
            setShowOverlay(prev => prev ? prev : true);
        }, 4000);
    }, [isRunning, isFocusSession, onDistraction]);

    // Tab visibility + window blur
    useEffect(() => {
        const onVisibilityChange = () => { if (document.hidden) triggerDistraction(); };
        const onBlur = () => triggerDistraction();
        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("blur", onBlur);
        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange);
            window.removeEventListener("blur", onBlur);
        };
    }, [triggerDistraction]);

    // Mouse/keyboard idle (90s)
    useEffect(() => {
        if (!isRunning) return;
        let idleTimer: ReturnType<typeof setTimeout>;
        const resetIdle = () => {
            clearTimeout(idleTimer);
            if (distractionLevel !== "none") {
                setDistractionLevel("none");
                setShowOverlay(false);
            }
            idleTimer = setTimeout(triggerDistraction, 90000);
        };
        window.addEventListener("mousemove", resetIdle);
        window.addEventListener("keydown", resetIdle);
        return () => {
            window.removeEventListener("mousemove", resetIdle);
            window.removeEventListener("keydown", resetIdle);
            clearTimeout(idleTimer);
        };
    }, [isRunning, distractionLevel, triggerDistraction]);

    const dismissOverlay = useCallback(() => {
        setShowOverlay(false);
        setDistractionLevel("none");
    }, []);

    return {
        distractionLevel,
        showOverlay,
        dismissOverlay,
    };
}
