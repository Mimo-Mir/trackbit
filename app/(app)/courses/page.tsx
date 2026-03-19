"use client";

import React, { useState } from "react";
import { BookOpen, Plus, Trash2, Edit3, X, Check } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card, ProgressBar } from "@/components/ui/primitives";
import type { Course } from "@/types";

export default function CoursesPage() {
    const { courses, addCourse, updateCourse, deleteCourse } = useStudentStore();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', assignmentsLeft: 0, tasksLeft: 0, progressPercentage: 0 });

    const resetForm = () => { setForm({ name: '', assignmentsLeft: 0, tasksLeft: 0, progressPercentage: 0 }); setShowForm(false); setEditingId(null); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        if (editingId) {
            updateCourse(editingId, form);
        } else {
            addCourse({ id: `c-${generateId()}`, ...form });
        }
        resetForm();
    };

    const startEdit = (course: Course) => {
        setEditingId(course.id);
        setForm({ name: course.name, assignmentsLeft: course.assignmentsLeft, tasksLeft: course.tasksLeft, progressPercentage: course.progressPercentage });
        setShowForm(true);
    };

    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow">
                        <BookOpen className="w-5 h-5 text-text-primary" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Courses</h1>
                        <p className="text-xs text-text-muted/70 mt-0.5">{courses.length} courses registered</p>
                    </div>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none shadow-glow">
                    <Plus className="w-4 h-4" /> Add Course
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <Card className="p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-text-primary">{editingId ? 'Edit Course' : 'New Course'}</h3>
                        <button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Course Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mathematics"
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Progress %</label>
                            <input type="number" min={0} max={100} value={form.progressPercentage} onChange={e => setForm({ ...form, progressPercentage: Number(e.target.value) })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Assignments Left</label>
                            <input type="number" min={0} value={form.assignmentsLeft} onChange={e => setForm({ ...form, assignmentsLeft: Number(e.target.value) })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Tasks Left</label>
                            <input type="number" min={0} value={form.tasksLeft} onChange={e => setForm({ ...form, tasksLeft: Number(e.target.value) })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" />
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-text-muted/70 hover:text-text-primary transition-none">Cancel</button>
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none">
                                <Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => (
                    <Card key={course.id} className="p-5 bg-surface-800 border-surface-400/40 hover:border-brand-500/20 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-[2px] bg-brand-500"></div>
                                <h3 className="text-base font-bold text-text-primary">{course.name}</h3>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(course)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/60 hover:text-brand-400 transition-none"><Edit3 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => deleteCourse(course.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/60 hover:text-danger-400 transition-none"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                        <div className="space-y-1 mb-4">
                            <p className="text-xs text-text-muted/70">{course.assignmentsLeft} Assignments Left</p>
                            <p className="text-xs text-text-muted/70">{course.tasksLeft} Tasks Left</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-text-muted/60 w-8">{Math.round(course.progressPercentage)}%</span>
                            <ProgressBar value={course.progressPercentage} max={100} color="brand" className="h-1.5" />
                        </div>
                    </Card>
                ))}
                {courses.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-text-muted/50">
                        <BookOpen className="w-12 h-12 mb-3 text-text-muted/30" />
                        <p className="text-sm font-medium">No courses yet</p>
                        <p className="text-xs mt-1">Click &quot;Add Course&quot; to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
