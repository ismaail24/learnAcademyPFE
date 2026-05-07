import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  Users,
  BarChart3,
  Megaphone,
  HelpCircle,
} from "lucide-react";

const teacherLinks = [
  { to: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/teacher/exercises", label: "Exercises", icon: PenTool },
  { to: "/teacher/courses", label: "Courses", icon: BookOpen },
  { to: "/teacher/quizzes", label: "Quizzes", icon: HelpCircle },
  { to: "/teacher/announcements", label: "Announcements", icon: Megaphone },
  { to: "/teacher/students", label: "Students", icon: Users },
  { to: "/teacher/results", label: "Results", icon: BarChart3 },
];

export function TeacherSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-sidebar text-sidebar-foreground hidden lg:block">
      <div className="p-6">
        <h2 className="text-lg font-display font-semibold text-sidebar-foreground/80 mb-6">
          Teacher Panel
        </h2>
        <nav className="space-y-1">
          {teacherLinks.map((link) => {
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
                <link.icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function TeacherMobileNav() {
  const location = useLocation();

  return (
    <div className="lg:hidden flex overflow-x-auto gap-2 p-3 bg-sidebar border-b border-sidebar-border">
      {teacherLinks.map((link) => {
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
            <link.icon size={16} />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
