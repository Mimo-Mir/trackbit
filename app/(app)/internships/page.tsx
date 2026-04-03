"use client";
import React, { useState } from "react";
import { Briefcase, Plus, Trash2, X, Check, ExternalLink } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card, Badge } from "@/components/ui/primitives";
import type { InternshipEntry } from "@/types";

export default function InternshipsPage() {
    const { internships, addInternship, updateInternship, deleteInternship } = useStudentStore();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ company: '', role: '', status: 'Wishlist' as InternshipEntry['status'], date: new Date().toISOString().split('T')[0], url: '' });
    const resetForm = () => { setForm({ company: '', role: '', status: 'Wishlist', date: new Date().toISOString().split('T')[0], url: '' }); setShowForm(false); };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); if (!form.company.trim()) return;
        addInternship({ id: `in-${generateId()}`, ...form }); resetForm();
    };
    const statusColors: Record<string, "brand" | "success" | "danger" | "neutral"> = { Applied: 'brand', Interview: 'success', Offer: 'success', Rejected: 'danger', Wishlist: 'neutral' };
    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow shrink-0"><Briefcase className="w-5 h-5 text-text-primary" /></div>
                    <div className="min-w-0"><h1 className="font-display font-bold text-xs sm:text-sm uppercase tracking-widest text-text-primary truncate">Internships & Jobs</h1><p className="text-xs text-text-muted/70 mt-0.5">{internships.length} applications</p></div>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-xs sm:text-sm font-medium hover:bg-brand-500 transition-none shadow-glow shrink-0"><Plus className="w-4 h-4" /><span className="hidden sm:inline"> Add Application</span><span className="sm:hidden">Add</span></button>
            </div>
            {showForm && (
                <Card className="p-4 sm:p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-text-primary">New Application</h3><button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button></div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div><label className="block text-xs text-text-muted/70 mb-1">Company</label><input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="e.g. Google" className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Role</label><input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. SWE Intern" className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value as InternshipEntry['status']})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50"><option>Wishlist</option><option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option></select></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">URL</label><input type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" /></div>
                        <div className="flex items-end"><button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none"><Check className="w-4 h-4" /> Add</button></div>
                    </form>
                </Card>
            )}

            {/* Desktop table view */}
            <Card className="hidden md:block bg-surface-800 border-surface-400/40 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-3 border-b border-surface-400/40 text-xs font-bold text-text-muted/70"><div className="col-span-3">Company</div><div className="col-span-3">Role</div><div className="col-span-2">Date</div><div className="col-span-2">Status</div><div className="col-span-2 text-right">Actions</div></div>
                <div className="divide-y divide-surface-400/20">
                    {internships.map(i => (
                        <div key={i.id} className="grid grid-cols-12 gap-4 p-3 items-center text-xs hover:bg-surface-700/50 transition-none group">
                            <div className="col-span-3 text-text-primary font-medium">{i.company}</div>
                            <div className="col-span-3 text-text-muted/90">{i.role}</div>
                            <div className="col-span-2 text-text-muted/70">{i.date}</div>
                            <div className="col-span-2"><Badge variant={statusColors[i.status] || 'neutral'}>{i.status}</Badge></div>
                            <div className="col-span-2 flex justify-end gap-1">
                                {i.url && <a href={i.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/50 hover:text-brand-400 transition-none"><ExternalLink className="w-3.5 h-3.5" /></a>}
                                <select value={i.status} onChange={e => updateInternship(i.id, { status: e.target.value as InternshipEntry['status'] })} className="bg-transparent text-text-muted/50 text-2xs border-none focus:outline-none cursor-pointer opacity-0 group-hover:opacity-100"><option>Wishlist</option><option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option></select>
                                <button onClick={() => deleteInternship(i.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/50 hover:text-danger-400 transition-none opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    ))}
                    {internships.length === 0 && <div className="p-12 text-center text-text-muted/50"><Briefcase className="w-10 h-10 mx-auto mb-2 text-text-muted/30" /><p className="text-sm">No applications yet</p></div>}
                </div>
            </Card>

            {/* Mobile card view */}
            <div className="md:hidden space-y-3">
                {internships.map(i => (
                    <Card key={i.id} className="p-4 bg-surface-800 border-surface-400/40">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-text-primary truncate">{i.company}</h3>
                                <p className="text-xs text-text-muted/70">{i.role}</p>
                            </div>
                            <Badge variant={statusColors[i.status] || 'neutral'}>{i.status}</Badge>
                        </div>
                        <p className="text-2xs text-text-muted/50 mb-3">{i.date}</p>
                        <div className="flex items-center justify-between">
                            <select value={i.status} onChange={e => updateInternship(i.id, { status: e.target.value as InternshipEntry['status'] })} className="px-2 py-1 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-xs text-text-muted/70 focus:outline-none focus:border-brand-500/50"><option>Wishlist</option><option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option></select>
                            <div className="flex gap-1">
                                {i.url && <a href={i.url} target="_blank" rel="noreferrer" className="p-2 rounded-[2px] hover:bg-surface-700 text-text-muted/50 hover:text-brand-400 transition-none"><ExternalLink className="w-4 h-4" /></a>}
                                <button onClick={() => deleteInternship(i.id)} className="p-2 rounded-[2px] hover:bg-surface-700 text-text-muted/50 hover:text-danger-400 transition-none"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </Card>
                ))}
                {internships.length === 0 && <Card className="p-12 bg-surface-800 border-surface-400/40 text-center text-text-muted/50"><Briefcase className="w-10 h-10 mx-auto mb-2 text-text-muted/30" /><p className="text-sm">No applications yet</p></Card>}
            </div>
        </div>
    );
}
