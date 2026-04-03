"use client";
import React, { useState } from "react";
import { Wallet, Plus, Trash2, X, Check, TrendingUp, TrendingDown } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import type { FinanceEntry } from "@/types";

export default function FinancePage() {
    const { finances, addFinance, deleteFinance } = useStudentStore();
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState<'all' | 'Income' | 'Expense'>('all');
    const [form, setForm] = useState({ description: '', amount: 0, type: 'Expense' as FinanceEntry['type'], category: 'General', date: new Date().toISOString().split('T')[0] });
    const resetForm = () => { setForm({ description: '', amount: 0, type: 'Expense', category: 'General', date: new Date().toISOString().split('T')[0] }); setShowForm(false); };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); if (!form.description.trim() || form.amount <= 0) return;
        addFinance({ id: `fi-${generateId()}`, ...form }); resetForm();
    };
    const totalIncome = finances.filter(f => f.type === 'Income').reduce((s, f) => s + f.amount, 0);
    const totalExpense = finances.filter(f => f.type === 'Expense').reduce((s, f) => s + f.amount, 0);
    const filtered = finances.filter(f => filter === 'all' ? true : f.type === filter).sort((a, b) => b.date.localeCompare(a.date));
    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow shrink-0"><Wallet className="w-5 h-5 text-text-primary" /></div>
                    <div className="min-w-0"><h1 className="font-display font-bold text-xs sm:text-sm uppercase tracking-widest text-text-primary truncate">Finance Tracker</h1><p className="text-xs text-text-muted/70 mt-0.5">{finances.length} transactions</p></div>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-xs sm:text-sm font-medium hover:bg-brand-500 transition-none shadow-glow shrink-0"><Plus className="w-4 h-4" /><span className="hidden sm:inline"> Add Transaction</span><span className="sm:hidden">Add</span></button>
            </div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Card className="p-3 sm:p-4 bg-surface-800 border-surface-400/40"><p className="text-xs text-text-muted/60 mb-1">Income</p><p className="text-lg sm:text-xl font-bold text-brand-400 flex items-center gap-2"><TrendingUp className="w-4 h-4" />${totalIncome.toFixed(2)}</p></Card>
                <Card className="p-3 sm:p-4 bg-surface-800 border-surface-400/40"><p className="text-xs text-text-muted/60 mb-1">Expenses</p><p className="text-lg sm:text-xl font-bold text-danger-400 flex items-center gap-2"><TrendingDown className="w-4 h-4" />${totalExpense.toFixed(2)}</p></Card>
                <Card className="p-3 sm:p-4 bg-surface-800 border-surface-400/40"><p className="text-xs text-text-muted/60 mb-1">Balance</p><p className={cn("text-lg sm:text-xl font-bold", totalIncome - totalExpense >= 0 ? "text-brand-400" : "text-danger-400")}>${(totalIncome - totalExpense).toFixed(2)}</p></Card>
            </div>
            {showForm && (
                <Card className="p-4 sm:p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-text-primary">New Transaction</h3><button onClick={resetForm} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button></div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="sm:col-span-2 lg:col-span-1"><label className="block text-xs text-text-muted/70 mb-1">Description</label><input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="e.g. Textbook purchase" className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Amount ($)</label><input type="number" min={0} step="0.01" value={form.amount} onChange={e => setForm({...form, amount: Number(e.target.value)})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50" /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value as FinanceEntry['type']})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50"><option>Income</option><option>Expense</option></select></div>
                        <div className="flex items-end"><button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none"><Check className="w-4 h-4" /> Add</button></div>
                    </form>
                </Card>
            )}
            <div className="flex flex-wrap gap-2">
                {(['all', 'Income', 'Expense'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={cn("px-3 sm:px-4 py-1.5 rounded-[2px] text-xs font-medium transition-all capitalize", filter === f ? "bg-brand-600/20 text-brand-400 border border-brand-500/30" : "text-text-muted/60 hover:text-text-primary border-2 border-surface-400/50 hover:border-surface-400/50")}>{f}</button>
                ))}
            </div>
            <Card className="bg-surface-800 border-surface-400/40 overflow-hidden">
                <div className="divide-y divide-surface-400/20">
                    {filtered.map(f => (
                        <div key={f.id} className="flex items-center justify-between p-3 text-xs hover:bg-surface-700/50 transition-none group gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={cn("w-8 h-8 rounded-[2px] flex items-center justify-center shrink-0", f.type === 'Income' ? "bg-brand-600/20" : "bg-danger-400/20")}>{f.type === 'Income' ? <TrendingUp className="w-4 h-4 text-brand-400" /> : <TrendingDown className="w-4 h-4 text-danger-400" />}</div>
                                <div className="min-w-0"><p className="text-text-primary font-medium truncate">{f.description}</p><p className="text-2xs text-text-muted/50 truncate">{f.date} · {f.category}</p></div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                <span className={cn("font-bold whitespace-nowrap", f.type === 'Income' ? "text-brand-400" : "text-danger-400")}>{f.type === 'Income' ? '+' : '-'}${f.amount.toFixed(2)}</span>
                                <button onClick={() => deleteFinance(f.id)} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/50 hover:text-danger-400 transition-none opacity-100 sm:opacity-0 sm:group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && <div className="p-12 text-center text-text-muted/50"><Wallet className="w-10 h-10 mx-auto mb-2 text-text-muted/30" /><p className="text-sm">No transactions yet</p></div>}
                </div>
            </Card>
        </div>
    );
}
