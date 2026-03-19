import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course, TimetableEvent, Assessment, Task, ResourceItem, Semester, AgendaEvent, JournalEntry, ClassNote, FlashcardDeck, Flashcard, BookEntry, InternshipEntry, AdmissionEntry, FinanceEntry, Habit, FocusSession, TimerSettings } from '@/types';
import { mockCourses, mockTimetable, mockAssessments, mockStudentTasks, mockResources, mockHabits, mockFocusSessions, mockWeeklyGrid } from './mockData';

// ─── Helper ─────────────────────────────────────────────────────────────────
export const generateId = () => Math.random().toString(36).substring(2, 10);

// ─── Store Interface ──────────────────────────────────────────────────────────
interface StudentOSStore {
    courses: Course[]; timetable: TimetableEvent[]; assessments: Assessment[]; tasks: Task[]; resources: ResourceItem[];
    semesters: Semester[]; agendaEvents: AgendaEvent[]; journal: JournalEntry[]; classNotes: ClassNote[];
    flashcardDecks: FlashcardDeck[]; books: BookEntry[]; internships: InternshipEntry[]; admissions: AdmissionEntry[]; finances: FinanceEntry[];
    habits: Habit[]; focusSessions: FocusSession[]; habitCompletions: Record<string, Record<string, boolean>>; timerSettings: TimerSettings;

    // Course
    addCourse: (c: Course) => void; updateCourse: (id: string, u: Partial<Course>) => void; deleteCourse: (id: string) => void;
    // Timetable
    addTimetableEvent: (e: TimetableEvent) => void; updateTimetableEvent: (id: string, u: Partial<TimetableEvent>) => void; deleteTimetableEvent: (id: string) => void;
    // Assessment
    addAssessment: (a: Assessment) => void; updateAssessment: (id: string, u: Partial<Assessment>) => void; deleteAssessment: (id: string) => void;
    // Task
    addTask: (t: Task) => void; updateTask: (id: string, u: Partial<Task>) => void; deleteTask: (id: string) => void; toggleTask: (id: string) => void;
    // Resource
    addResource: (r: ResourceItem) => void; updateResource: (id: string, u: Partial<ResourceItem>) => void; deleteResource: (id: string) => void;
    // Semester
    addSemester: (s: Semester) => void; updateSemester: (id: string, u: Partial<Semester>) => void; deleteSemester: (id: string) => void;
    // Agenda
    addAgendaEvent: (e: AgendaEvent) => void; updateAgendaEvent: (id: string, u: Partial<AgendaEvent>) => void; deleteAgendaEvent: (id: string) => void;
    // Journal
    addJournalEntry: (j: JournalEntry) => void; updateJournalEntry: (id: string, u: Partial<JournalEntry>) => void; deleteJournalEntry: (id: string) => void;
    // Class Notes
    addClassNote: (n: ClassNote) => void; updateClassNote: (id: string, u: Partial<ClassNote>) => void; deleteClassNote: (id: string) => void;
    // Flashcards
    addFlashcardDeck: (d: FlashcardDeck) => void; deleteFlashcardDeck: (id: string) => void;
    addFlashcard: (deckId: string, card: Flashcard) => void; deleteFlashcard: (deckId: string, cardId: string) => void;
    // Books
    addBook: (b: BookEntry) => void; updateBook: (id: string, u: Partial<BookEntry>) => void; deleteBook: (id: string) => void;
    // Internships
    addInternship: (i: InternshipEntry) => void; updateInternship: (id: string, u: Partial<InternshipEntry>) => void; deleteInternship: (id: string) => void;
    // Admissions
    addAdmission: (a: AdmissionEntry) => void; updateAdmission: (id: string, u: Partial<AdmissionEntry>) => void; deleteAdmission: (id: string) => void;
    // Finance
    addFinance: (f: FinanceEntry) => void; updateFinance: (id: string, u: Partial<FinanceEntry>) => void; deleteFinance: (id: string) => void;
    // Habits
    addHabit: (h: Habit) => void; updateHabit: (id: string, u: Partial<Habit>) => void; deleteHabit: (id: string) => void;
    // Habit Completions
    toggleHabitCompletion: (date: string, habitId: string) => void;
    // Focus Sessions
    addFocusSession: (s: FocusSession) => void;
    // Timer Settings
    updateTimerSettings: (u: Partial<TimerSettings>) => void;
}


