"use client";

import { Target, Plus, Flame } from "lucide-react";
import { Card, Badge, Button, ProgressBar } from "@/components/ui/primitives";

const mockGoals = [
    { id: "g1", title: "Run 100km this month", progress: 42, target: 100, unit: "km", habit: "🏃", color: "#39ff14", streak: 21 },
    { id: "g2", title: "Read 10 books this year", progress: 3, target: 10, unit: "books", habit: "📚", color: "#ff44cc", streak: 8 },
    { id: "g3", title: "Meditate 30 days", progress: 14, target: 30, unit: "days", habit: "🧘", color: "#00dd88", streak: 14 },
];

export default function GoalsPage() {
    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-sm uppercase tracking-widest text-text-primary">Goals</h1>
                    <p className="text-sm text-text-muted/70 mt-0.5">Set targets. Hit milestones. Track victories.</p>
                </div>
                <Button variant="primary" size="sm">
                    <Plus className="w-4 h-4" />
                    New Goal
                </Button>
            </div>

            <div className="space-y-4">
                {mockGoals.map(goal => {
                    const pct = Math.round((goal.progress / goal.target) * 100);
                    return (
                        <Card key={goal.id} className="p-5 hover:border-surface-400/50 transition-none">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-[2px] flex items-center justify-center text-2xl shrink-0"
                                    style={{ backgroundColor: goal.color + "18" }}>
                                    {goal.habit}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-text-primary">{goal.title}</h3>
                                        <Badge variant={pct >= 100 ? "success" : pct >= 50 ? "brand" : "neutral"}>
                                            {pct}%
                                        </Badge>
                                    </div>
                                    <ProgressBar value={goal.progress} max={goal.target} color="brand" showLabel className="mb-2" />
                                    <div className="flex items-center gap-4 text-xs text-text-muted/60">
                                        <span>{goal.progress} / {goal.target} {goal.unit}</span>
                                        <span className="flex items-center gap-1 text-warning-400">
                                            <Flame className="w-3 h-3" /> {goal.streak} day streak
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* CTA if no goals */}
            <Card glass className="p-8 text-center border-brand-500/10">
                <Target className="w-12 h-12 text-brand-400 mx-auto mb-3" />
                <h3 className="font-display font-bold text-lg text-text-primary mb-1">Set a challenge goal</h3>
                <p className="text-sm text-text-muted/70 mb-4">Goals push you beyond daily habits toward bigger wins.</p>
                <Button variant="primary">
                    <Plus className="w-4 h-4" />
                    Create Your First Goal
                </Button>
            </Card>
        </div>
    );
}
