"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    PlusCircle, BookOpen, Calendar, CheckSquare, FileText, Clock, Folder,
    Table, Layers, Briefcase, GraduationCap, Wallet, Target, BookMarked
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
    {
        title: "Quick Actions",
        items: [
            { href: "/assessments?new=true", icon: PlusCircle, label: "New Assessment" },
            { href: "/tasks?new=true", icon: PlusCircle, label: "New Task" },
            { href: "/journal?new=true", icon: PlusCircle, label: "New Journal Entry" },
            { href: "/resources?new=true", icon: PlusCircle, label: "New Resource" },
            { href: "/agenda?new=true", icon: PlusCircle, label: "New Event" },
        ]
    },
    {
        title: "Management",
        items: [
            { href: "/courses", icon: BookOpen, label: "Courses" },
            { href: "/semesters", icon: Layers, label: "Semesters" },
            { href: "/assessments", icon: FileText, label: "Assessments" },
            { href: "/tasks", icon: CheckSquare, label: "Tasks Manager" },
            { href: "/notes", icon: FileText, label: "Class Content Notes" },
            { href: "/agenda", icon: Calendar, label: "Agenda Events" },
            { href: "/timer", icon: Clock, label: "Focus Zone" },
        ]
    },
    {
        title: "Directory",
        items: [
            { href: "/resources", icon: Folder, label: "Resources" },
            { href: "/timetable", icon: Table, label: "Time Table" },
            { href: "/flashcards", icon: Layers, label: "Flashcards" },
        ]
    },
    {
        title: "Trackers",
        items: [
            { href: "/books", icon: BookMarked, label: "Book Tracker" },
            { href: "/internships", icon: Briefcase, label: "Internships & Job" },
            { href: "/admissions", icon: GraduationCap, label: "Admission Tracker" },
            { href: "/tracker", icon: Target, label: "Habit Journal" },
            { href: "/finance", icon: Wallet, label: "Finance Tracker" },
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="w-64 shrink-0 h-full flex flex-col bg-surface-900 border-r-2 border-surface-400/40">
            <div className="px-5 py-6 bg-surface-900 border-b-2 border-surface-400/40 shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-[2px] bg-brand-600 flex items-center justify-center shadow-glow shrink-0">
                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="0" width="4" height="2" fill="white"/>
                            <rect x="2" y="2" width="2" height="2" fill="white"/>
                            <rect x="12" y="2" width="2" height="2" fill="white"/>
                            <rect x="0" y="6" width="2" height="4" fill="white"/>
                            <rect x="14" y="6" width="2" height="4" fill="white"/>
                            <rect x="6" y="14" width="4" height="2" fill="white"/>
                            <rect x="2" y="12" width="2" height="2" fill="white"/>
                            <rect x="12" y="12" width="2" height="2" fill="white"/>
                            <rect x="6" y="6" width="4" height="4" fill="#39ff14"/>
                        </svg>
                    </div>
                    <span className="font-display font-bold text-sm text-text-primary">Track<span className="text-brand-400">Bit</span></span>
                </Link>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
                {NAV_GROUPS.map((group) => (
                    <div key={group.title}>
                        <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-brand-400">{group.title}</p>
                        <div className="space-y-0.5">
                            {group.items.map(({ href, icon: Icon, label }) => {
                                const basePath = href.split('?')[0];
                                const isActive = basePath !== "#" && (pathname === basePath || pathname.startsWith(basePath + "/"));
                                return (
                                    <Link key={label} href={href}
                                        className={cn("flex items-center gap-3 px-3 py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-none group",
                                            isActive ? "bg-brand-600/20 text-brand-400 border-2 border-brand-500/30" : "text-text-muted/80 hover:text-text-primary hover:bg-surface-700 border-2 border-transparent")}>
                                        <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-brand-400" : "text-brand-500 group-hover:text-brand-400")} />
                                        <span className="flex-1 truncate">{label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