export const useStudentStore = create<StudentOSStore>()(
    persist(
        (set) => ({
            // Initial data
            courses: mockCourses, timetable: mockTimetable, assessments: mockAssessments, tasks: mockStudentTasks, resources: mockResources,
            semesters: [], agendaEvents: [], journal: [], classNotes: [], flashcardDecks: [], books: [], internships: [], admissions: [], finances: [],
            habits: mockHabits, focusSessions: mockFocusSessions, habitCompletions: mockWeeklyGrid,
            timerSettings: { focusDuration: 25, shortBreakDuration: 5, longBreakDuration: 15, sessionsBeforeLongBreak: 4, autoStartBreaks: false, autoStartFocus: false },

            // ── Course ─────────────────────
            addCourse: (c) => set((s) => ({ courses: [...s.courses, { ...c, id: c.id || `c-${generateId()}` }] })),
            updateCourse: (id, u) => set((s) => ({ courses: s.courses.map((c) => c.id === id ? { ...c, ...u } : c) })),
            deleteCourse: (id) => set((s) => ({ courses: s.courses.filter((c) => c.id !== id) })),

            // ── Timetable ──────────────────
            addTimetableEvent: (e) => set((s) => ({ timetable: [...s.timetable, { ...e, id: e.id || `tt-${generateId()}` }] })),
            updateTimetableEvent: (id, u) => set((s) => ({ timetable: s.timetable.map((e) => e.id === id ? { ...e, ...u } : e) })),
            deleteTimetableEvent: (id) => set((s) => ({ timetable: s.timetable.filter((e) => e.id !== id) })),

            // ── Assessment ─────────────────
            addAssessment: (a) => set((s) => ({ assessments: [...s.assessments, { ...a, id: a.id || `a-${generateId()}` }] })),
            updateAssessment: (id, u) => set((s) => ({ assessments: s.assessments.map((a) => a.id === id ? { ...a, ...u } : a) })),
            deleteAssessment: (id) => set((s) => ({ assessments: s.assessments.filter((a) => a.id !== id) })),

            // ── Task ───────────────────────
            addTask: (t) => set((s) => ({ tasks: [...s.tasks, { ...t, id: t.id || `st-${generateId()}` }] })),
            updateTask: (id, u) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, ...u } : t) })),
            deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
            toggleTask: (id) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed, completed_at: !t.completed ? new Date().toISOString() : null } : t) })),

            // ── Resource ───────────────────
            addResource: (r) => set((s) => ({ resources: [...s.resources, { ...r, id: r.id || `r-${generateId()}` }] })),
            updateResource: (id, u) => set((s) => ({ resources: s.resources.map((r) => r.id === id ? { ...r, ...u } : r) })),
            deleteResource: (id) => set((s) => ({ resources: s.resources.filter((r) => r.id !== id) })),

            // ── Semester ───────────────────
            addSemester: (s2) => set((s) => ({ semesters: [...s.semesters, { ...s2, id: s2.id || `sem-${generateId()}` }] })),
            updateSemester: (id, u) => set((s) => ({ semesters: s.semesters.map((x) => x.id === id ? { ...x, ...u } : x) })),
            deleteSemester: (id) => set((s) => ({ semesters: s.semesters.filter((x) => x.id !== id) })),

            // ── Agenda ─────────────────────
            addAgendaEvent: (e) => set((s) => ({ agendaEvents: [...s.agendaEvents, { ...e, id: e.id || `ae-${generateId()}` }] })),
            updateAgendaEvent: (id, u) => set((s) => ({ agendaEvents: s.agendaEvents.map((e) => e.id === id ? { ...e, ...u } : e) })),
            deleteAgendaEvent: (id) => set((s) => ({ agendaEvents: s.agendaEvents.filter((e) => e.id !== id) })),

            // ── Journal ────────────────────
            addJournalEntry: (j) => set((s) => ({ journal: [...s.journal, { ...j, id: j.id || `j-${generateId()}` }] })),
            updateJournalEntry: (id, u) => set((s) => ({ journal: s.journal.map((j) => j.id === id ? { ...j, ...u } : j) })),
            deleteJournalEntry: (id) => set((s) => ({ journal: s.journal.filter((j) => j.id !== id) })),

            // ── Class Notes ────────────────
            addClassNote: (n) => set((s) => ({ classNotes: [...s.classNotes, { ...n, id: n.id || `cn-${generateId()}` }] })),
            updateClassNote: (id, u) => set((s) => ({ classNotes: s.classNotes.map((n) => n.id === id ? { ...n, ...u } : n) })),
            deleteClassNote: (id) => set((s) => ({ classNotes: s.classNotes.filter((n) => n.id !== id) })),

            // ── Flashcards ─────────────────
            addFlashcardDeck: (d) => set((s) => ({ flashcardDecks: [...s.flashcardDecks, { ...d, id: d.id || `fd-${generateId()}` }] })),
            deleteFlashcardDeck: (id) => set((s) => ({ flashcardDecks: s.flashcardDecks.filter((d) => d.id !== id) })),
            addFlashcard: (deckId, card) => set((s) => ({
                flashcardDecks: s.flashcardDecks.map((d) => d.id === deckId ? { ...d, cards: [...d.cards, { ...card, id: card.id || `fc-${generateId()}`, deckId }] } : d)
            })),
            deleteFlashcard: (deckId, cardId) => set((s) => ({
                flashcardDecks: s.flashcardDecks.map((d) => d.id === deckId ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) } : d)
            })),

            // ── Books ──────────────────────
            addBook: (b) => set((s) => ({ books: [...s.books, { ...b, id: b.id || `bk-${generateId()}` }] })),
            updateBook: (id, u) => set((s) => ({ books: s.books.map((b) => b.id === id ? { ...b, ...u } : b) })),
            deleteBook: (id) => set((s) => ({ books: s.books.filter((b) => b.id !== id) })),

            // ── Internships ────────────────
            addInternship: (i) => set((s) => ({ internships: [...s.internships, { ...i, id: i.id || `in-${generateId()}` }] })),
            updateInternship: (id, u) => set((s) => ({ internships: s.internships.map((i) => i.id === id ? { ...i, ...u } : i) })),
            deleteInternship: (id) => set((s) => ({ internships: s.internships.filter((i) => i.id !== id) })),

            // ── Admissions ─────────────────
            addAdmission: (a) => set((s) => ({ admissions: [...s.admissions, { ...a, id: a.id || `ad-${generateId()}` }] })),
            updateAdmission: (id, u) => set((s) => ({ admissions: s.admissions.map((a) => a.id === id ? { ...a, ...u } : a) })),
            deleteAdmission: (id) => set((s) => ({ admissions: s.admissions.filter((a) => a.id !== id) })),

            // ── Finance ────────────────────
            addFinance: (f) => set((s) => ({ finances: [...s.finances, { ...f, id: f.id || `fi-${generateId()}` }] })),
            updateFinance: (id, u) => set((s) => ({ finances: s.finances.map((f) => f.id === id ? { ...f, ...u } : f) })),
            deleteFinance: (id) => set((s) => ({ finances: s.finances.filter((f) => f.id !== id) })),

            // ── Habits ───────────────────────
            addHabit: (h) => set((s) => ({ habits: [...s.habits, { ...h, id: h.id || `h-${generateId()}` }] })),
            updateHabit: (id, u) => set((s) => ({ habits: s.habits.map((h) => h.id === id ? { ...h, ...u } : h) })),
            deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

            // ── Habit Completions ────────────
            toggleHabitCompletion: (date, habitId) => set((s) => {
                const dayMap = { ...(s.habitCompletions[date] || {}) };
                dayMap[habitId] = !dayMap[habitId];
                return { habitCompletions: { ...s.habitCompletions, [date]: dayMap } };
            }),

            // ── Focus Sessions ───────────────
            addFocusSession: (fs) => set((s) => ({ focusSessions: [...s.focusSessions, { ...fs, id: fs.id || `fs-${generateId()}` }] })),

            // ── Timer Settings ───────────────
            updateTimerSettings: (u) => set((s) => ({ timerSettings: { ...s.timerSettings, ...u } })),
        }),
        { name: 'student-os-storage' }
    )
);
