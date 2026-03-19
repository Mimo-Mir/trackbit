"use client";
import React, { useState } from "react";
import { Layers, Plus, Trash2, X, Check, RotateCcw } from "lucide-react";
import { useStudentStore, generateId } from "@/lib/store";
import { Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export default function FlashcardsPage() {
    const { flashcardDecks, courses, addFlashcardDeck, deleteFlashcardDeck, addFlashcard, deleteFlashcard } = useStudentStore();
    const [showDeckForm, setShowDeckForm] = useState(false);
    const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
    const [showCardForm, setShowCardForm] = useState(false);
    const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
    const [deckForm, setDeckForm] = useState({ name: '', course_id: '' });
    const [cardForm, setCardForm] = useState({ front: '', back: '' });

    const handleAddDeck = (e: React.FormEvent) => {
        e.preventDefault(); if (!deckForm.name.trim()) return;
        addFlashcardDeck({ id: `fd-${generateId()}`, name: deckForm.name, course_id: deckForm.course_id || undefined, cards: [] });
        setDeckForm({ name: '', course_id: '' }); setShowDeckForm(false);
    };
    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault(); if (!cardForm.front.trim() || !activeDeckId) return;
        addFlashcard(activeDeckId, { id: `fc-${generateId()}`, deckId: activeDeckId, front: cardForm.front, back: cardForm.back });
        setCardForm({ front: '', back: '' }); setShowCardForm(false);
    };
    const toggleFlip = (cardId: string) => { setFlippedCards(prev => { const next = new Set(prev); if (next.has(cardId)) next.delete(cardId); else next.add(cardId); return next; }); };
    const activeDeck = flashcardDecks.find(d => d.id === activeDeckId);

    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-fade-in bg-surface-900 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow"><Layers className="w-5 h-5 text-text-primary" /></div>
                    <div><h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Flashcards</h1><p className="text-xs text-text-muted/70 mt-0.5">{flashcardDecks.length} decks</p></div>
                </div>
                <button onClick={() => setShowDeckForm(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none shadow-glow"><Plus className="w-4 h-4" /> New Deck</button>
            </div>
            {showDeckForm && (
                <Card className="p-6 bg-surface-800 border-brand-500/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-text-primary">New Deck</h3><button onClick={() => setShowDeckForm(false)} className="text-text-muted/60 hover:text-text-primary"><X className="w-4 h-4" /></button></div>
                    <form onSubmit={handleAddDeck} className="grid grid-cols-3 gap-4">
                        <div><label className="block text-xs text-text-muted/70 mb-1">Deck Name</label><input type="text" value={deckForm.name} onChange={e => setDeckForm({...deckForm, name: e.target.value})} placeholder="e.g. Biology Ch.1" className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus /></div>
                        <div><label className="block text-xs text-text-muted/70 mb-1">Course (optional)</label><select value={deckForm.course_id} onChange={e => setDeckForm({...deckForm, course_id: e.target.value})} className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary focus:outline-none focus:border-brand-500/50"><option value="">None</option>{courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                        <div className="flex items-end"><button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-text-primary rounded-[2px] text-sm font-medium hover:bg-brand-500 transition-none"><Check className="w-4 h-4" /> Create</button></div>
                    </form>
                </Card>
            )}
            {!activeDeck ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {flashcardDecks.map(deck => {
                        const course = courses.find(c => c.id === deck.course_id);
                        return (
                            <Card key={deck.id} className="p-5 bg-surface-800 border-surface-400/40 hover:border-brand-500/20 transition-all cursor-pointer group" onClick={() => setActiveDeckId(deck.id)}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-base font-bold text-text-primary">{deck.name}</h3>
                                    <button onClick={(e) => { e.stopPropagation(); deleteFlashcardDeck(deck.id); }} className="p-1.5 rounded-[2px] hover:bg-surface-700 text-text-muted/50 hover:text-danger-400 transition-none opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                                {course && <p className="text-2xs text-brand-400 mb-1">{course.name}</p>}
                                <p className="text-xs text-text-muted/60">{deck.cards.length} cards</p>
                            </Card>
                        );
                    })}
                    {flashcardDecks.length === 0 && <div className="col-span-full flex flex-col items-center justify-center py-16 text-text-muted/50"><Layers className="w-12 h-12 mb-3 text-text-muted/30" /><p className="text-sm font-medium">No decks yet</p></div>}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveDeckId(null)} className="text-xs text-text-muted/60 hover:text-text-primary transition-none">← Back to Decks</button>
                        <h2 className="text-lg font-bold text-text-primary">{activeDeck.name}</h2>
                        <button onClick={() => setShowCardForm(true)} className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-brand-600 text-text-primary rounded-[2px] text-xs font-medium hover:bg-brand-500 transition-none"><Plus className="w-3 h-3" /> Add Card</button>
                    </div>
                    {showCardForm && (
                        <Card className="p-4 bg-surface-800 border-brand-500/20 animate-fade-in">
                            <form onSubmit={handleAddCard} className="grid grid-cols-5 gap-4">
                                <div className="col-span-2"><label className="block text-xs text-text-muted/70 mb-1">Front</label><input type="text" value={cardForm.front} onChange={e => setCardForm({...cardForm, front: e.target.value})} placeholder="Question" className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" autoFocus /></div>
                                <div className="col-span-2"><label className="block text-xs text-text-muted/70 mb-1">Back</label><input type="text" value={cardForm.back} onChange={e => setCardForm({...cardForm, back: e.target.value})} placeholder="Answer" className="w-full px-3 py-2 bg-surface-900 border-2 border-surface-400/50 rounded-[2px] text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/50" /></div>
                                <div className="flex items-end gap-2"><button type="submit" className="px-3 py-2 bg-brand-600 text-text-primary rounded-[2px] text-xs font-medium hover:bg-brand-500 transition-none"><Check className="w-3.5 h-3.5" /></button><button type="button" onClick={() => setShowCardForm(false)} className="px-3 py-2 text-text-muted/60 hover:text-text-primary text-xs"><X className="w-3.5 h-3.5" /></button></div>
                            </form>
                        </Card>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeDeck.cards.map(card => (
                            <div key={card.id} onClick={() => toggleFlip(card.id)} className="cursor-pointer perspective-1000">
                                <Card className={cn("p-6 bg-surface-800 border-surface-400/40 min-h-[140px] flex flex-col items-center justify-center text-center transition-none hover:border-brand-500/20", flippedCards.has(card.id) && "bg-brand-600/10 border-brand-500/30")}>
                                    <p className="text-xs text-text-muted/50 mb-2">{flippedCards.has(card.id) ? 'Answer' : 'Question'}</p>
                                    <p className="text-sm font-medium text-text-primary">{flippedCards.has(card.id) ? card.back : card.front}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <RotateCcw className="w-3 h-3 text-text-muted/40" /><span className="text-2xs text-text-muted/40">Click to flip</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); deleteFlashcard(activeDeck.id, card.id); }} className="absolute top-2 right-2 p-1 rounded hover:bg-surface-700 text-text-muted/40 hover:text-danger-400 opacity-0 group-hover:opacity-100 transition-none"><Trash2 className="w-3 h-3" /></button>
                                </Card>
                            </div>
                        ))}
                        {activeDeck.cards.length === 0 && <div className="col-span-full text-center py-12 text-text-muted/50 text-sm">No cards yet. Add your first card!</div>}
                    </div>
                </div>
            )}
        </div>
    );
}
