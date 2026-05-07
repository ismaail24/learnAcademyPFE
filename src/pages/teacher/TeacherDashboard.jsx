import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { TeacherSidebar, TeacherMobileNav } from "@/components/TeacherSidebar";
import { StatCard } from "@/components/FunComponents";
import {
  getUsers,
  getExercises,
  getCourses,
  getAnnouncements,
  getQuizzes,
  getResults,
} from "@/lib/storage";
import { useMemo } from "react";

export default function TeacherDashboard() {
  const { user } = useAuth();

  const stats = useMemo(() => {
    const users = getUsers();
    const exercises = getExercises();
    const courses = getCourses();
    const announcements = getAnnouncements();
    const quizzes = getQuizzes();
    const results = getResults();
    const myStudents = users.filter(
      (u) => u.role === "student" && u.teacherCode === user.teacherCode,
    );
    const myExercises = exercises.filter(
      (e) => e.teacherCode === user.teacherCode,
    );
    const myCourses = courses.filter((c) => c.teacherCode === user.teacherCode);
    const myAnnouncements = announcements.filter(
      (a) => a.teacherCode === user.teacherCode,
    );
    const myQuizzes = quizzes.filter((q) => q.teacherCode === user.teacherCode);
    const myResults = results.filter((r) =>
      myStudents.some((s) => s.username === r.username),
    );
    return {
      students: myStudents.length,
      exercises: myExercises.length,
      courses: myCourses.length,
      announcements: myAnnouncements.length,
      quizzes: myQuizzes.length,
      results: myResults.length,
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <TeacherMobileNav />
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8 animate-slide-up">
            <h1 className="text-3xl font-display font-bold text-foreground">
              Welcome, {user.username}! 👨‍🏫
            </h1>
            <p className="text-muted-foreground mt-1">
              Your teacher code:{" "}
              <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                {user.teacherCode}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Share this code with your students so they can join your class
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon="👦"
              label="My Students"
              value={stats.students}
              color="primary"
            />
            <StatCard
              icon="✏️"
              label="My Exercises"
              value={stats.exercises}
              color="secondary"
            />
            <StatCard
              icon="📚"
              label="My Courses"
              value={stats.courses}
              color="accent"
            />
            <StatCard
              icon="📢"
              label="My Announcements"
              value={stats.announcements}
              color="purple"
            />
            <StatCard
              icon="🧩"
              label="My Quizzes"
              value={stats.quizzes}
              color="primary"
            />
            <StatCard
              icon="📊"
              label="Student Results"
              value={stats.results}
              color="secondary"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
