import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

// ─── Card ──────────────────────────────────────────────────────────────────
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    glass?: boolean;
}
export function Card({ className, glass = false, children, ...props }: CardProps) {
    return (
        <div
            className={cn(glass ? "card-glass" : "card", className)}
            {...props}
        >
            {children}
        </div>
    );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
interface StatCardProps {
    title: string;
    value: string | number;
    sub?: string;
    icon?: LucideIcon;
    iconColor?: string;
    trend?: number;   // percentage change (positive = up)
    className?: string;
}
export function StatCard({
    title, value, sub, icon: Icon, iconColor = "text-brand-400", trend, className,
}: StatCardProps) {
    return (
        <div className={cn("stat-card group", className)}>
            <div className="flex items-start justify-between">
                <p className="text-xs font-medium text-text-muted/70 uppercase tracking-wider">{title}</p>
                {Icon && (
                    <div className="w-8 h-8 rounded-[2px] bg-white/5 flex items-center justify-center">
                        <Icon className={cn("w-4 h-4", iconColor)} strokeWidth={2} />
                    </div>
                )}
            </div>
            <p className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">{value}</p>
            {(sub || trend !== undefined) && (
                <div className="flex items-center gap-2">
                    {sub && <span className="text-xs text-text-muted/60">{sub}</span>}
                    {trend !== undefined && (
                        <span className={cn(
                            "text-2xs font-bold",
                            trend > 0 ? "text-success-400" : trend < 0 ? "text-danger-400" : "text-text-muted/50"
                        )}>
                            {trend > 0 ? "▲" : trend < 0 ? "▼" : "—"} {Math.abs(trend)}%
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Badge ─────────────────────────────────────────────────────────────────
interface BadgeProps {
    children: React.ReactNode;
    variant?: "brand" | "success" | "warning" | "danger" | "neutral";
    className?: string;
}
export function Badge({ children, variant = "brand", className }: BadgeProps) {
    const variantClass = {
        brand: "badge-brand",
        success: "badge-success",
        warning: "badge-warning",
        danger: "badge-danger",
        neutral: "badge bg-text-primary/10 text-text-muted/80 border-surface-400/50",
    }[variant];
    return <span className={cn(variantClass, className)}>{children}</span>;
}

// ─── Button ────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
}
export function Button({
    variant = "primary", size = "md", className, children, ...props
}: ButtonProps) {
    const variantClass = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        ghost: "btn-ghost",
        danger: "btn-danger",
    }[variant];

    const sizeClass = {
        sm: "!px-3 !py-1.5 !text-xs",
        md: "",
        lg: "!px-6 !py-3 !text-base",
    }[size];

    return (
        <button className={cn(variantClass, sizeClass, className)} {...props}>
            {children}
        </button>
    );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
    return <div className={cn("skeleton h-4", className)} />;
}

// ─── Progress Bar ──────────────────────────────────────────────────────────
interface ProgressBarProps {
    value: number; // 0–100
    max?: number;
    color?: "brand" | "accent" | "success" | "warning" | "danger";
    className?: string;
    showLabel?: boolean;
}
export function ProgressBar({
    value, max = 100, color = "brand", className, showLabel = false,
}: ProgressBarProps) {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const trackBg = "bg-white/8";
    const fillBg = {
        brand: "bg-brand-500",
        accent: "bg-accent-500",
        success: "bg-success-500",
        warning: "bg-warning-500",
        danger: "bg-danger-500",
    }[color];
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className={cn("flex-1 h-3 rounded-none overflow-hidden", trackBg)}>
                <div
                    className={cn("h-full rounded-none transition-none pixel-bar-fill", fillBg)}
                    style={{ width: `${pct}%` }}
                />
            </div>
            {showLabel && (
                <span className="text-2xs text-text-muted/60 w-8 text-right">{Math.round(pct)}%</span>
            )}
        </div>
    );
}

// ─── Divider ──────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
    return <div className={cn("h-[2px] bg-surface-400/40", className)} />;
}
