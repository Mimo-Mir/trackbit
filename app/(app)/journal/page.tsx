"use client";
import React, { useState, Suspense } from "react";
import { BookOpen, Plus, Trash2, X, Check } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card } from "@/components/ui/primitives";
import { useSearchParams } from "next/navigation";

export default function JournalPage() {
    return <Suspense><JournalContent /></Suspense>;
}

function JournalContent() {
    const { journal, addJournalEntry, deleteJournalEntry } = useStudentStore();
    const searchParams = useSearchParams();
    const [showForm, setShowForm] = useState(searchParams.get('new') === 'true');
    const [form, setForm] = useState({ title: '', content: '', date: new Date().toISOString().split('T')[0], mood: 'Good' as 'Great' | 'Good' | 'Okay' | 'Bad' | 'Terrible' });
    const resetForm = () => { setForm({ title: '', content: '', date: new Date().toISOString().split('T')[0], mood: 'Good' }); setShowForm(false); };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); if (!form.title.trim()) return;
        addJournalEntry({ id: `j-${generateId()}`, ...form }); resetForm();
    };
    const moodEmoji: Record<string, string> = { Great: '😄', Good: '🙂', Okay: '😐', Bad: '😟', Terrible: '😢' };
    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow"><BookOpen className="w-5 h-5 text-text-primary" /></div>
                    <div><h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Journal</h1><p className="text-xs text-text-muted/70 mt-0.5">{journal.length} entries</p></div>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none shadow-glow"><Plus className="w-4 h-4" /> New Entry</button>
            </div>
            {showForm && (
                <Card className="p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-text-primary">New Journal Entry</h3><button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button></div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2"><label className="block text-xs text-text-muted/70 mb-1">Title</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="How was your day?" className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus /></div>
                            <div><label className="block text-xs text-text-muted/70 mb-1">Mood</label><select value={form.mood} onChange={e => setForm({...form, mood: e.target.value as typeof form.mood})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50"><option>Great</option><option>Good</option><option>Okay</option><option>Bad</option><option>Terrible</option></select></div>
                        </div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Content</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={4} placeholder="Write your thoughts..." className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50 resize-none" /></div>
                        <div className="flex justify-end"><button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none"><Check className="w-4 h-4" /> Save Entry</button></div>
                    </form>
                </Card>
            )}
            <div className="space-y-3">
                {journal.sort((a, b) => b.date.localeCompare(a.date)).map(entry => (
                    <Card key={entry.id} className="p-5 bg-surface-800 border-surface-400/40 hover:border-brand-500/20 transition-all group">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2"><span className="text-xl">{moodEmoji[entry.mood]}</span><h3 className="text-sm font-bold text-text-primary">{entry.title}</h3></div>
                            <div className="flex items-center gap-2"><span className="text-xs text-text-muted/50">{entry.date}</span><button onClick={() => deleteJournalEntry(entry.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/50 hover:text-danger-400 transition-none opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button></div>
                        </div>
                        {entry.content && <p className="text-xs text-text-muted/80 leading-relaxed whitespace-pre-wrap">{entry.content}</p>}
                    </Card>
                ))}
                {journal.length === 0 && <div className="flex flex-col items-center justify-center py-16 text-text-muted/50"><BookOpen className="w-12 h-12 mb-3 text-text-muted/30" /><p className="text-sm font-medium">No journal entries yet</p></div>}
            </div>
        </div>
    );
}
