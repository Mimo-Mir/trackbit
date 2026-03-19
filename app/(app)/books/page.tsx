"use client";
import React, { useState } from "react";
import { BookMarked, Plus, Trash2, X, Check, Edit3 } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card, Badge, ProgressBar } from "@/components/ui/primitives";
import type { BookEntry } from "@/types";

export default function BooksPage() {
    const { books, addBook, updateBook, deleteBook } = useStudentStore();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: '', author: '', totalPages: 300, currentPage: 0, status: 'Want to Read' as BookEntry['status'] });
    const resetForm = () => { setForm({ title: '', author: '', totalPages: 300, currentPage: 0, status: 'Want to Read' }); setShowForm(false); setEditingId(null); };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); if (!form.title.trim()) return;
        if (editingId) { updateBook(editingId, form); } else { addBook({ id: `bk-${generateId()}`, ...form }); }
        resetForm();
    };
    const startEdit = (b: BookEntry) => { setEditingId(b.id); setForm({ title: b.title, author: b.author, totalPages: b.totalPages, currentPage: b.currentPage, status: b.status }); setShowForm(true); };
    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow"><BookMarked className="w-5 h-5 text-text-primary" /></div>
                    <div><h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Book Tracker</h1><p className="text-xs text-text-muted/70 mt-0.5">{books.length} books · {books.filter(b => b.status === 'Completed').length} completed</p></div>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none shadow-glow"><Plus className="w-4 h-4" /> Add Book</button>
            </div>
            {showForm && (
                <Card className="p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-text-primary">{editingId ? 'Edit' : 'New'} Book</h3><button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button></div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
                        <div><label className="block text-xs text-text-muted/70 mb-1">Title</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Book title" className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Author</label><input type="text" value={form.author} onChange={e => setForm({...form, author: e.target.value})} placeholder="Author name" className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value as BookEntry['status']})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50"><option>Want to Read</option><option>Reading</option><option>Completed</option></select></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Total Pages</label><input type="number" min={1} value={form.totalPages} onChange={e => setForm({...form, totalPages: Number(e.target.value)})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Current Page</label><input type="number" min={0} max={form.totalPages} value={form.currentPage} onChange={e => setForm({...form, currentPage: Number(e.target.value)})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" /></div>
                        <div className="flex items-end"><button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none"><Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add'}</button></div>
                    </form>
                </Card>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map(book => (
                    <Card key={book.id} className="p-5 bg-surface-800 border-surface-400/40 hover:border-brand-500/20 transition-all group">
                        <div className="flex items-start justify-between mb-2">
                            <div><h3 className="text-sm font-bold text-text-primary">{book.title}</h3><p className="text-xs text-text-muted/60">{book.author}</p></div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(book)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/60 hover:text-brand-400 transition-none"><Edit3 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => deleteBook(book.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/60 hover:text-danger-400 transition-none"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                        <Badge variant={book.status === 'Completed' ? 'success' : book.status === 'Reading' ? 'brand' : 'neutral'} className="mb-3">{book.status}</Badge>
                        <div className="flex items-center gap-2"><span className="text-xs text-text-muted/60 w-12">{Math.round((book.currentPage / book.totalPages) * 100)}%</span><ProgressBar value={book.currentPage} max={book.totalPages} color="brand" className="h-1.5" /></div>
                        <p className="text-2xs text-text-muted/50 mt-1">{book.currentPage} / {book.totalPages} pages</p>
                    </Card>
                ))}
                {books.length === 0 && <div className="col-span-full flex flex-col items-center justify-center py-16 text-text-muted/50"><BookMarked className="w-12 h-12 mb-3 text-text-muted/30" /><p className="text-sm font-medium">No books yet</p></div>}
            </div>
        </div>
    );
}
