"use client";

import { useState, useMemo } from "react";
import { format, parseISO, subDays, eachDayOfInterval } from "date-fns";
import { Plus, Flame, Filter, CheckCircle2, Circle, Trash2, X, Check } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const HEATMAP_COLORS = [
    "bg-surface-700",
    "bg-brand-900/60",
    "bg-brand-700/60",
    "bg-brand-600/80",
    "bg-brand-500",
];

export default function TrackerPage() {
    const {
        habits, tasks, habitCompletions,
        addHabit, deleteHabit,
        addTask, toggleTask, deleteTask,
        toggleHabitCompletion,
    } = useStudentStore();

    const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");
    const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
    const [showHabitForm, setShowHabitForm] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [habitForm, setHabitForm] = useState({ name: '', color: '#39ff14', icon: '🎯', category: '' });
    const [taskForm, setTaskForm] = useState({ title: '', habit_id: '' });

    const today = format(new Date(), "yyyy-MM-dd");

    // Get current week days (Mon-Sun containing today)
    const weekDays = useMemo(() => {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(now);
        monday.setDate(now.getDate() + mondayOffset);
        return eachDayOfInterval({ start: monday, end: new Date(monday.getTime() + 6 * 86400000) })
            .map(d => format(d, "yyyy-MM-dd"));
    }, []);

    // Filter tasks: only today's tasks, optionally by habit
    const todayTasks = useMemo(() => {
        let filtered = tasks.filter(t => t.date === today || t.habit_id);
        // If tasks have habit_id, show the ones for today
        filtered = tasks.filter(t => t.habit_id && t.date === today);
        if (selectedHabit) {
            filtered = filtered.filter(t => t.habit_id === selectedHabit);
        }
        return filtered;
    }, [tasks, today, selectedHabit]);

    // Calculate streak for a habit from habitCompletions
    const getStreak = (habitId: string): number => {
        let streak = 0;
        const d = new Date();
        for (let i = 0; i < 365; i++) {
            const dateStr = format(d, "yyyy-MM-dd");
            if (habitCompletions[dateStr]?.[habitId]) {
                streak++;
            } else if (i > 0) {
                break; // skip today if not yet done, but break on past gaps
            }
            d.setDate(d.getDate() - 1);
        }
        return streak;
    };

    // Heatmap from habitCompletions (last 84 days)
    const heatmapData = useMemo(() => {
        const cells: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] = [];
        const now = new Date();
        const habitCount = habits.length || 1;
        for (let i = 83; i >= 0; i--) {
            const d = subDays(now, i);
            const dateStr = format(d, "yyyy-MM-dd");
            const dayData = habitCompletions[dateStr] || {};
            const count = Object.values(dayData).filter(Boolean).length;
            const ratio = count / habitCount;
            const level = (count === 0 ? 0 : ratio <= 0.25 ? 1 : ratio <= 0.5 ? 2 : ratio <= 0.75 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;
            cells.push({ date: dateStr, count, level });
        }
        return cells;
    }, [habitCompletions, habits.length]);

    const handleAddHabit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!habitForm.name.trim()) return;
        addHabit({ id: `h-${generateId()}`, name: habitForm.name, color: habitForm.color, icon: habitForm.icon, category: habitForm.category, created_at: new Date().toISOString() });
        setHabitForm({ name: '', color: '#39ff14', icon: '🎯', category: '' });
        setShowHabitForm(false);
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskForm.title.trim()) return;
        addTask({ id: `t-${generateId()}`, title: taskForm.title, date: today, completed: false, habit_id: taskForm.habit_id || undefined, order: todayTasks.length + 1 });
        setTaskForm({ title: '', habit_id: '' });
        setShowTaskForm(false);
    };

    const EMOJI_OPTIONS = ['🎯', '🏃', '📚', '🧘', '💧', '✍️', '💪', '🎵', '🍎', '😴', '🧠', '🏋️'];
    const COLOR_OPTIONS = ['#39ff14', '#ff44cc', '#00dd88', '#00ccff', '#ffcc00', '#ff6644', '#aa66ff', '#ff8800'];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Habit Tracker</h1>
                    <p className="text-sm text-text-muted/70 mt-0.5">Track, visualize, and build consistency.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-surface-800 border-2 border-surface-400/40 rounded-[2px] p-1 gap-0.5">
                        {(["daily", "weekly", "monthly"] as const).map(v => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={cn(
                                    "px-4 py-1.5 rounded-[2px] text-xs font-bold capitalize transition-none",
                                    view === v ? "bg-brand-600 text-text-primary shadow-glow" : "text-text-muted/60 hover:text-text-muted/90"
                                )}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                    <Button variant="primary" size="sm" onClick={() => setShowHabitForm(true)}>
                        <Plus className="w-4 h-4" />
                        Add Habit
                    </Button>
                </div>
            </div>

            {/* Add Habit Form */}
            {showHabitForm && (
                <Card className="p-5 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-text-primary">New Habit</h3>
                        <button onClick={() => setShowHabitForm(false)} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={handleAddHabit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-text-muted/70 mb-1">Habit Name</label>
                                <input type="text" value={habitForm.name} onChange={e => setHabitForm({ ...habitForm, name: e.target.value })} placeholder="e.g. Morning Run"
                                    className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus />
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted/70 mb-1">Category</label>
                                <input type="text" value={habitForm.category} onChange={e => setHabitForm({ ...habitForm, category: e.target.value })} placeholder="e.g. fitness, health"
                                    className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1.5">Icon</label>
                            <div className="flex gap-2 flex-wrap">
                                {EMOJI_OPTIONS.map(emoji => (
                                    <button key={emoji} type="button" onClick={() => setHabitForm({ ...habitForm, icon: emoji })}
                                        className={cn("w-9 h-9 rounded-[2px] flex items-center justify-center text-lg border-2 transition-none",
                                            habitForm.icon === emoji ? "border-brand-500 bg-brand-600/20" : "border-surface-400/50 bg-surface-700 hover:border-surface-400/50"
                                        )}>{emoji}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1.5">Color</label>
                            <div className="flex gap-2 flex-wrap">
                                {COLOR_OPTIONS.map(color => (
                                    <button key={color} type="button" onClick={() => setHabitForm({ ...habitForm, color })}
                                        className={cn("w-8 h-8 rounded-[2px] border-2 transition-none",
                                            habitForm.color === color ? "border-white scale-110" : "border-transparent"
                                        )} style={{ backgroundColor: color }} />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none">
                                <Check className="w-4 h-4" /> Create Habit
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Habit Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-text-muted/50 shrink-0" />
                <button
                    onClick={() => setSelectedHabit(null)}
                    className={cn(
                        "px-3 py-1 rounded-[2px] text-xs font-bold border transition-none",
                        !selectedHabit ? "bg-brand-600 text-text-primary border-brand-500" : "bg-surface-700 text-text-muted/70 border-surface-400/50 hover:border-surface-400/50"
                    )}
                >
                    All Habits
                </button>
                {habits.map(habit => (
                    <button
                        key={habit.id}
                        onClick={() => setSelectedHabit(habit.id === selectedHabit ? null : habit.id)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-xs font-bold border transition-none",
                            selectedHabit === habit.id
                                ? "text-text-primary border-transparent"
                                : "bg-surface-700 text-text-muted/70 border-surface-400/50 hover:border-surface-400/50"
                        )}
                        style={selectedHabit === habit.id ? { backgroundColor: habit.color + "30", borderColor: habit.color + "60", color: habit.color } : {}}
                    >
                        <span>{habit.icon}</span>
                        {habit.name}
                    </button>
                ))}
            </div>

            {/* ── DAILY VIEW ──────────────────────────────────────────────────── */}
            {view === "daily" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Task List */}
                    <Card className="lg:col-span-2 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="section-title text-base">
                                {format(new Date(), "EEEE, MMMM d")}
                            </h2>
                            <Badge variant="neutral">
                                {todayTasks.filter(t => t.completed).length}/{todayTasks.length}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            {todayTasks.map(task => {
                                const habit = habits.find(h => h.id === task.habit_id);
                                return (
                                    <div
                                        key={task.id}
                                        className={cn(
                                            "flex items-center gap-3 p-3.5 rounded-[2px] border transition-none group",
                                            task.completed
                                                ? "bg-surface-700/30 border-success-500/10"
                                                : "bg-surface-700/50 border-surface-400/40 hover:border-surface-400/50"
                                        )}
                                    >
                                        <button onClick={() => toggleTask(task.id)} className="shrink-0">
                                            {task.completed ? (
                                                <CheckCircle2 className="w-5 h-5 text-success-400" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-text-muted/40 group-hover:text-text-muted/60 transition-none" />
                                            )}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("text-sm font-medium", task.completed ? "text-text-muted/60 line-through" : "text-text-primary")}>
                                                {task.title}
                                            </p>
                                            {habit && (
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <div className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: habit.color }} />
                                                    <p className="text-2xs text-text-muted/60">{habit.name}</p>
                                                </div>
                                            )}
                                        </div>
                                        {task.completed_at && (
                                            <span className="text-2xs text-white/25 shrink-0">
                                                {format(parseISO(task.completed_at), "h:mm a")}
                                            </span>
                                        )}
                                        <button onClick={() => deleteTask(task.id)} className="p-1 rounded-[2px] hover:bg-surface-700 text-text-muted/40 hover:text-danger-400 transition-none opacity-0 group-hover:opacity-100 shrink-0">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                );
                            })}

                            {todayTasks.length === 0 && !showTaskForm && (
                                <div className="py-8 text-center text-text-muted/50">
                                    <p className="text-sm">No tasks for today</p>
                                    <p className="text-xs mt-1">Add a task to get started</p>
                                </div>
                            )}

                            {/* Add task form / button */}
                            {showTaskForm ? (
                                <form onSubmit={handleAddTask} className="flex items-center gap-2 p-2 rounded-[2px] border border-brand-500/30 bg-surface-800">
                                    <input type="text" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task name..."
                                        className="flex-1 px-2 py-1.5 bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none" autoFocus />
                                    <select value={taskForm.habit_id} onChange={e => setTaskForm({ ...taskForm, habit_id: e.target.value })}
                                        className="px-2 py-1.5 bg-surface-900 border border-surface-400/50 rounded-[2px] text-xs text-text-primary focus:outline-none">
                                        <option value="">No habit</option>
                                        {habits.map(h => <option key={h.id} value={h.id}>{h.icon} {h.name}</option>)}
                                    </select>
                                    <button type="submit" className="p-1.5 text-brand-400 hover:text-brand-300"><Check className="w-4 h-4" /></button>
                                    <button type="button" onClick={() => setShowTaskForm(false)} className="p-1.5 text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button>
                                </form>
                            ) : (
                                <button onClick={() => setShowTaskForm(true)} className="w-full flex items-center gap-3 p-3.5 rounded-[2px] border border-dashed border-surface-400/50 text-text-muted/50 hover:border-brand-500/40 hover:text-text-muted/70 transition-all text-sm">
                                    <Plus className="w-4 h-4" />
                                    Add a task...
                                </button>
                            )}
                        </div>
                    </Card>

                    {/* Habit Streaks */}
                    <div className="space-y-3">
                        {habits.map(habit => {
                            const streak = getStreak(habit.id);
                            return (
                                <Card key={habit.id} className="p-4 hover:border-surface-400/50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-[2px] flex items-center justify-center text-lg shrink-0"
                                            style={{ backgroundColor: habit.color + "20" }}
                                        >
                                            {habit.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-text-primary truncate">{habit.name}</p>
                                            <p className="text-2xs text-text-muted/60 capitalize">{habit.category}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="flex items-center gap-1 justify-end">
                                                <Flame className="w-3.5 h-3.5 text-warning-400" />
                                                <span className="font-display font-bold text-warning-400 text-sm">{streak}</span>
                                            </div>
                                            <p className="text-2xs text-text-muted/50">day streak</p>
                                        </div>
                                        <button onClick={() => deleteHabit(habit.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/40 hover:text-danger-400 transition-none opacity-0 group-hover:opacity-100 shrink-0">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </Card>
                            );
                        })}
                        {habits.length === 0 && (
                            <Card className="p-8 text-center">
                                <p className="text-sm text-text-muted/60">No habits yet</p>
                                <p className="text-xs text-white/25 mt-1">Click &quot;Add Habit&quot; to create one</p>
                            </Card>
                        )}
                    </div>
                </div>
            )}

            {/* ── WEEKLY VIEW ─────────────────────────────────────────────────── */}
            {view === "weekly" && (
                <Card className="p-5 overflow-x-auto">
                    <h2 className="section-title text-base mb-4">
                        Week of {format(parseISO(weekDays[0]), "MMM d")} – {format(parseISO(weekDays[6]), "d, yyyy")}
                    </h2>
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr>
                                <th className="text-left text-xs text-text-muted/60 font-medium pb-3 w-40">Habit</th>
                                {weekDays.map(d => (
                                    <th key={d} className="text-center text-xs text-text-muted/60 font-medium pb-3 w-12">
                                        <div>{format(parseISO(d), "EEE")}</div>
                                        <div className={cn(
                                            "text-sm font-bold",
                                            d === today ? "text-brand-400" : "text-text-muted/90"
                                        )}>
                                            {format(parseISO(d), "d")}
                                        </div>
                                    </th>
                                ))}
                                <th className="text-center text-xs text-text-muted/60 font-medium pb-3">Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-400/20">
                            {habits.map(habit => {
                                const doneCount = weekDays.filter(d => habitCompletions[d]?.[habit.id]).length;
                                const pct = Math.round((doneCount / weekDays.length) * 100);
                                return (
                                    <tr key={habit.id} className="group">
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">{habit.icon}</span>
                                                <span className="text-sm font-medium text-text-primary">{habit.name}</span>
                                            </div>
                                        </td>
                                        {weekDays.map(d => {
                                            const done = habitCompletions[d]?.[habit.id] ?? false;
                                            return (
                                                <td key={d} className="py-3 text-center">
                                                    <div className="flex justify-center">
                                                        <button
                                                            onClick={() => toggleHabitCompletion(d, habit.id)}
                                                            className={cn(
                                                                "w-8 h-8 rounded-[2px] flex items-center justify-center text-xs font-bold transition-none hover:scale-110",
                                                                done ? "text-text-primary" : "bg-surface-700 text-text-muted/40 hover:bg-surface-600"
                                                            )}
                                                            style={done ? { backgroundColor: habit.color + "30", color: habit.color } : {}}
                                                        >
                                                            {done ? "✓" : "·"}
                                                        </button>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td className="py-3 text-center">
                                            <span className={cn(
                                                "text-xs font-bold",
                                                pct === 100 ? "text-success-400" : pct >= 70 ? "text-brand-400" : "text-text-muted/60"
                                            )}>
                                                {pct}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {habits.length === 0 && (
                                <tr><td colSpan={9} className="py-12 text-center text-text-muted/50 text-sm">No habits yet. Add one to start tracking!</td></tr>
                            )}
                        </tbody>
                    </table>
                </Card>
            )}

            {/* ── MONTHLY VIEW (Heatmap) ───────────────────────────────────────── */}
            {view === "monthly" && (
                <Card className="p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="section-title text-base">Consistency Heatmap</h2>
                            <p className="section-sub mt-0.5">Last 12 weeks of habit activity</p>
                        </div>
                        <div className="flex items-center gap-2 text-2xs text-text-muted/60">
                            <span>Less</span>
                            {[0, 1, 2, 3, 4].map(l => (
                                <div key={l} className={cn("w-3 h-3 rounded-none", HEATMAP_COLORS[l])} />
                            ))}
                            <span>More</span>
                        </div>
                    </div>

                    <div className="flex gap-1 flex-wrap">
                        {heatmapData.map((cell, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-4 h-4 rounded-none transition-all hover:scale-125 cursor-pointer",
                                    HEATMAP_COLORS[cell.level]
                                )}
                                title={`${cell.date}: ${cell.count} habits completed`}
                            />
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-4">
                        {[
                            { label: "Total Active Days", value: heatmapData.filter(c => c.count > 0).length },
                            { label: "Perfect Days", value: heatmapData.filter(c => c.level === 4).length },
                            { label: "Current Streak", value: `${Math.max(...habits.map(h => getStreak(h.id)), 0)} days` },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-surface-700/50 rounded-[2px] p-4 text-center">
                                <p className="font-display font-bold text-xl text-text-primary">{value}</p>
                                <p className="text-xs text-text-muted/60 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
