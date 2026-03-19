import type { Habit, Task, FocusSession, DashboardStats, ChartDataPoint, HeatmapCell } from "@/types";

// ─── Habits ───────────────────────────────────────────────────────────────
export const mockHabits: Habit[] = [
    { id: "h1", name: "Morning Run", color: "#39ff14", icon: "🏃", category: "fitness", created_at: "2025-01-01" },
    { id: "h2", name: "Deep Reading", color: "#ff44cc", icon: "📚", category: "learning", created_at: "2025-01-01" },
    { id: "h3", name: "Meditation", color: "#00dd88", icon: "🧘", category: "mindfulness", created_at: "2025-01-05" },
    { id: "h4", name: "Drink 8 Glasses", color: "#00ccff", icon: "💧", category: "health", created_at: "2025-01-10" },
    { id: "h5", name: "Journaling", color: "#ffcc00", icon: "✍️", category: "mental", created_at: "2025-01-15" },
];

// ─── Tasks (today) ────────────────────────────────────────────────────────
export const mockTasks: Task[] = [
    { id: "t1", habit_id: "h1", title: "Morning Run — 5km", date: "2026-03-09", completed: true, completed_at: "2026-03-09T07:15:00Z", order: 1 },
    { id: "t2", habit_id: "h2", title: "Read 30 pages", date: "2026-03-09", completed: true, completed_at: "2026-03-09T08:00:00Z", order: 2 },
    { id: "t3", habit_id: "h3", title: "10min Meditation", date: "2026-03-09", completed: false, order: 3 },
    { id: "t4", habit_id: "h4", title: "Drink 8 glasses", date: "2026-03-09", completed: false, order: 4 },
    { id: "t5", habit_id: "h5", title: "Evening journal entry", date: "2026-03-09", completed: false, order: 5 },
    { id: "t6", habit_id: "h1", title: "Evening walk — 2km", date: "2026-03-09", completed: false, order: 6 },
];

// ─── Focus Sessions ───────────────────────────────────────────────────────
export const mockFocusSessions: FocusSession[] = [
    { id: "fs1", duration_minutes: 25, distraction_count: 1, session_type: "focus", started_at: "2026-03-09T09:00:00Z", ended_at: "2026-03-09T09:25:00Z" },
    { id: "fs2", duration_minutes: 5, distraction_count: 0, session_type: "shortBreak", started_at: "2026-03-09T09:25:00Z", ended_at: "2026-03-09T09:30:00Z" },
    { id: "fs3", duration_minutes: 25, distraction_count: 0, session_type: "focus", started_at: "2026-03-09T09:30:00Z", ended_at: "2026-03-09T09:55:00Z" },
    { id: "fs4", duration_minutes: 25, distraction_count: 3, session_type: "focus", started_at: "2026-03-09T10:10:00Z", ended_at: "2026-03-09T10:35:00Z" },
];

// ─── Dashboard Stats ──────────────────────────────────────────────────────
export const mockStats: DashboardStats = {
    streakDays: 21,
    tasksCompletedToday: 2,
    totalTasksToday: 6,
    focusMinutesToday: 75,
    weeklyCompletionRate: 78,
    longestStreak: 34,
};

// ─── Chart Data (last 14 days habit completion %) ─────────────────────────
export const mockChartData: ChartDataPoint[] = [
    { date: "2026-02-24", value: 60 },
    { date: "2026-02-25", value: 80 },
    { date: "2026-02-26", value: 100 },
    { date: "2026-02-27", value: 40 },
    { date: "2026-02-28", value: 60 },
    { date: "2026-03-01", value: 80 },
    { date: "2026-03-02", value: 100 },
    { date: "2026-03-03", value: 100 },
    { date: "2026-03-04", value: 60 },
    { date: "2026-03-05", value: 80 },
    { date: "2026-03-06", value: 100 },
    { date: "2026-03-07", value: 80 },
    { date: "2026-03-08", value: 100 },
    { date: "2026-03-09", value: 40 },
];

// ─── Heatmap Data (last 84 days) ──────────────────────────────────────────
export function generateHeatmapData(): HeatmapCell[] {
    const cells: HeatmapCell[] = [];
    const today = new Date("2026-03-09");
    for (let i = 83; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const rand = Math.random();
        const count = rand < 0.2 ? 0 : rand < 0.4 ? 1 : rand < 0.6 ? 2 : rand < 0.8 ? 3 : 4;
        cells.push({
            date: dateStr,
            count,
            level: count as 0 | 1 | 2 | 3 | 4,
        });
    }
    return cells;
}

