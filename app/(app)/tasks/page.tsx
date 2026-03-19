"use client";

import React, { useState, Suspense } from "react";
import { CheckSquare, Plus, Trash2, X, Check } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card, Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

export default function TasksPage() {
    return <Suspense><TasksContent /></Suspense>;
}

function TasksContent() {
    const { tasks, courses, addTask, toggleTask, deleteTask } = useStudentStore();
    const searchParams = useSearchParams();
    const [showForm, setShowForm] = useState(searchParams.get('new') === 'true');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [form, setForm] = useState({
        title: '', date: new Date().toISOString().split('T')[0], course_id: '', effort: 'Medium' as 'Low' | 'Medium' | 'High',
        impact: 'Medium' as 'Low' | 'Medium' | 'High', priority: 3,
    });

    const resetForm = () => { setForm({ title: '', date: new Date().toISOString().split('T')[0], course_id: '', effort: 'Medium', impact: 'Medium', priority: 3 }); setShowForm(false); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        addTask({ id: `st-${generateId()}`, ...form, completed: false, order: tasks.length + 1 });
        resetForm();
    };

    const filtered = tasks.filter(t => filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed);

    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow">
                        <CheckSquare className="w-5 h-5 text-text-primary" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Tasks Manager</h1>
                        <p className="text-xs text-text-muted/70 mt-0.5">{tasks.filter(t => !t.completed).length} active · {tasks.filter(t => t.completed).length} completed</p>
                    </div>
                </div>
                <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none shadow-glow">
                    <Plus className="w-4 h-4" /> New Task
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <Card className="p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-text-primary">New Task</h3>
                        <button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs text-text-muted/70 mb-1">Task Title</label>
                            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?"
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus />
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Due Date</label>
                            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Course</label>
                            <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50">
                                <option value="">No course</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Effort</label>
                            <select value={form.effort} onChange={e => setForm({ ...form, effort: e.target.value as 'Low' | 'Medium' | 'High' })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50">
                                <option>Low</option><option>Medium</option><option>High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Impact</label>
                            <select value={form.impact} onChange={e => setForm({ ...form, impact: e.target.value as 'Low' | 'Medium' | 'High' })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50">
                                <option>Low</option><option>Medium</option><option>High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Priority (1-5)</label>
                            <input type="number" min={1} max={5} value={form.priority} onChange={e => setForm({ ...form, priority: Number(e.target.value) })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" />
                        </div>
                        <div className="col-span-3 flex justify-end gap-2">
                            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-text-muted/70 hover:text-text-primary transition-none">Cancel</button>
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none">
                                <Check className="w-4 h-4" /> Add Task
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Filters */}
            <div className="flex gap-2">
                {(['all', 'active', 'completed'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={cn("px-4 py-1.5 rounded-[2px] text-xs font-medium transition-all capitalize",
                            filter === f ? "bg-brand-600/20 text-brand-400 border border-brand-500/30" : "text-text-muted/60 hover:text-text-primary border-2 border-surface-400/50 hover:border-surface-400/50"
                        )}>{f} {f === 'all' ? `(${tasks.length})` : f === 'active' ? `(${tasks.filter(t => !t.completed).length})` : `(${tasks.filter(t => t.completed).length})`}</button>
                ))}
            </div>

            {/* Tasks Table */}
            <Card className="bg-surface-800 border-surface-400/40 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-3 border-b border-surface-400/40 text-xs font-bold text-text-muted/70">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1">Effort</div>
                    <div className="col-span-1">Impact</div>
                    <div className="col-span-2">Priority</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y divide-surface-400/20">
                    {filtered.map(task => {
                        const course = courses.find(c => c.id === task.course_id);
                        return (
                            <div key={task.id} className={cn("grid grid-cols-12 gap-4 p-3 items-center text-xs transition-none hover:bg-surface-700/50", task.completed && "opacity-50")}>
                                <label className="col-span-4 flex items-center gap-2 text-text-primary font-medium cursor-pointer">
                                    <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="rounded border-surface-400/50 bg-surface-900 text-brand-500 focus:ring-brand-500/20 cursor-pointer" />
                                    <div>
                                        <span className={cn("transition-all block", task.completed && "line-through text-text-muted/60")}>{task.title}</span>
                                        {course && <span className="text-2xs text-text-muted/50 block">{course.name}</span>}
                                    </div>
                                </label>
                                <div className="col-span-2 text-text-muted/70">{format(new Date(task.date), "MMM d, yyyy")}</div>
                                <div className="col-span-1"><Badge variant={task.effort === 'High' ? 'danger' : task.effort === 'Medium' ? 'brand' : 'neutral'} className="text-2xs">{task.effort}</Badge></div>
                                <div className="col-span-1"><Badge variant={task.impact === 'High' ? 'success' : task.impact === 'Medium' ? 'brand' : 'neutral'} className="text-2xs">{task.impact}</Badge></div>
                                <div className="col-span-2 flex gap-0.5">{[...Array(5)].map((_, i) => <span key={i} className={i < (task.priority || 0) ? "text-brand-400" : "text-text-muted/30"}>★</span>)}</div>
                                <div className="col-span-2 text-right">
                                    <button onClick={() => deleteTask(task.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/50 hover:text-danger-400 transition-none"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="p-12 text-center text-text-muted/50">
                            <CheckSquare className="w-10 h-10 mx-auto mb-2 text-text-muted/30" />
                            <p className="text-sm">No tasks found</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
