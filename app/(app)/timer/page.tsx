"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, Eye, MousePointer, Monitor } from "lucide-react";
import { mockFocusSessions } from "@/lib/mockData";
import { Card, Badge } from "@/components/ui/primitives";
import { formatSeconds, cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { SessionType } from "@/types";

const SESSION_CONFIG = {
    focus: { label: "Focus", duration: 25 * 60, color: "brand" },
    shortBreak: { label: "Short Break", duration: 5 * 60, color: "success" },
    longBreak: { label: "Long Break", duration: 15 * 60, color: "accent" },
} as const;

const DISTRACTION_LEVELS = {
    none: { label: "Focused", color: "text-success-400", bg: "bg-success-500/10" },
    gentle: { label: "Mild drift...", color: "text-warning-400", bg: "bg-warning-500/10" },
    loud: { label: "Hey! Focus!", color: "text-danger-400", bg: "bg-danger-500/10" },
} as const;

type DistractionLevel = keyof typeof DISTRACTION_LEVELS;

export default function TimerPage() {
    const [sessionType, setSessionType] = useState<SessionType>("focus");
    const [timeRemaining, setTimeRemaining] = useState(SESSION_CONFIG.focus.duration);
    const [isRunning, setIsRunning] = useState(false);
    const [distractionCount, setDistractionCount] = useState(0);
    const [distractionLevel, setDistractionLevel] = useState<DistractionLevel>("none");
    const [showOverlay, setShowOverlay] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [completedSessions, setCompletedSessions] = useState(2);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const session = SESSION_CONFIG[sessionType];
    const progress = 1 - timeRemaining / session.duration;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    const triggerDistraction = useCallback(() => {
        if (!isRunning || sessionType !== "focus") return;
        setDistractionCount(c => c + 1);
        setDistractionLevel("gentle");
        setTimeout(() => {
            setDistractionLevel(prev => prev !== "none" ? "loud" : "none");
            setShowOverlay(prev => prev ? prev : true);
        }, 4000);
    }, [isRunning, sessionType]);

    // Timer tick
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining(t => {
                    if (t <= 1) {
                        clearInterval(intervalRef.current!);
                        setIsRunning(false);
                        setCompletedSessions(c => c + 1);
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current!);
        }
        return () => clearInterval(intervalRef.current!);
    }, [isRunning]);

    // Distraction detection
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

    // Mouse idle
    useEffect(() => {
        if (!isRunning) return;
        let idleTimer: ReturnType<typeof setTimeout>;
        const resetIdle = () => {
            clearTimeout(idleTimer);
            if (distractionLevel !== "none") {
                setDistractionLevel("none");
                setShowOverlay(false);
            }
            idleTimer = setTimeout(triggerDistraction, 90000); // 90s idle
        };
        window.addEventListener("mousemove", resetIdle);
        window.addEventListener("keydown", resetIdle);
        return () => {
            window.removeEventListener("mousemove", resetIdle);
            window.removeEventListener("keydown", resetIdle);
            clearTimeout(idleTimer);
        };
    }, [isRunning, distractionLevel, triggerDistraction]);

    const handleStart = () => setIsRunning(true);
    const handlePause = () => setIsRunning(false);
    const handleReset = () => { setIsRunning(false); setTimeRemaining(session.duration); setDistractionLevel("none"); setShowOverlay(false); };
    const handleSkip = () => {
        setIsRunning(false);
        const next: SessionType = sessionType === "focus" ? "shortBreak" : "focus";
        setSessionType(next);
        setTimeRemaining(SESSION_CONFIG[next].duration);
    };
    const handleSessionChange = (type: SessionType) => {
        setSessionType(type);
        setIsRunning(false);
        setTimeRemaining(SESSION_CONFIG[type].duration);
        setDistractionLevel("none");
        setShowOverlay(false);
    };

    const ringColor = {
        brand: "#39ff14",
        success: "#00dd88",
        accent: "#ff44cc",
    }[session.color];

    const distInfo = DISTRACTION_LEVELS[distractionLevel];

    return (
        <div className="p-6 max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="font-display font-bold text-sm text-text-primary uppercase tracking-widest">Focus Timer</h1>
                <p className="text-sm text-text-muted/70 mt-0.5">Deep work sessions with distraction detection.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Timer Circle ─────────────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Session Type */}
                    <div className="flex justify-center">
                        <div className="flex bg-surface-800 border-2 border-surface-400/40 rounded-[2px] p-1 gap-0.5">
                            {(Object.entries(SESSION_CONFIG) as [SessionType, typeof SESSION_CONFIG[SessionType]][]).map(([key, { label }]) => (
                                <button
                                    key={key}
                                    onClick={() => handleSessionChange(key)}
                                    className={cn(
                                        "px-5 py-2 rounded-[2px] text-sm font-bold uppercase tracking-wider transition-none",
                                        sessionType === key
                                            ? "bg-brand-600 text-text-primary shadow-glow"
                                            : "text-text-muted/60 hover:text-text-muted/90"
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SVG Ring Timer */}
                    <div className="flex flex-col items-center">
                        <div className={cn(
                            "relative transition-none",
                            distractionLevel === "loud" && "animate-pulse-slow"
                        )}>
                            <svg width="220" height="220" viewBox="0 0 280 280">
                                {/* Background ring */}
                                <circle
                                    cx="140" cy="140" r={radius}
                                    fill="none"
                                    stroke="rgba(255,255,255,0.08)"
                                    strokeWidth="6"
                                />
                                {/* Progress ring */}
                                <circle
                                    cx="140" cy="140" r={radius}
                                    fill="none"
                                    stroke={distractionLevel === "loud" ? "#ff2233" : ringColor}
                                    strokeWidth="6"
                                    strokeLinecap="butt"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    transform="rotate(-90 140 140)"
                                    style={{ transition: "stroke-dashoffset 1s steps(60), stroke 0.5s" }}
                                />
                                {/* Glow overlay */}
                                <circle
                                    cx="140" cy="140" r={radius}
                                    fill="none"
                                    stroke={distractionLevel === "loud" ? "#ff2233" : ringColor}
                                    strokeWidth="2"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    transform="rotate(-90 140 140)"
                                    opacity="0.3"
                                    filter="blur(4px)"
                                    style={{ transition: "stroke-dashoffset 1s steps(60), stroke 0.5s" }}
                                />
                            </svg>

                            {/* Center text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className={cn(
                                    "font-display font-bold text-4xl tabular-nums transition-none duration-500",
                                    distractionLevel === "loud" ? "text-danger-400" : "text-text-primary"
                                )}>
                                    {formatSeconds(timeRemaining)}
                                </p>
                                <p className="text-sm text-text-muted/70 mt-1 font-medium">{session.label}</p>
                                <div className={cn(
                                    "mt-2 px-3 py-0.5 rounded-[2px] text-xs font-bold transition-none",
                                    distInfo.bg, distInfo.color
                                )}>
                                    {distInfo.label}
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4 mt-4">
                            <button
                                onClick={handleReset}
                                className="w-12 h-12 rounded-[2px] bg-surface-700 border-2 border-surface-400/50 flex items-center justify-center text-text-muted/70 hover:text-text-primary hover:bg-surface-600 transition-none"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>

                            <button
                                onClick={isRunning ? handlePause : handleStart}
                                className={cn(
                                    "w-16 h-16 rounded-[2px] flex items-center justify-center text-text-primary text-xl font-bold transition-none",
                                    isRunning
                                        ? "bg-surface-600 border-2 border-surface-400/50 hover:bg-surface-500"
                                        : "bg-brand-600 hover:bg-brand-500 shadow-glow hover:shadow-[0_0_32px_6px_rgba(34,197,94,0.4)]"
                                )}
                            >
                                {isRunning
                                    ? <Pause className="w-6 h-6" />
                                    : <Play className="w-6 h-6 ml-0.5" />
                                }
                            </button>

                            <button
                                onClick={handleSkip}
                                className="w-12 h-12 rounded-[2px] bg-surface-700 border-2 border-surface-400/50 flex items-center justify-center text-text-muted/70 hover:text-text-primary hover:bg-surface-600 transition-none"
                            >
                                <SkipForward className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Distraction Indicators */}
                        <div className="flex items-center gap-6 mt-6 text-xs text-text-muted/60">
                            <div className="flex items-center gap-1.5">
                                <Eye className={cn("w-4 h-4", distractionLevel !== "none" ? "text-warning-400" : "text-text-muted/40")} />
                                Tab Focus
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MousePointer className="w-4 h-4 text-text-muted/40" />
                                Mouse Active
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Monitor className="w-4 h-4 text-text-muted/40" />
                                Window Focus
                            </div>
                            <button onClick={() => setIsMuted(!isMuted)} className="flex items-center gap-1.5 hover:text-text-muted/90 transition-none">
                                {isMuted
                                    ? <VolumeX className="w-4 h-4" />
                                    : <Volume2 className="w-4 h-4" />
                                }
                                Sound
                            </button>
                        </div>
                    </div>

                    {/* Session history */}
                    <Card className="p-4">
                        <h3 className="text-sm font-bold text-text-primary mb-3">Today&apos;s Sessions</h3>
                        <div className="space-y-2">
                            {mockFocusSessions.map(s => (
                                <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-[2px] bg-surface-700/50">
                                    <div className={cn(
                                        "w-2 h-2 rounded-[2px] shrink-0",
                                        s.session_type === "focus" ? "bg-brand-400" : "bg-success-400"
                                    )} />
                                    <p className="text-xs text-text-muted/90 flex-1">
                                        {s.session_type === "focus" ? "Focus" : "Break"} — {s.duration_minutes}min
                                    </p>
                                    {s.distraction_count > 0 && (
                                        <Badge variant="warning">{s.distraction_count} distractions</Badge>
                                    )}
                                    <span className="text-2xs text-text-muted/50">
                                        {format(parseISO(s.started_at), "h:mm a")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* ── Right Sidebar Stats ───────────────────────────────────────── */}
                <div className="space-y-4">
                    <Card className="p-4">
                        <h3 className="text-xs font-bold text-text-muted/70 uppercase tracking-wider mb-3">Session Stats</h3>
                        <div className="space-y-3">
                            {[
                                { label: "Completed Today", value: completedSessions, sub: "sessions" },
                                { label: "Distractions", value: distractionCount, sub: "this session" },
                                { label: "Focus Time", value: "75", sub: "minutes today" },
                                { label: "Longest Session", value: "25", sub: "minutes" },
                            ].map(({ label, value, sub }) => (
                                <div key={label} className="flex items-center justify-between">
                                    <p className="text-xs text-text-muted/70">{label}</p>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-text-primary">{value}</span>
                                        <span className="text-2xs text-text-muted/50 ml-1">{sub}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Pomodoro progress dots */}
                    <Card className="p-4">
                        <h3 className="text-xs font-bold text-text-muted/70 uppercase tracking-wider mb-3">Pomodoro Cycle</h3>
                        <div className="flex gap-2">
                            {[0, 1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex-1 h-2 rounded-[2px] transition-none",
                                        i < (completedSessions % 4) ? "bg-brand-500" : "bg-surface-600"
                                    )}
                                />
                            ))}
                        </div>
                        <p className="text-2xs text-text-muted/50 mt-2">
                            {4 - (completedSessions % 4)} sessions until long break
                        </p>
                    </Card>

                    {/* Distraction tips */}
                    <Card className="p-4 bg-gradient-to-br from-surface-800 to-surface-700">
                        <h3 className="text-xs font-bold text-text-muted/70 uppercase tracking-wider mb-3">Focus Tips</h3>
                        <div className="space-y-2">
                            {[
                                "Put your phone in another room",
                                "Use noise-cancelling headphones",
                                "Close all unrelated tabs",
                                "Set a clear session intention",
                            ].map((tip, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="text-brand-400 text-xs mt-0.5">→</span>
                                    <p className="text-xs text-text-muted/70">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* ── Distraction Overlay ─────────────────────────────────────────── */}
            {showOverlay && (
                <div className="fixed inset-0 z-50 bg-danger-900/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
                    <div className="text-center space-y-6 p-10 max-w-sm">
                        <div className="text-6xl animate-pulse-slow">👁️</div>
                        <div>
                            <h2 className="font-display font-bold text-xl text-text-primary mb-2">
                                Hey. Come back.
                            </h2>
                            <p className="text-text-muted/90">
                                You drifted away. Your focus session is still running.
                                <br />
                                Take a breath and return.
                            </p>
                        </div>
                        <p className="font-display font-bold text-5xl tabular-nums text-danger-400">
                            {formatSeconds(timeRemaining)}
                        </p>
                        <button
                            onClick={() => { setShowOverlay(false); setDistractionLevel("none"); }}
                            className="btn-primary w-full justify-center text-base py-3"
                        >
                            I&apos;m back — Resume Focus
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
