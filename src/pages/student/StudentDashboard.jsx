import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { StudentSidebar, StudentMobileNav } from "@/components/StudentSidebar";
import { LevelBadge, FunCard, StatCard } from "@/components/FunComponents";
import { BookOpen, PenTool, BarChart3, Rocket } from "lucide-react";
import {
  getAnnouncements,
  getQuizzes,
  getResults,
  getQuizResults,
  getExercises,
  getCourses,
} from "@/lib/storage";
import { useMemo } from "react";

export default function StudentDashboard() {
  const { user } = useAuth();

  const stats = useMemo(() => {
    const announcements = getAnnouncements().filter(
      (a) => a.teacherCode === user.teacherCode,
    );
    const quizzes = getQuizzes().filter(
      (q) => q.teacherCode === user.teacherCode && q.level <= user.level,
    );
    const results = getResults().filter((r) => r.username === user.username);
    const quizResults = getQuizResults().filter(
      (r) => r.username === user.username,
    );
    const exercises = getExercises().filter(
      (e) =>
        (e.teacherCode === user.teacherCode || e.teacherCode === "DEFAULT") &&
        e.level <= user.level,
    );
    const courses = getCourses().filter(
      (c) =>
        (c.teacherCode === user.teacherCode || c.teacherCode === "DEFAULT") &&
        c.level <= user.level,
    );
    return {
      announcements: announcements.length,
      quizzes: quizzes.length,
      results: results.length + quizResults.length,
      exercises: exercises.length,
      courses: courses.length,
    };
  }, [user]);

  const links = [
    {
      to: "/student/exercises",
      label: "Exercises",
      icon: PenTool,
      emoji: "✏️",
      desc: "Practice math problems",
      color: "gradient-hero",
    },
    {
      to: "/student/courses",
      label: "Courses",
      icon: BookOpen,
      emoji: "📚",
      desc: "Learn new concepts",
      color: "gradient-fun",
    },
    {
      to: "/student/results",
      label: "Results",
      icon: BarChart3,
      emoji: "📊",
      desc: "Track your progress",
      color: "gradient-success",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <StudentMobileNav />
      <div className="flex">
        <StudentSidebar />
        <main className="flex-1 min-w-4xl mx-auto px-4 py-8">
          {/* Welcome card */}
          <FunCard className="mb-8 animate-slide-up" hover={false}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center text-4xl animate-float">
                🧮
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl font-display font-bold text-foreground">
                  Hi, {user.username}! 🎉
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 justify-center sm:justify-start">
                  <LevelBadge
                    level={user.level}
                    current={user.level}
                    size="lg"
                  />
                  <span className="text-muted-foreground">·</span>
                  <span className="font-display font-bold text-secondary text-lg">
                    {user.score} pts
                  </span>
                </div>
              </div>
              <Link
                to="/student/exercises"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl gradient-hero text-primary-foreground font-display font-semibold shadow-fun hover:shadow-hover hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                <Rocket size={20} /> Start Learning!
              </Link>
            </div>
          </FunCard>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon="✏️"
              label="Exercises"
              value={stats.exercises}
              color="primary"
            />
            <StatCard
              icon="📚"
              label="Courses"
              value={stats.courses}
              color="secondary"
            />
            <StatCard
              icon="🧩"
              label="Quizzes"
              value={stats.quizzes}
              color="accent"
            />
            <StatCard
              icon="📢"
              label="Announcements"
              value={stats.announcements}
              color="purple"
            />
            <StatCard
              icon="📊"
              label="Results"
              value={stats.results}
              color="primary"
            />
          </div>

          {/* Level progress */}
          <div
            className="mb-8 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="text-lg font-display font-bold text-foreground mb-3">
              Your Levels
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((level) => (
                <div key={level} className="flex-shrink-0">
                  <LevelBadge level={level} current={user.level} size="lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="grid sm:grid-cols-3 gap-6">
            {links.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className="group animate-slide-up"
                style={{ animationDelay: `${(i + 2) * 0.1}s` }}
              >
                <FunCard className="text-center h-full">
                  <div
                    className={`w-16 h-16 rounded-2xl ${link.color} flex items-center justify-center text-3xl mx-auto mb-4 group-hover:animate-wiggle`}
                  >
                    {link.emoji}
                  </div>
                  <h3 className="font-display font-bold text-foreground text-lg mb-1">
                    {link.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{link.desc}</p>
                </FunCard>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
