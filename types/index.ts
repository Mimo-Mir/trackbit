// ─── Habit ───────────────────────────────────────────────────────────────────
export interface Habit {
    id: string;
    user_id?: string;
    name: string;
    color: string;       // hex color
    icon: string;        // emoji or icon key
    category?: string;
    created_at: string;
}

// ─── Task ────────────────────────────────────────────────────────────────────
export interface Task {
    id: string;
    user_id?: string;
    habit_id?: string;
    title: string;
    date: string;        // ISO date string 'YYYY-MM-DD'
    completed: boolean;
    completed_at?: string | null;
    order?: number;
    // Student OS additions
    course_id?: string;
    effort?: 'Low' | 'Medium' | 'High';
    impact?: 'Low' | 'Medium' | 'High';
    priority?: number; // 1 to 5
}

// ─── Focus Session ────────────────────────────────────────────────────────────
export interface FocusSession {
    id: string;
    user_id?: string;
    duration_minutes: number;
    distraction_count: number;
    session_type: 'focus' | 'shortBreak' | 'longBreak';
    started_at: string;
    ended_at?: string | null;
}

// ─── Streak ──────────────────────────────────────────────────────────────────
export interface Streak {
    id: string;
    user_id?: string;
    habit_id?: string;
    current_streak: number;
    longest_streak: number;
    last_active_date: string;
}

// ─── Timer ───────────────────────────────────────────────────────────────────
export type SessionType = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
    focusDuration: number;      // minutes
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsBeforeLongBreak: number;
    autoStartBreaks: boolean;
    autoStartFocus: boolean;
}

export interface TimerState {
    isRunning: boolean;
    isPaused: boolean;
    sessionType: SessionType;
    timeRemaining: number; // seconds
    completedSessions: number;
    distractionCount: number;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface UserProfile {
    id: string;
    email: string;
    display_name?: string;
    avatar_url?: string;
    timezone?: string;
    created_at: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
    streakDays: number;
    tasksCompletedToday: number;
    totalTasksToday: number;
    focusMinutesToday: number;
    weeklyCompletionRate: number;
    longestStreak: number;
}

// ─── Chart Data ───────────────────────────────────────────────────────────────
export interface ChartDataPoint {
    date: string;
    value: number;
    label?: string;
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────
export interface HeatmapCell {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4; // 0 = none, 4 = max intensity
}

// ─── Student OS Types ────────────────────────────────────────────────────────
export interface Course {
    id: string;
    name: string;
    assignmentsLeft: number;
    tasksLeft: number;
    progressPercentage: number;
}

export interface TimetableEvent {
    id: string;
    course_id: string;
    dayOfWeek: string; // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'
    startTime: string; // '09:00'
    endTime: string;   // '10:00'
}

export interface Assessment {
    id: string;
    name: string;
    course_id: string;
    type: 'Exam' | 'Assignment' | 'Quiz' | 'Project';
    dueDate: string; // ISO format or relative
    status: 'Not started' | 'In progress' | 'Completed';
}

export interface ResourceItem {
    id: string;
    title: string;
    course_id?: string;
    type: 'article' | 'video' | 'twitter' | 'job' | 'other';
    url: string;
    status: 'Not Seen' | 'Seen';
}

// ─── Semester ─────────────────────────────────────────────────────────────────
export interface Semester {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Completed' | 'Upcoming';
}

// ─── Agenda Event ─────────────────────────────────────────────────────────────
export interface AgendaEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
    type: 'Meeting' | 'Deadline' | 'Reminder' | 'Other';
}

// ─── Journal Entry ────────────────────────────────────────────────────────────
export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    date: string;
    mood: 'Great' | 'Good' | 'Okay' | 'Bad' | 'Terrible';
}

// ─── Class Content Note ──────────────────────────────────────────────────────
export interface NoteAttachment {
    id: string;
    name: string;
    type: string;       // MIME type e.g. "application/pdf"
    data: string;       // base64 data URL
    size: number;       // bytes
}

export interface ClassNote {
    id: string;
    title: string;
    course_id: string;
    content: string;
    date: string;
    attachments?: NoteAttachment[];
}

// ─── Flashcard ────────────────────────────────────────────────────────────────
export interface Flashcard {
    id: string;
    deckId: string;
    front: string;
    back: string;
}

export interface FlashcardDeck {
    id: string;
    name: string;
    course_id?: string;
    cards: Flashcard[];
}

// ─── Book Tracker ─────────────────────────────────────────────────────────────
export interface BookEntry {
    id: string;
    title: string;
    author: string;
    totalPages: number;
    currentPage: number;
    status: 'Reading' | 'Completed' | 'Want to Read';
}

// ─── Internships & Job ────────────────────────────────────────────────────────
export interface InternshipEntry {
    id: string;
    company: string;
    role: string;
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Wishlist';
    date: string;
    url?: string;
}

// ─── Admission Tracker ───────────────────────────────────────────────────────
export interface AdmissionEntry {
    id: string;
    university: string;
    program: string;
    deadline: string;
    status: 'Researching' | 'Applied' | 'Accepted' | 'Rejected' | 'Waitlisted';
}

// ─── Finance Tracker ─────────────────────────────────────────────────────────
export interface FinanceEntry {
    id: string;
    description: string;
    amount: number;
    type: 'Income' | 'Expense';
    category: string;
    date: string;
}
