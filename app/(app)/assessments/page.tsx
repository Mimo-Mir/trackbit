"use client";

import React, { useState, Suspense } from "react";
import { FileText, Plus, Trash2, X, Check } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card, Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import type { Assessment } from "@/types";

export default function AssessmentsPage() {
    return <Suspense><AssessmentsContent /></Suspense>;
}

function AssessmentsContent() {
    const { assessments, courses, addAssessment, updateAssessment, deleteAssessment } = useStudentStore();
    const searchParams = useSearchParams();
    const [showForm, setShowForm] = useState(searchParams.get('new') === 'true');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'Exam' | 'Assignment'>('all');
    const [form, setForm] = useState({
        name: '', course_id: '', type: 'Assignment' as Assessment['type'], dueDate: new Date().toISOString().split('T')[0], status: 'Not started' as Assessment['status'],
    });

    const resetForm = () => { setForm({ name: '', course_id: '', type: 'Assignment', dueDate: new Date().toISOString().split('T')[0], status: 'Not started' }); setShowForm(false); setEditingId(null); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        if (editingId) {
            updateAssessment(editingId, form);
        } else {
            addAssessment({ id: `a-${generateId()}`, ...form });
        }
        resetForm();
    };

    const startEdit = (a: Assessment) => {
        setEditingId(a.id);
        setForm({ name: a.name, course_id: a.course_id, type: a.type, dueDate: a.dueDate, status: a.status });
        setShowForm(true);
    };

    const filtered = assessments.filter(a => filter === 'all' ? true : a.type === filter);

    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow">
                        <FileText className="w-5 h-5 text-text-primary" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Assessments</h1>
                        <p className="text-xs text-text-muted/70 mt-0.5">{assessments.length} assessments tracked</p>
                    </div>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none shadow-glow">
                    <Plus className="w-4 h-4" /> New Assessment
                </button>
            </div>

            {showForm && (
                <Card className="p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-text-primary">{editingId ? 'Edit' : 'New'} Assessment</h3>
                        <button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Midterm Exam"
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus />
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Assessment['type'] })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50">
                                <option>Exam</option><option>Assignment</option><option>Quiz</option><option>Project</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Due Date</label>
                            <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Course</label>
                            <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50">
                                <option value="">Select course</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Status</label>
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Assessment['status'] })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50">
                                <option>Not started</option><option>In progress</option><option>Completed</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none">
                                <Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="flex gap-2">
                {(['all', 'Exam', 'Assignment'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={cn("px-4 py-1.5 rounded-[2px] text-xs font-medium transition-all capitalize",
                            filter === f ? "bg-brand-600/20 text-brand-400 border border-brand-500/30" : "text-text-muted/60 hover:text-text-primary border-2 border-surface-400/50 hover:border-surface-400/50"
                        )}>{f === 'all' ? `All (${assessments.length})` : `${f}s (${assessments.filter(a => a.type === f).length})`}</button>
                ))}
            </div>

            <Card className="bg-surface-800 border-surface-400/40 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-3 border-b border-surface-400/40 text-xs font-bold text-text-muted/70">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-2">Course</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Due Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y divide-surface-400/20">
                    {filtered.map(a => {
                        const course = courses.find(c => c.id === a.course_id);
                        return (
                            <div key={a.id} className="grid grid-cols-12 gap-4 p-3 items-center text-xs hover:bg-surface-700/50 transition-none group">
                                <div className="col-span-3 text-text-primary font-medium">{a.name}</div>
                                <div className="col-span-2 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-[2px] bg-brand-500"></div><span className="text-text-muted/90">{course?.name || '—'}</span></div>
                                <div className="col-span-2"><Badge variant="neutral" className="bg-surface-700">{a.type}</Badge></div>
                                <div className="col-span-2 text-text-muted/70">{format(new Date(a.dueDate), "MMM d, yyyy")}</div>
                                <div className="col-span-2"><Badge variant={a.status === 'Completed' ? 'success' : a.status === 'In progress' ? 'brand' : 'danger'}>{a.status}</Badge></div>
                                <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(a)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/50 hover:text-brand-400 transition-none"><FileText className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => deleteAssessment(a.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/50 hover:text-danger-400 transition-none"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="p-12 text-center text-text-muted/50"><FileText className="w-10 h-10 mx-auto mb-2 text-text-muted/30" /><p className="text-sm">No assessments found</p></div>
                    )}
                </div>
            </Card>
        </div>
    );
}
