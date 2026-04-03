import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "TrackBit — Habit Tracker & Focus Timer",
    template: "%s | TrackBit",
  },
  description:
    "Build powerful habits, track streaks, and supercharge your focus with TrackBit's distraction-detection Pomodoro timer.",
  keywords: ["habit tracker", "pomodoro timer", "focus timer", "streak counter", "productivity"],
  authors: [{ name: "TrackBit" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "TrackBit",
    title: "TrackBit — Habit Tracker & Focus Timer",
    description: "Build powerful habits, track streaks, and supercharge your focus.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('trackbit-theme');
                  var theme = stored ? JSON.parse(stored).state.theme : 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                  var isDark = ['dark', 'tokyo-night', 'dracula', 'cyberpunk', 'nord', 'solarized-dark'].includes(theme);
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(isDark ? 'dark' : 'light');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
