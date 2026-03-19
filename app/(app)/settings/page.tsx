"use client";

import { Settings, Bell, Shield, ChevronRight, Palette, Check } from "lucide-react";
import { Card, Button } from "@/components/ui/primitives";
import { useThemeStore, themes, type ThemeId } from "@/lib/themeStore";
import { useSettingsStore } from "@/lib/settingsStore";
import { useStudentStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useMemo, useState } from "react";

// Theme color previews for visual selection
const themeColors: Record<ThemeId, { bg: string; accent: string; text: string }> = {
    dark: { bg: "#0b0d1a", accent: "#39ff14", text: "#ffffff" },
    light: { bg: "#f8f9fa", accent: "#22a00d", text: "#1a1a2e" },
    "tokyo-night": { bg: "#1a1b26", accent: "#bb9af7", text: "#c0caf5" },
    dracula: { bg: "#282a36", accent: "#bd93f9", text: "#f8f8f2" },
    cyberpunk: { bg: "#0d0221", accent: "#ff7700", text: "#ffffff" },
    nord: { bg: "#2e3440", accent: "#88c0d0", text: "#eceff4" },
    "solarized-dark": { bg: "#002b36", accent: "#268bd2", text: "#839496" },
    "solarized-light": { bg: "#fdf6e3", accent: "#2aa198", text: "#657b83" },
};

const timezoneOptions = ["UTC", "Asia/Kolkata", "Europe/London", "America/New_York", "Asia/Tokyo"];
const languageOptions = ["ENGLISH", "HINDI"] as const;

