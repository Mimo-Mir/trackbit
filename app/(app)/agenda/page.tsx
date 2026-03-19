"use client";
import React, { useState, Suspense } from "react";
import { Calendar, Plus, Trash2, X, Check } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card, Badge } from "@/components/ui/primitives";
import { useSearchParams } from "next/navigation";
import type { AgendaEvent } from "@/types";

export default function AgendaPage() {
    return <Suspense><AgendaContent /></Suspense>;
}

function AgendaContent() {
    const { agendaEvents, addAgendaEvent, deleteAgendaEvent } = useStudentStore();
    const searchParams = useSearchParams();
    const [showForm, setShowForm] = useState(searchParams.get('new') === 'true');
    const [form, setForm] = useState({ title: '', date: new Date().toISOString().split('T')[0], time: '09:00', description: '', type: 'Reminder' as AgendaEvent['type'] });
    const resetForm = () => { setForm({ title: '', date: new Date().toISOString().split('T')[0], time: '09:00', description: '', type: 'Reminder' }); setShowForm(false); };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); if (!form.title.trim()) return;
        addAgendaEvent({ id: `ae-${generateId()}`, ...form }); resetForm();
    };
    const typeColors: Record<string, "brand" | "success" | "danger" | "neutral"> = { Meeting: 'brand', Deadline: 'danger', Reminder: 'success', Other: 'neutral' };
    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow"><Calendar className="w-5 h-5 text-text-primary" /></div>
                    <div><h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Agenda Events</h1><p className="text-xs text-text-muted/70 mt-0.5">{agendaEvents.length} events</p></div>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none shadow-glow"><Plus className="w-4 h-4" /> New Event</button>
            </div>
            {showForm && (
                <Card className="p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-text-primary">New Event</h3><button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button></div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
                        <div className="col-span-2"><label className="block text-xs text-text-muted/70 mb-1">Title</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Event title" className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value as AgendaEvent['type']})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50"><option>Meeting</option><option>Deadline</option><option>Reminder</option><option>Other</option></select></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Time</label><input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Description</label><input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Optional..." className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" /></div>
                        <div className="col-span-3 flex justify-end"><button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none"><Check className="w-4 h-4" /> Add Event</button></div>
                    </form>
                </Card>
            )}
            <div className="space-y-3">
                {agendaEvents.sort((a, b) => a.date.localeCompare(b.date)).map(event => (
                    <Card key={event.id} className="p-4 bg-surface-800 border-surface-400/40 hover:border-brand-500/20 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="text-center min-w-[48px]"><p className="text-lg font-bold text-brand-400">{new Date(event.date).getDate()}</p><p className="text-2xs text-text-muted/60 uppercase">{new Date(event.date).toLocaleString('en', { month: 'short' })}</p></div>
                            <div><h3 className="text-sm font-bold text-text-primary">{event.title}</h3>{event.description && <p className="text-xs text-text-muted/60 mt-0.5">{event.description}</p>}<p className="text-2xs text-text-muted/50 mt-1">{event.time}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant={typeColors[event.type] || 'neutral'}>{event.type}</Badge>
                            <button onClick={() => deleteAgendaEvent(event.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/50 hover:text-danger-400 transition-none opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                    </Card>
                ))}
                {agendaEvents.length === 0 && <div className="flex flex-col items-center justify-center py-16 text-text-muted/50"><Calendar className="w-12 h-12 mb-3 text-text-muted/30" /><p className="text-sm font-medium">No events yet</p></div>}
            </div>
        </div>
    );
}
