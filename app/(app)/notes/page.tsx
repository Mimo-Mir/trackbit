"use client";
import React, { useState, useRef, useCallback } from "react";
import { FileText, Plus, Trash2, X, Check, Upload, Paperclip, Download, File, FileImage, FileSpreadsheet, Eye } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card } from "@/components/ui/primitives";
import type { NoteAttachment } from "@/types";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const ACCEPTED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
];

function getFileIcon(type: string) {
    if (type.startsWith("image/")) return <FileImage className="w-4 h-4" />;
    if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) return <FileSpreadsheet className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
}

function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToAttachment(file: globalThis.File): Promise<NoteAttachment | null> {
    return new Promise((resolve) => {
        if (file.size > MAX_FILE_SIZE) {
            alert(`File "${file.name}" exceeds 5MB limit.`);
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            resolve({
                id: `att-${generateId()}`,
                name: file.name,
                type: file.type || "application/octet-stream",
                data: reader.result as string,
                size: file.size,
            });
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });
}

export default function NotesPage() {
    const { classNotes, courses, addClassNote, updateClassNote, deleteClassNote } = useStudentStore();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', course_id: '', content: '', date: new Date().toISOString().split('T')[0] });
    const [attachments, setAttachments] = useState<NoteAttachment[]>([]);
    const [dragging, setDragging] = useState(false);
    const [expandedNote, setExpandedNote] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const resetForm = () => {
        setForm({ title: '', course_id: '', content: '', date: new Date().toISOString().split('T')[0] });
        setAttachments([]);
        setShowForm(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        addClassNote({
            id: `cn-${generateId()}`,
            ...form,
            attachments: attachments.length > 0 ? attachments : undefined,
        });
        resetForm();
    };

    const processFiles = useCallback(async (files: FileList | globalThis.File[]) => {
        const fileArray = Array.from(files);
        const results = await Promise.all(fileArray.map(fileToAttachment));
        const valid = results.filter((r): r is NoteAttachment => r !== null);
        if (valid.length > 0) {
            setAttachments(prev => [...prev, ...valid]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
            e.target.value = '';
        }
    };

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        const files: globalThis.File[] = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (file) files.push(file);
            }
        }
        if (files.length > 0) {
            e.preventDefault();
            processFiles(files);
        }
    }, [processFiles]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    }, [processFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
    }, []);

    const removeAttachment = (id: string) => {
        setAttachments(prev => prev.filter(a => a.id !== id));
    };

    const downloadAttachment = (att: NoteAttachment) => {
        const link = document.createElement('a');
        link.href = att.data;
        link.download = att.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openAttachment = (att: NoteAttachment) => {
        window.open(att.data, '_blank');
    };

    const removeNoteAttachment = (noteId: string, attId: string) => {
        const note = classNotes.find(n => n.id === noteId);
        if (!note?.attachments) return;
        const updated = note.attachments.filter(a => a.id !== attId);
        updateClassNote(noteId, { attachments: updated.length > 0 ? updated : undefined });
    };

    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow"><FileText className="w-5 h-5 text-text-primary" /></div>
                    <div><h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Class Content Notes</h1><p className="text-xs text-text-muted/70 mt-0.5">{classNotes.length} notes</p></div>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none shadow-glow"><Plus className="w-4 h-4" /> New Note</button>
            </div>

            {showForm && (
                <Card className="p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-text-primary">New Note</h3>
                        <button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs text-text-muted/70 mb-1">Title</label>
                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Note title"
                                    className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus />
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted/70 mb-1">Course</label>
                                <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}
                                    className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50">
                                    <option value="">Select course</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Content area with paste support */}
                        <div>
                            <label className="block text-xs text-text-muted/70 mb-1">Content</label>
                            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} onPaste={handlePaste}
                                rows={6} placeholder="Your notes... (paste files with Ctrl+V)"
                                className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50 resize-none" />
                        </div>

                        {/* File Drop Zone */}
                        <div
                            ref={dropZoneRef}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "border-2 border-dashed rounded-[2px] p-4 text-center cursor-pointer transition-colors",
                                dragging
                                    ? "border-brand-500 bg-brand-600/10"
                                    : "border-surface-400/50 hover:border-brand-500/40"
                            )}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept={ACCEPTED_TYPES.join(",")}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Upload className="w-6 h-6 mx-auto mb-2 text-text-muted/50" />
                            <p className="text-xs text-text-muted/60">
                                <span className="text-brand-400">Click to upload</span> or drag &amp; drop files here
                            </p>
                            <p className="text-2xs text-white/25 mt-1">PDF, Word, Excel, PowerPoint, Images, Text (max 5MB each)</p>
                        </div>

                        {/* Attachment preview list */}
                        {attachments.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs text-text-muted/70"><Paperclip className="w-3 h-3 inline mr-1" />{attachments.length} file{attachments.length > 1 ? 's' : ''} attached</p>
                                <div className="flex flex-wrap gap-2">
                                    {attachments.map(att => (
                                        <div key={att.id} className="flex items-center gap-2 px-3 py-2 bg-surface-700 border border-surface-400/40 rounded-[2px] text-xs text-text-primary group">
                                            {getFileIcon(att.type)}
                                            <span className="truncate max-w-[160px]">{att.name}</span>
                                            <span className="text-text-muted/50">{formatSize(att.size)}</span>
                                            <button type="button" onClick={(e) => { e.stopPropagation(); removeAttachment(att.id); }}
                                                className="p-0.5 text-text-muted/50 hover:text-danger-400 transition-none">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none">
                                <Check className="w-4 h-4" /> Save Note
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {classNotes.map(note => {
                    const course = courses.find(c => c.id === note.course_id);
                    const isExpanded = expandedNote === note.id;
                    const hasAttachments = note.attachments && note.attachments.length > 0;
                    return (
                        <Card key={note.id} className="p-5 bg-surface-800 border-surface-400/40 hover:border-brand-500/20 transition-all group">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-sm font-bold text-text-primary">{note.title}</h3>
                                <button onClick={() => deleteClassNote(note.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/50 hover:text-danger-400 transition-none opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                            {course && <p className="text-2xs text-brand-400 mb-2">{course.name}</p>}
                            <p className={cn("text-xs text-text-muted/70 whitespace-pre-wrap", !isExpanded && "line-clamp-4")}>{note.content}</p>
                            {note.content.length > 200 && (
                                <button onClick={() => setExpandedNote(isExpanded ? null : note.id)} className="text-2xs text-brand-400 mt-1 hover:underline">
                                    {isExpanded ? "Show less" : "Show more"}
                                </button>
                            )}

                            {/* Attachments */}
                            {hasAttachments && (
                                <div className="mt-3 pt-3 border-t border-surface-400/20 space-y-1.5">
                                    <p className="text-2xs text-text-muted/50 flex items-center gap-1"><Paperclip className="w-3 h-3" />{note.attachments!.length} attachment{note.attachments!.length > 1 ? 's' : ''}</p>
                                    {note.attachments!.map(att => (
                                        <div key={att.id} className="flex items-center gap-2 px-2 py-1.5 bg-surface-700/50 rounded-[2px] text-2xs text-text-muted/80 group/att">
                                            {getFileIcon(att.type)}
                                            <span className="truncate flex-1">{att.name}</span>
                                            <span className="text-white/25">{formatSize(att.size)}</span>
                                            <button onClick={() => openAttachment(att)} className="p-0.5 text-brand-400 hover:text-brand-300 transition-none" title="Open">
                                                <Eye className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => downloadAttachment(att)} className="p-0.5 text-brand-400 hover:text-brand-300 transition-none" title="Download">
                                                <Download className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => removeNoteAttachment(note.id, att.id)} className="p-0.5 text-text-muted/40 hover:text-danger-400 transition-none opacity-0 group-hover/att:opacity-100" title="Remove">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-2xs text-text-muted/40 mt-3">{note.date}</p>
                        </Card>
                    );
                })}
                {classNotes.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-text-muted/50">
                        <FileText className="w-12 h-12 mb-3 text-text-muted/30" />
                        <p className="text-sm font-medium">No class notes yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