// ─── Weekly grid (7 days × 5 habits) ─────────────────────────────────────
export const mockWeeklyGrid: Record<string, Record<string, boolean>> = {
    "2026-03-03": { h1: true, h2: true, h3: true, h4: true, h5: true },
    "2026-03-04": { h1: true, h2: false, h3: true, h4: true, h5: false },
    "2026-03-05": { h1: false, h2: true, h3: true, h4: true, h5: true },
    "2026-03-06": { h1: true, h2: true, h3: false, h4: true, h5: true },
    "2026-03-07": { h1: true, h2: true, h3: true, h4: true, h5: false },
    "2026-03-08": { h1: true, h2: true, h3: true, h4: false, h5: true },
    "2026-03-09": { h1: true, h2: true, h3: false, h4: false, h5: false },
};

// ─── Student OS Mock Data ──────────────────────────────────────────────────
import type { Course, TimetableEvent, Assessment, ResourceItem } from "@/types";

export const mockCourses: Course[] = [
    { id: "c1", name: "English", assignmentsLeft: 2, tasksLeft: 1, progressPercentage: 50 },
    { id: "c2", name: "Biology", assignmentsLeft: 2, tasksLeft: 1, progressPercentage: 0 },
    { id: "c3", name: "Chemistry", assignmentsLeft: 2, tasksLeft: 1, progressPercentage: 0 },
    { id: "c4", name: "Math", assignmentsLeft: 2, tasksLeft: 1, progressPercentage: 33.3 },
];

export const mockTimetable: TimetableEvent[] = [
    { id: "tt1", course_id: "c1", dayOfWeek: "Mon", startTime: "09:00", endTime: "10:00" },
    { id: "tt2", course_id: "c2", dayOfWeek: "Mon", startTime: "10:00", endTime: "11:00" },
    { id: "tt3", course_id: "c3", dayOfWeek: "Mon", startTime: "11:00", endTime: "12:00" },
    { id: "tt4", course_id: "c4", dayOfWeek: "Tue", startTime: "09:00", endTime: "10:00" },
    { id: "tt5", course_id: "c2", dayOfWeek: "Tue", startTime: "10:00", endTime: "11:00" },
    { id: "tt6", course_id: "c1", dayOfWeek: "Wed", startTime: "10:00", endTime: "11:00" },
    { id: "tt7", course_id: "c2", dayOfWeek: "Thu", startTime: "09:00", endTime: "10:00" },
    { id: "tt8", course_id: "c4", dayOfWeek: "Thu", startTime: "11:00", endTime: "12:00" },
    { id: "tt9", course_id: "c1", dayOfWeek: "Fri", startTime: "09:00", endTime: "10:00" },
    { id: "tt10", course_id: "c2", dayOfWeek: "Fri", startTime: "11:00", endTime: "12:00" },
];

export const mockAssessments: Assessment[] = [
    { id: "a1", name: "MidTerm Exam", course_id: "c2", type: "Exam", dueDate: "2026-09-06", status: "Not started" },
    { id: "a2", name: "Midterm Exam", course_id: "c1", type: "Exam", dueDate: "2026-09-07", status: "Not started" },
    { id: "a3", name: "Mid Term Exam", course_id: "c4", type: "Exam", dueDate: "2026-09-08", status: "Not started" },
    { id: "a4", name: "Mid Term Exam", course_id: "c3", type: "Exam", dueDate: "2026-09-10", status: "Not started" },
    { id: "a5", name: "Essay Writing", course_id: "c2", type: "Assignment", dueDate: "2026-09-01", status: "Not started" },
    { id: "a6", name: "Research", course_id: "c3", type: "Assignment", dueDate: "2026-08-29", status: "In progress" },
    { id: "a7", name: "Formula Derivation", course_id: "c4", type: "Assignment", dueDate: "2026-08-22", status: "Not started" },
];

export const mockStudentTasks: Task[] = [
    { id: "st1", title: "Sample Task", date: "2026-09-01", completed: false, course_id: "c3", effort: "High", impact: "Low", priority: 1, order: 1 },
    { id: "st2", title: "Sample Task", date: "2026-09-01", completed: true, course_id: "c2", effort: "Medium", impact: "High", priority: 4, order: 2, completed_at: "2026-09-01T10:00:00Z" },
    { id: "st3", title: "Sample Task", date: "2026-09-01", completed: true, course_id: "c1", effort: "Low", impact: "Medium", priority: 3, order: 3, completed_at: "2026-09-01T11:00:00Z" },
];

export const mockResources: ResourceItem[] = [
    { id: "r1", title: "Financial mistakes", type: "twitter", url: "#", status: "Not Seen" },
    { id: "r2", title: "How to be more productive", type: "article", url: "#", status: "Not Seen" },
    { id: "r3", title: "How to manage time", type: "video", url: "#", status: "Not Seen" },
    { id: "r4", title: "Perfect job", type: "job", url: "#", status: "Not Seen" },
];
