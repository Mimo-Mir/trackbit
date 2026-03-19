"use client";
import React, { useState } from "react";
import { GraduationCap, Plus, Trash2, X, Check, Edit3 } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card, Badge } from "@/components/ui/primitives";
import type { AdmissionEntry } from "@/types";

export default function AdmissionsPage() {
    const { admissions, addAdmission, updateAdmission, deleteAdmission } = useStudentStore();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ university: '', program: '', deadline: '', status: 'Researching' as AdmissionEntry['status'] });
    const resetForm = () => { setForm({ university: '', program: '', deadline: '', status: 'Researching' }); setShowForm(false); setEditingId(null); };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); if (!form.university.trim()) return;
        if (editingId) { updateAdmission(editingId, form); } else { addAdmission({ id: `ad-${generateId()}`, ...form }); }
        resetForm();
    };
    const startEdit = (a: AdmissionEntry) => { setEditingId(a.id); setForm({ university: a.university, program: a.program, deadline: a.deadline, status: a.status }); setShowForm(true); };
    const statusColors: Record<string, "brand" | "success" | "danger" | "neutral"> = { Researching: 'neutral', Applied: 'brand', Accepted: 'success', Rejected: 'danger', Waitlisted: 'brand' };
    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow"><GraduationCap className="w-5 h-5 text-text-primary" /></div>
                    <div><h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Admission Tracker</h1><p className="text-xs text-text-muted/70 mt-0.5">{admissions.length} applications</p></div>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none shadow-glow"><Plus className="w-4 h-4" /> Add University</button>
            </div>
            {showForm && (
                <Card className="p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-text-primary">{editingId ? 'Edit' : 'New'} Application</h3><button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button></div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
                        <div><label className="block text-xs text-text-muted/70 mb-1">University</label><input type="text" value={form.university} onChange={e => setForm({...form, university: e.target.value})} placeholder="e.g. MIT" className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Program</label><input type="text" value={form.program} onChange={e => setForm({...form, program: e.target.value})} placeholder="e.g. CS B.S." className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Deadline</label><input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" /></div>
                        <div className="flex items-end"><button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none"><Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add'}</button></div>
                    </form>
                </Card>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {admissions.map(a => (
                    <Card key={a.id} className="p-5 bg-surface-800 border-surface-400/40 hover:border-brand-500/20 transition-all group">
                        <div className="flex items-start justify-between mb-2">
                            <div><h3 className="text-sm font-bold text-text-primary">{a.university}</h3><p className="text-xs text-text-muted/60">{a.program}</p></div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(a)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/60 hover:text-brand-400 transition-none"><Edit3 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => deleteAdmission(a.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/60 hover:text-danger-400 transition-none"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <Badge variant={statusColors[a.status] || 'neutral'}>{a.status}</Badge>
                            {a.deadline && <span className="text-2xs text-text-muted/50">Due: {a.deadline}</span>}
                        </div>
                        <select value={a.status} onChange={e => updateAdmission(a.id, { status: e.target.value as AdmissionEntry['status'] })} className="w-full mt-3 px-2 py-1 bg-surface-900 border-2 border-surface-400/50 rounded text-xs text-text-muted/70 focus:outline-none focus:border-brand-500/50"><option>Researching</option><option>Applied</option><option>Accepted</option><option>Rejected</option><option>Waitlisted</option></select>
                    </Card>
                ))}
                {admissions.length === 0 && <div className="col-span-full flex flex-col items-center justify-center py-16 text-text-muted/50"><GraduationCap className="w-12 h-12 mb-3 text-text-muted/30" /><p className="text-sm font-medium">No applications yet</p></div>}
            </div>
        </div>
    );
}
