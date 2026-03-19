"use client";

import { Settings, Bell, Shield, ChevronRight, Palette, Check } from "lucide-react";
import { Card, Button } from "@/components/ui/primitives";
import { useThemeStore, themes, type ThemeId } from "@/lib/themeStore";

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

const settingGroups = [
    {
        title: "Notifications",
        icon: Bell,
        items: [
            { label: "Daily Reminders", sub: "Habit check-in alerts", value: "On" },
            { label: "Streak Alerts", sub: "Before streak breaks", value: "On" },
            { label: "Focus Do Not Disturb", sub: "During timer sessions", value: "Off" },
        ],
    },
    {
        title: "Privacy & Security",
        icon: Shield,
        items: [
            { label: "Account Email", sub: "user@example.com", value: "" },
            { label: "Change Password", sub: "Last changed never", value: "" },
            { label: "Export Data", sub: "Download your data", value: "" },
        ],
    },
];

export default function SettingsPage() {
    const { theme, setTheme } = useThemeStore();

    return (
        <div className="p-6 space-y-6 max-w-2xl mx-auto animate-fade-in">
            <div>
                <h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Settings</h1>
                <p className="text-sm text-text-muted/70 mt-0.5">Manage your account and app preferences.</p>
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
                    <div className="flex items-center justify-between px-5 py-4 hover:bg-text-primary/5 transition-none cursor-pointer group">
                        <div>
                            <p className="text-sm font-medium text-text-primary">Language</p>
                            <p className="text-xs text-text-muted/60 mt-0.5">App language</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted/60">English</span>
                            <ChevronRight className="w-4 h-4 text-text-muted/40 group-hover:text-text-muted/70 transition-none" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between px-5 py-4 hover:bg-text-primary/5 transition-none cursor-pointer group">
                        <div>
                            <p className="text-sm font-medium text-text-primary">Timezone</p>
                            <p className="text-xs text-text-muted/60 mt-0.5">Auto-detected</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted/60">IST +5:30</span>
                            <ChevronRight className="w-4 h-4 text-text-muted/40 group-hover:text-text-muted/70 transition-none" />
                        </div>
                    </div>
                </div>
            </Card>

            {settingGroups.map(({ title, icon: Icon, items }) => (
                <Card key={title} className="overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-surface-400/40">
                        <Icon className="w-4 h-4 text-brand-400" />
                        <h2 className="text-sm font-bold text-text-primary">{title}</h2>
                    </div>
                    <div className="divide-y divide-surface-400/20">
                        {items.map(({ label, sub, value }) => (
                            <div
                                key={label}
                                className="flex items-center justify-between px-5 py-4 hover:bg-text-primary/5 transition-none cursor-pointer group"
                            >
                                <div>
                                    <p className="text-sm font-medium text-text-primary">{label}</p>
                                    <p className="text-xs text-text-muted/60 mt-0.5">{sub}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {value && <span className="text-xs text-text-muted/60">{value}</span>}
                                    <ChevronRight className="w-4 h-4 text-text-muted/40 group-hover:text-text-muted/70 transition-none" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            ))}

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
