"use client";

import React, { useState, useEffect } from "react";

import { format } from "date-fns";
import { useStudentStore } from "@/lib/store";
import { Card, Badge, ProgressBar } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const TIMER_DURATIONS = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

export default function DashboardPage() {
    // ─── Global State ──────────────────────────────────────────────────────
    const { courses, timetable, assessments, tasks, resources, toggleTask } = useStudentStore();

    // ─── Local State ───────────────────────────────────────────────────────
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMounted, setIsMounted] = useState(false);
    const [timerMode, setTimerMode] = useState<TimerMode>('pomodoro');
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.pomodoro);
    const [timerIsActive, setTimerIsActive] = useState(false);

    // ─── Effects ───────────────────────────────────────────────────────────
    useEffect(() => {
        setIsMounted(true);
        const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (timerIsActive && timeLeft > 0) {
            intervalId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setTimerIsActive(false);
        }
        return () => clearInterval(intervalId);
    }, [timerIsActive, timeLeft]);

    // ─── Handlers ──────────────────────────────────────────────────────────
    const handleTimerToggle = () => setTimerIsActive(!timerIsActive);
    const handleTimerReset = () => { setTimerIsActive(false); setTimeLeft(TIMER_DURATIONS[timerMode]); };
    const handleModeChange = (mode: TimerMode) => { setTimerMode(mode); setTimerIsActive(false); setTimeLeft(TIMER_DURATIONS[mode]); };

    const formatTimerTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-6 space-y-6 max-w-screen-2xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            {/* Top Banner & Title */}
            <div className="space-y-4">
                <div className="w-full h-48 rounded-[2px] border-2 border-surface-400/40 relative overflow-hidden flex items-end">
                    <Image src="/banner.gif" alt="Banner" fill className="object-cover" unoptimized />
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow">
                        <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="0" width="4" height="2" fill="white"/>
                            <rect x="2" y="2" width="2" height="2" fill="white"/>
                            <rect x="12" y="2" width="2" height="2" fill="white"/>
                            <rect x="0" y="6" width="2" height="4" fill="white"/>
                            <rect x="14" y="6" width="2" height="4" fill="white"/>
                            <rect x="6" y="14" width="4" height="2" fill="white"/>
                            <rect x="2" y="12" width="2" height="2" fill="white"/>
                            <rect x="12" y="12" width="2" height="2" fill="white"/>
                            <rect x="6" y="6" width="4" height="4" fill="#39ff14"/>
                        </svg>
                    </div>
                    <h1 className="font-display font-bold text-xl text-text-primary">TrackBit</h1>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Column 1: Classes & Timetable */}
                <div className="lg:col-span-4 space-y-6">
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-400 ml-1">Classes</h2>
                            <Link href="/courses" className="text-xs text-text-muted/60 hover:text-brand-400 transition-none">View All →</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {courses.map(course => (
                                <Card key={course.id} className="p-3 bg-surface-800 hover:border-brand-500/20 transition-none">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-none bg-brand-500"></div>
                                        <h3 className="text-sm font-bold text-text-primary">{course.name}</h3>
                                    </div>
                                    <div className="space-y-1 mb-3">
                                        <p className="text-xs text-text-muted/70">{course.assignmentsLeft} Assignments Left</p>
                                        <p className="text-xs text-text-muted/70">{course.tasksLeft} Tasks Left</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-text-muted/60 w-8">{Math.round(course.progressPercentage)}%</span>
                                        <ProgressBar value={course.progressPercentage} max={100} color="brand" className="h-1.5" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-400 ml-1">Timetable</h2>
                            <Link href="/timetable" className="text-xs text-text-muted/60 hover:text-brand-400 transition-none">View All →</Link>
                        </div>
                        <Card className="p-4 bg-surface-800 overflow-hidden">
                            <div className="grid grid-cols-6 gap-2 text-xs font-bold text-text-muted/60 mb-3">
                                <div>Time</div>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (<div key={day}>{day}</div>))}
                            </div>
                            <div className="space-y-3">
                                {['09:00-10:00', '10:00-11:00', '11:00-12:00'].map(timeSlot => {
                                    const start = timeSlot.split('-')[0];
                                    return (
                                        <div key={timeSlot} className="grid grid-cols-6 gap-2 text-xs border-t-2 border-surface-400/30 pt-3">
                                            <div className="text-text-muted/60">{timeSlot}</div>
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => {
                                                const event = timetable.find(e => e.dayOfWeek === day && e.startTime === start);
                                                const course = event ? courses.find(c => c.id === event.course_id) : null;
                                                return (
                                                    <div key={day} className="flex">
                                                        {course ? (
                                                            <div className="flex items-center gap-1.5 bg-brand-600/10 text-brand-300 px-2 py-1 rounded-[2px] w-full border-2 border-brand-500/20">
                                                                <div className="w-1.5 h-1.5 rounded-none bg-brand-500"></div>
                                                                <span className="truncate">{course.name}</span>
                                                            </div>
                                                        ) : (<div className="px-2 py-1 text-text-muted/30">-</div>)}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </section>
                </div>

                {/* Column 2: Assessments, Tasks, Resources */}
                <div className="lg:col-span-6 space-y-6">
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-400 ml-1">Upcoming Assessments</h2>
                            <Link href="/assessments" className="text-xs text-text-muted/60 hover:text-brand-400 transition-none">View All →</Link>
                        </div>
                        <div className="grid grid-cols-4 gap-3 mb-4">
                            {assessments.filter(a => a.type === 'Exam').slice(0, 4).map(exam => {
                                const course = courses.find(c => c.id === exam.course_id);
                                return (
                                    <Card key={exam.id} className="p-3 bg-surface-800 border-l-2 border-l-brand-500">
                                        <p className="text-xs font-bold text-text-primary mb-1 truncate">{exam.name}</p>
                                        <div className="flex items-center gap-1 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-none bg-brand-500"></div>
                                            <p className="text-2xs text-text-muted/70 truncate">{course?.name}</p>
                                        </div>
                                        <p className="text-2xs text-brand-400/80 mb-1">{format(new Date(exam.dueDate), "MMMM d, yyyy")}</p>
                                        <p className="text-2xs text-accent-400 font-bold">Due soon</p>
                                    </Card>
                                );
                            })}
                        </div>
                        <Card className="bg-surface-800 overflow-hidden">
                            <div className="grid grid-cols-12 gap-2 p-3 border-b-2 border-surface-400/30 text-xs font-bold text-text-muted/70">
                                <div className="col-span-2">Deadline</div>
                                <div className="col-span-4">Name</div>
                                <div className="col-span-2">Type</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Course</div>
                            </div>
                            <div className="divide-y-2 divide-surface-400/20">
                                {assessments.filter(a => a.type === 'Assignment').slice(0, 5).map(assignment => {
                                    const course = courses.find(c => c.id === assignment.course_id);
                                    return (
                                        <div key={assignment.id} className="grid grid-cols-12 gap-2 p-3 items-center text-xs min-w-0">
                                            <div className="col-span-2 text-text-primary/90 truncate">Pending</div>
                                            <div className="col-span-4 text-text-primary font-bold flex items-center gap-2 min-w-0"><span className="text-text-muted/60 shrink-0">📝</span> <span className="truncate">{assignment.name}</span></div>
                                            <div className="col-span-2 min-w-0"><Badge variant="neutral" className="bg-surface-700 truncate block text-center">{assignment.type}</Badge></div>
                                            <div className="col-span-2 min-w-0">
                                                <Badge variant={assignment.status === 'Completed' ? 'success' : assignment.status === 'In progress' ? 'brand' : 'danger'} className="truncate block text-center">{assignment.status}</Badge>
                                            </div>
                                            <div className="col-span-2 flex items-center gap-1.5 min-w-0">
                                                <div className="w-1.5 h-1.5 rounded-none bg-brand-500 shrink-0"></div>
                                                <span className="text-text-muted/90 truncate">{course?.name}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-400 ml-1">Tasks</h2>
                            <Link href="/tasks" className="text-xs text-text-muted/60 hover:text-brand-400 transition-none">View All →</Link>
                        </div>
                        <Card className="bg-surface-800 overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 p-3 border-b-2 border-surface-400/30 text-xs font-bold text-text-muted/70">
                                <div className="col-span-4">Name</div>
                                <div className="col-span-2">Date</div>
                                <div className="col-span-2">Effort</div>
                                <div className="col-span-2">Impact</div>
                                <div className="col-span-2">Priority</div>
                            </div>
                            <div className="divide-y-2 divide-surface-400/20 max-h-64 overflow-y-auto scrollbar-hide">
                                {tasks.map(task => (
                                    <div key={task.id} className={cn("grid grid-cols-12 gap-4 p-3 items-center text-xs transition-none hover:bg-surface-700/50", task.completed && "opacity-60")}>
                                        <label className="col-span-4 flex items-center gap-2 text-text-primary font-bold cursor-pointer">
                                            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="rounded-[2px] border-surface-400 bg-surface-900 text-brand-500 focus:ring-brand-500/20 cursor-pointer" />
                                            <span className={cn(task.completed && "line-through text-text-muted/60")}>{task.title}</span>
                                        </label>
                                        <div className="col-span-2 text-text-muted/70">{format(new Date(task.date), "MMM d, yyyy")}</div>
                                        <div className="col-span-2 text-text-primary/90">{task.effort}</div>
                                        <div className="col-span-2 text-text-primary/90">{task.impact}</div>
                                        <div className="col-span-2 flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (<span key={i} className={i < (task.priority || 0) ? "text-brand-400" : "text-text-muted/30"}>★</span>))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-400 ml-1">Resources</h2>
                            <Link href="/resources" className="text-xs text-text-muted/60 hover:text-brand-400 transition-none">View All →</Link>
                        </div>
                        <Card className="bg-surface-800 overflow-hidden">
                            <div className="divide-y-2 divide-surface-400/20">
                                {resources.map(resource => (
                                    <div key={resource.id} className="flex items-center justify-between p-3 text-xs hover:bg-surface-700/50 transition-none cursor-pointer">
                                        <div className="flex items-center gap-2 text-text-primary font-bold"><span className="text-text-muted/60">📑</span> {resource.title}</div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-text-muted/60 capitalize">{resource.type}</span>
                                            <Badge variant="neutral" className="bg-surface-700">{resource.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </section>
                </div>

                {/* Column 3: Clock & Pomodoro */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-brand-500 text-surface-900 overflow-hidden relative border-2 border-brand-400/50">
                        <div className="p-3 relative z-10">
                            <div className="grid grid-cols-2 gap-2 text-center text-3xl font-display font-bold tabular-nums">
                                <div className="bg-brand-400/30 p-1.5 rounded-[2px] tracking-wider">{isMounted ? format(currentTime, "hh") : "--"}</div>
                                <div className="bg-brand-400/30 p-1.5 rounded-[2px] tracking-wider">{isMounted ? format(currentTime, "mm") : "--"}</div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-[10px] font-bold uppercase tracking-widest text-surface-900/70">
                                <span>{isMounted ? format(currentTime, "a") : "--"}</span>
                                <span>{isMounted ? format(currentTime, "EEEE") : "..."}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-3 bg-surface-800 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-900/20 mix-blend-overlay"></div>
                        <div className="relative z-10 flex flex-col items-center w-full">
                            <div className="flex flex-col gap-1 w-full mb-3">
                                {(['pomodoro', 'shortBreak', 'longBreak'] as TimerMode[]).map((mode) => (
                                    <button key={mode} onClick={() => handleModeChange(mode)}
                                        className={cn("w-full py-1 rounded-[2px] text-[10px] font-bold transition-none text-center uppercase tracking-wider",
                                            timerMode === mode ? "bg-white text-surface-900 shadow-glow" : "bg-transparent border-2 border-surface-400/40 text-text-primary hover:bg-surface-700"
                                        )}>
                                        {mode === 'pomodoro' ? 'Pomodoro' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                                    </button>
                                ))}
                            </div>
                            <div className={cn("text-3xl font-display font-bold text-text-primary tabular-nums tracking-tight mb-3", timerIsActive && timeLeft <= 60 && "text-danger-400 animate-pulse")}>
                                {formatTimerTime(timeLeft)}
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleTimerToggle}
                                    className={cn("px-4 py-1.5 rounded-[2px] font-bold text-xs uppercase tracking-wider transition-none border-2",
                                        timerIsActive ? "bg-warning-500 text-surface-900 border-warning-400/50 shadow-glow-accent" : "bg-white text-surface-900 border-surface-400/400"
                                    )}>
                                    {timerIsActive ? "Pause" : "Start"}
                                </button>
                                <button onClick={handleTimerReset} className="w-8 h-8 rounded-[2px] bg-surface-700 border-2 border-surface-400/40 flex items-center justify-center text-text-primary hover:bg-surface-600 transition-none" title="Reset">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path strokeLinecap="butt" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
