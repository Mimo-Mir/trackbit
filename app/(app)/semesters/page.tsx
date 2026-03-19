"use client";
import React, { useState } from "react";
import { Layers, Plus, Trash2, X, Check, Edit3 } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card, Badge } from "@/components/ui/primitives";
import type { Semester } from "@/types";

export default function SemestersPage() {
    const { semesters, addSemester, updateSemester, deleteSemester } = useStudentStore();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', startDate: '', endDate: '', status: 'Upcoming' as Semester['status'] });
    const resetForm = () => { setForm({ name: '', startDate: '', endDate: '', status: 'Upcoming' }); setShowForm(false); setEditingId(null); };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); if (!form.name.trim()) return;
        if (editingId) { updateSemester(editingId, form); } else { addSemester({ id: `sem-${generateId()}`, ...form }); }
        resetForm();
    };
    const startEdit = (s: Semester) => { setEditingId(s.id); setForm({ name: s.name, startDate: s.startDate, endDate: s.endDate, status: s.status }); setShowForm(true); };
    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow"><Layers className="w-5 h-5 text-text-primary" /></div>
                    <div><h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Semesters</h1><p className="text-xs text-text-muted/70 mt-0.5">{semesters.length} semesters</p></div>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none shadow-glow"><Plus className="w-4 h-4" /> Add Semester</button>
            </div>
            {showForm && (
                <Card className="p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-text-primary">{editingId ? 'Edit' : 'New'} Semester</h3><button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button></div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
                        <div><label className="block text-xs text-text-muted/70 mb-1">Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Fall 2026" className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Start Date</label><input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">End Date</label><input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" /></div>
                        <div className="flex items-end"><button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none"><Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add'}</button></div>
                    </form>
                </Card>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {semesters.map(s => (
                    <Card key={s.id} className="p-5 bg-surface-800 border-surface-400/40 hover:border-brand-500/20 transition-all group">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-base font-bold text-text-primary">{s.name}</h3>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(s)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/60 hover:text-brand-400 transition-none"><Edit3 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => deleteSemester(s.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/60 hover:text-danger-400 transition-none"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                        <p className="text-xs text-text-muted/70 mb-2">{s.startDate} — {s.endDate}</p>
                        <Badge variant={s.status === 'Active' ? 'success' : s.status === 'Completed' ? 'neutral' : 'brand'}>{s.status}</Badge>
                    </Card>
                ))}
                {semesters.length === 0 && <div className="col-span-full flex flex-col items-center justify-center py-16 text-text-muted/50"><Layers className="w-12 h-12 mb-3 text-text-muted/30" /><p className="text-sm font-medium">No semesters yet</p></div>}
            </div>
        </div>
    );
}
