"use client";

import React, { useState, Suspense } from "react";
import { Folder, Plus, Trash2, X, Check, ExternalLink } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card, Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import type { ResourceItem } from "@/types";

export default function ResourcesPage() {
    return <Suspense><ResourcesContent /></Suspense>;
}

function ResourcesContent() {
    const { resources, addResource, updateResource, deleteResource } = useStudentStore();
    const searchParams = useSearchParams();
    const [showForm, setShowForm] = useState(searchParams.get('new') === 'true');
    const [filter, setFilter] = useState<'all' | ResourceItem['type']>('all');
    const [form, setForm] = useState({
        title: '', type: 'article' as ResourceItem['type'], url: '', status: 'Not Seen' as ResourceItem['status'],
    });

    const resetForm = () => { setForm({ title: '', type: 'article', url: '', status: 'Not Seen' }); setShowForm(false); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        addResource({ id: `r-${generateId()}`, ...form });
        resetForm();
    };

    const filtered = resources.filter(r => filter === 'all' ? true : r.type === filter);
    const types: ('all' | ResourceItem['type'])[] = ['all', 'article', 'video', 'twitter', 'job', 'other'];

    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow">
                        <Folder className="w-5 h-5 text-text-primary" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Resources</h1>
                        <p className="text-xs text-text-muted/70 mt-0.5">{resources.length} resources saved</p>
                    </div>
                </div>
                <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none shadow-glow">
                    <Plus className="w-4 h-4" /> Add Resource
                </button>
            </div>

            {showForm && (
                <Card className="p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-text-primary">New Resource</h3>
                        <button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs text-text-muted/70 mb-1">Title</label>
                            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. How to study effectively"
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus />
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as ResourceItem['type'] })}
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50">
                                <option value="article">Article</option><option value="video">Video</option><option value="twitter">Twitter</option><option value="job">Job</option><option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">URL</label>
                            <input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..."
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" />
                        </div>
                        <div className="col-span-4 flex justify-end gap-2">
                            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-text-muted/70 hover:text-text-primary transition-none">Cancel</button>
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none">
                                <Check className="w-4 h-4" /> Add Resource
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {types.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={cn("px-4 py-1.5 rounded-[2px] text-xs font-medium transition-all capitalize",
                            filter === f ? "bg-brand-600/20 text-brand-400 border border-brand-500/30" : "text-text-muted/60 hover:text-text-primary border-2 border-surface-400/50 hover:border-surface-400/50"
                        )}>{f === 'all' ? `All (${resources.length})` : `${f} (${resources.filter(r => r.type === f).length})`}</button>
                ))}
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(resource => (
                    <Card key={resource.id} className="p-4 bg-surface-800 border-surface-400/40 hover:border-brand-500/20 transition-all group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">
                                    {resource.type === 'article' ? '📄' : resource.type === 'video' ? '🎬' : resource.type === 'twitter' ? '🐦' : resource.type === 'job' ? '💼' : '📑'}
                                </span>
                                <h3 className="text-sm font-bold text-text-primary">{resource.title}</h3>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {resource.url && resource.url !== '#' && (
                                    <a href={resource.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/60 hover:text-brand-400 transition-none">
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                                <button onClick={() => deleteResource(resource.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/60 hover:text-danger-400 transition-none">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-text-muted/60 capitalize">{resource.type}</span>
                            <button onClick={() => updateResource(resource.id, { status: resource.status === 'Not Seen' ? 'Seen' : 'Not Seen' })}>
                                <Badge variant={resource.status === 'Seen' ? 'success' : 'neutral'} className={cn("cursor-pointer transition-none", resource.status === 'Not Seen' && "bg-surface-700")}>
                                    {resource.status}
                                </Badge>
                            </button>
                        </div>
                    </Card>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-text-muted/50">
                        <Folder className="w-12 h-12 mb-3 text-text-muted/30" />
                        <p className="text-sm font-medium">No resources found</p>
                        <p className="text-xs mt-1">Click &quot;Add Resource&quot; to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
