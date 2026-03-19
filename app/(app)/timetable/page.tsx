"use client";

import React, { useState, Suspense } from "react";
import { Table, Plus, Trash2, X, Check } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card } from "@/components/ui/primitives";
import { useSearchParams } from "next/navigation";

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

export default function TimetablePage() {
    return <Suspense><TimetableContent /></Suspense>;
}

function TimetableContent() {
    const { timetable, courses, addTimetableEvent, deleteTimetableEvent } = useStudentStore();
    const searchParams = useSearchParams();
    const [showForm, setShowForm] = useState(searchParams.get('new') === 'true');
    const [form, setForm] = useState({ course_id: '', dayOfWeek: 'Mon', startTime: '09:00', endTime: '10:00' });

    const resetForm = () => { setForm({ course_id: '', dayOfWeek: 'Mon', startTime: '09:00', endTime: '10:00' }); setShowForm(false); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.course_id) return;
        addTimetableEvent({ id: `tt-${generateId()}`, ...form });
        resetForm();
    };

    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow">
                        <Table className="w-5 h-5 text-text-primary" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Time Table</h1>
                        <p className="text-xs text-text-muted/70 mt-0.5">{timetable.length} events scheduled</p>
                    </div>
                </div>
                <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none shadow-glow">
                    <Plus className="w-4 h-4" /> Add Event
                </button>
            </div>

            {showForm && (
                <Card className="p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-text-primary">Schedule New Event</h3>
                        <button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Course</label>
                            <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50">
                                <option value="">Select course</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Day</label>
                            <select value={form.dayOfWeek} onChange={e => setForm({ ...form, dayOfWeek: e.target.value })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50">
                                {DAYS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Start Time</label>
                            <select value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50">
                                {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <label className="block text-xs text-text-muted/70 mb-1">End Time</label>
                                <select value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })}
                                    className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50">
                                    {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none">
                                <Check className="w-4 h-4" /> Add
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Timetable Grid */}
            <Card className="p-6 bg-surface-800 border-surface-400/40 overflow-hidden">
                <div className="grid grid-cols-6 gap-3">
                    {/* Header Row */}
                    <div className="text-xs font-bold text-text-muted/60 p-2">Time</div>
                    {DAYS.map(day => (
                        <div key={day} className="text-xs font-bold text-brand-400 p-2 text-center">{day}</div>
                    ))}

                    {/* Time Rows */}
                    {TIME_SLOTS.map((time, idx) => {
                        const endTime = TIME_SLOTS[idx + 1] || `${parseInt(time) + 1}:00`;
                        return (
                            <React.Fragment key={time}>
                                <div className="text-xs text-text-muted/50 p-2 border-t border-surface-400/40">{time} - {endTime}</div>
                                {DAYS.map(day => {
                                    const event = timetable.find(e => e.dayOfWeek === day && e.startTime === time);
                                    const course = event ? courses.find(c => c.id === event.course_id) : null;
                                    return (
                                        <div key={day} className="border-t border-surface-400/40 p-1 min-h-[50px]">
                                            {event && course ? (
                                                <div className="bg-brand-600/15 border border-brand-500/25 rounded-[2px] p-2 text-xs h-full flex flex-col justify-between group relative">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-2 h-2 rounded-[2px] bg-brand-500 shrink-0"></div>
                                                        <span className="text-brand-300 font-medium truncate">{course.name}</span>
                                                    </div>
                                                    <span className="text-brand-400/60 text-2xs">{event.startTime} - {event.endTime}</span>
                                                    <button onClick={() => deleteTimetableEvent(event.id)}
                                                        className="absolute top-1 right-1 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-surface-700 text-text-muted/50 hover:text-danger-400 transition-none">
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-white/5 text-xs">—</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}