export default function SettingsPage() {
    const { theme, setTheme } = useThemeStore();
    const {
        language,
        timezone,
        autoTimezone,
        dailyReminders,
        streakAlerts,
        focusDoNotDisturb,
        setLanguage,
        setTimezone,
        toggleAutoTimezone,
        toggleDailyReminders,
        toggleStreakAlerts,
        toggleFocusDoNotDisturb,
    } = useSettingsStore();
    const {
        courses,
        timetable,
        assessments,
        tasks,
        resources,
        semesters,
        agendaEvents,
        journal,
        classNotes,
        flashcardDecks,
        books,
        internships,
        admissions,
        finances,
        habits,
        focusSessions,
        habitCompletions,
        timerSettings,
    } = useStudentStore();
    const [exportMessage, setExportMessage] = useState<string | null>(null);
    const [accountEmail, setAccountEmail] = useState<string>("NOT CONNECTED");
    const [rawAccountEmail, setRawAccountEmail] = useState<string>("");

    useEffect(() => {
        const loadUser = async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getUser();
            const email = data.user?.email;

            if (email) {
                setRawAccountEmail(email);
                setAccountEmail(email.toUpperCase());
            }
        };

        void loadUser();
    }, []);

    const preferenceMessage = useMemo(() => {
        if (autoTimezone) {
            return "AUTO-DETECTED";
        }

        return "MANUAL";
    }, [autoTimezone]);

    const cycleLanguage = () => {
        const currentIndex = languageOptions.indexOf(language);
        const nextIndex = (currentIndex + 1) % languageOptions.length;
        setLanguage(languageOptions[nextIndex]);
    };

    const cycleTimezone = () => {
        if (autoTimezone) {
            toggleAutoTimezone();
            return;
        }

        const currentIndex = timezoneOptions.indexOf(timezone);
        const nextIndex = (currentIndex + 1) % timezoneOptions.length;
        setTimezone(timezoneOptions[nextIndex]);
    };

    const handleAccountEmailAction = async () => {
        if (!rawAccountEmail) {
            setExportMessage("NO ACCOUNT EMAIL FOUND");
            window.setTimeout(() => setExportMessage(null), 2500);
            return;
        }

        try {
            await navigator.clipboard.writeText(rawAccountEmail);
            setExportMessage("EMAIL COPIED");
        } catch {
            setExportMessage("COPY FAILED");
        }

        window.setTimeout(() => setExportMessage(null), 2500);
    };

    const handlePasswordAction = async () => {
        if (!rawAccountEmail) {
            setExportMessage("NO ACCOUNT EMAIL FOUND");
            window.setTimeout(() => setExportMessage(null), 2500);
            return;
        }

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(rawAccountEmail, {
                redirectTo: `${window.location.origin}/login`,
            });

            if (error) {
                setExportMessage("PASSWORD RESET FAILED");
            } else {
                setExportMessage("PASSWORD RESET EMAIL SENT");
            }
        } catch {
            setExportMessage("PASSWORD RESET FAILED");
        }

        window.setTimeout(() => setExportMessage(null), 3000);
    };

    const handleExportData = () => {
        try {
            const payload = {
                app: "TrackBit",
                exported_at: new Date().toISOString(),
                data: {
                    courses,
                    timetable,
                    assessments,
                    tasks,
                    resources,
                    semesters,
                    agendaEvents,
                    journal,
                    classNotes,
                    flashcardDecks,
                    books,
                    internships,
                    admissions,
                    finances,
                    habits,
                    focusSessions,
                    habitCompletions,
                    timerSettings,
                },
            };

            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            const date = new Date().toISOString().slice(0, 10);
            link.href = url;
            link.download = `trackbit-export-${date}.json`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            setExportMessage("EXPORT COMPLETE");
            window.setTimeout(() => setExportMessage(null), 2500);
        } catch {
            setExportMessage("EXPORT FAILED");
            window.setTimeout(() => setExportMessage(null), 2500);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-2xl mx-auto animate-fade-in">
            <div>
                <h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Settings</h1>
                <p className="text-sm text-text-muted/70 mt-0.5">Manage your account and app preferences.</p>
                {exportMessage && (
                    <p className="mt-2 inline-block border border-brand-500/40 bg-surface-700 px-2 py-1 text-2xs uppercase tracking-wider text-brand-300">
                        {exportMessage}
                    </p>
                )}
            </div>

            {/* Theme Selection */}
            <Card className="overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-surface-400/40">
                    <Palette className="w-4 h-4 text-brand-400" />
                    <h2 className="text-sm font-bold text-text-primary">Theme</h2>
                </div>
                <div className="p-5">
                    <p className="text-xs text-text-muted/70 mb-4">Choose your preferred color theme</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {themes.map((t) => {
                            const colors = themeColors[t.id];
                            const isActive = theme === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`
                                        relative p-3 rounded-[2px] border-2 transition-none cursor-pointer
                                        ${isActive
                                            ? "border-brand-500 ring-2 ring-brand-500/30"
                                            : "border-surface-400/40 hover:border-surface-400"
                                        }
                                    `}
                                    style={{ backgroundColor: colors.bg }}
                                >
                                    {/* Theme preview */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5">
                                            <div
                                                className="w-3 h-3 rounded-[1px]"
                                                style={{ backgroundColor: colors.accent }}
                                            />
                                            <div
                                                className="flex-1 h-1.5 rounded-[1px] opacity-30"
                                                style={{ backgroundColor: colors.text }}
                                            />
                                        </div>
                                        <div
                                            className="h-1 rounded-[1px] opacity-20"
                                            style={{ backgroundColor: colors.text }}
                                        />
                                        <div
                                            className="h-1 w-3/4 rounded-[1px] opacity-20"
                                            style={{ backgroundColor: colors.text }}
                                        />
                                    </div>

                                    {/* Theme name */}
                                    <p
                                        className="mt-2 text-2xs font-bold uppercase tracking-wider truncate"
                                        style={{ color: colors.text }}
                                    >
                                        {t.name}
                                    </p>

                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {/* Other Preferences */}
            <Card className="overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-surface-400/40">
                    <Settings className="w-4 h-4 text-brand-400" />
                    <h2 className="text-sm font-bold text-text-primary">Preferences</h2>
                </div>
                <div className="divide-y divide-surface-400/20">
                    <button
                        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-text-primary/5 transition-none group"
                        onClick={cycleLanguage}
                        type="button"
                    >
                        <div>
                            <p className="text-sm font-medium text-text-primary">Language</p>
                            <p className="text-xs text-text-muted/60 mt-0.5">App language</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted/60">{language}</span>
                            <ChevronRight className="w-4 h-4 text-text-muted/40 group-hover:text-text-muted/70 transition-none" />
                        </div>
                    </button>
                    <button
                        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-text-primary/5 transition-none group"
                        onClick={cycleTimezone}
                        type="button"
                    >
                        <div>
                            <p className="text-sm font-medium text-text-primary">Timezone</p>
                            <p className="text-xs text-text-muted/60 mt-0.5">{preferenceMessage}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted/60">{timezone}</span>
                            <ChevronRight className="w-4 h-4 text-text-muted/40 group-hover:text-text-muted/70 transition-none" />
                        </div>
                    </button>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-surface-400/40">
                    <Bell className="w-4 h-4 text-brand-400" />
                    <h2 className="text-sm font-bold text-text-primary">Notifications</h2>
                </div>
                <div className="divide-y divide-surface-400/20">
                    <button
                        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-text-primary/5 transition-none group"
                        onClick={toggleDailyReminders}
                        type="button"
                    >
                        <div>
                            <p className="text-sm font-medium text-text-primary">Daily Reminders</p>
                            <p className="text-xs text-text-muted/60 mt-0.5">Habit check-in alerts</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted/60">{dailyReminders ? "ON" : "OFF"}</span>
                            <ChevronRight className="w-4 h-4 text-text-muted/40 group-hover:text-text-muted/70 transition-none" />
                        </div>
                    </button>
                    <button
                        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-text-primary/5 transition-none group"
                        onClick={toggleStreakAlerts}
                        type="button"
                    >
                        <div>
                            <p className="text-sm font-medium text-text-primary">Streak Alerts</p>
                            <p className="text-xs text-text-muted/60 mt-0.5">Before streak breaks</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted/60">{streakAlerts ? "ON" : "OFF"}</span>
                            <ChevronRight className="w-4 h-4 text-text-muted/40 group-hover:text-text-muted/70 transition-none" />
                        </div>
                    </button>
                    <button
                        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-text-primary/5 transition-none group"
                        onClick={toggleFocusDoNotDisturb}
                        type="button"
                    >
                        <div>
                            <p className="text-sm font-medium text-text-primary">Focus Do Not Disturb</p>
                            <p className="text-xs text-text-muted/60 mt-0.5">During timer sessions</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted/60">{focusDoNotDisturb ? "ON" : "OFF"}</span>
                            <ChevronRight className="w-4 h-4 text-text-muted/40 group-hover:text-text-muted/70 transition-none" />
                        </div>
                    </button>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-surface-400/40">
                    <Shield className="w-4 h-4 text-brand-400" />
                    <h2 className="text-sm font-bold text-text-primary">Privacy & Security</h2>
                </div>
                <div className="divide-y divide-surface-400/20">
                    <button
                        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-text-primary/5 transition-none group"
                        onClick={handleAccountEmailAction}
                        type="button"
                    >
                        <div>
                            <p className="text-sm font-medium text-text-primary">Account Email</p>
                            <p className="text-xs text-text-muted/60 mt-0.5">{accountEmail}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-muted/40 group-hover:text-text-muted/70 transition-none" />
                    </button>
                    <button
                        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-text-primary/5 transition-none group"
                        onClick={handlePasswordAction}
                        type="button"
                    >
                        <div>
                            <p className="text-sm font-medium text-text-primary">Change Password</p>
                            <p className="text-xs text-text-muted/60 mt-0.5">Send reset email to your account</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-muted/40 group-hover:text-text-muted/70 transition-none" />
                    </button>
                    <button
                        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-text-primary/5 transition-none group"
                        onClick={handleExportData}
                        type="button"
                    >
                        <div>
                            <p className="text-sm font-medium text-text-primary">Export Data</p>
                            <p className="text-xs text-text-muted/60 mt-0.5">Download your data</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted/60">JSON</span>
                            <ChevronRight className="w-4 h-4 text-text-muted/40 group-hover:text-text-muted/70 transition-none" />
                        </div>
                    </button>
                </div>
            </Card>

            {/* Danger Zone */}
            <Card className="border-danger-500/10 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-danger-500/10">
                    <h2 className="text-sm font-bold text-danger-400">Danger Zone</h2>
                </div>
                <div className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-text-primary">Delete Account</p>
                        <p className="text-xs text-text-muted/60 mt-0.5">Permanently delete all your data. No undo.</p>
                    </div>
                    <Button variant="danger" size="sm">Delete</Button>
                </div>
            </Card>
        </div>
    );
}
