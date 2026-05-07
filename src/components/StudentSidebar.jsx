import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  BarChart3,
  HelpCircle,
  Megaphone,
} from "lucide-react";

const studentLinks = [
  {
    to: "/student/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    emoji: "🏠",
  },
  { to: "/student/exercises", label: "Exercises", icon: PenTool, emoji: "✏️" },
  { to: "/student/courses", label: "Courses", icon: BookOpen, emoji: "📚" },
  { to: "/student/quizzes", label: "Quizzes", icon: HelpCircle, emoji: "🧩" },
  {
    to: "/student/announcements",
    label: "Announcements",
    icon: Megaphone,
    emoji: "📢",
  },
  { to: "/student/results", label: "Results", icon: BarChart3, emoji: "📊" },
];

export function StudentSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-sidebar text-sidebar-foreground hidden lg:block">
      <div className="p-6">
        <h2 className="text-lg font-display font-semibold text-sidebar-foreground/80 mb-6 flex items-center gap-2">
          <span className="text-2xl">🎒</span> Student Panel
        </h2>
        <nav className="space-y-1">
          {studentLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-fun"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <span className="text-lg">{link.emoji}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function StudentMobileNav() {
  const location = useLocation();

  return (
    <div className="lg:hidden flex overflow-x-auto gap-2 p-3 bg-sidebar border-b border-sidebar-border">
      {studentLinks.map((link) => {
        const active = location.pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
            }`}
          >
            <span>{link.emoji}</span>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
