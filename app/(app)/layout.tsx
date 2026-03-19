import Link from "next/link";
import { Settings } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="shrink-0 h-14 px-6 flex items-center justify-end border-b-2 border-surface-400/40 bg-surface-900">
                    <Link
                        href="/settings"
                        className="p-2 rounded-[2px] text-text-muted/80 hover:text-text-primary hover:bg-surface-700 transition-none"
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </Link>
                </header>
                <main className="flex-1 overflow-y-auto bg-surface-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
