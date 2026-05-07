import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { TeacherSidebar, TeacherMobileNav } from "@/components/TeacherSidebar";
import { FunCard } from "@/components/FunComponents";
import { LevelBadge } from "@/components/FunComponents";
import { getUsers } from "@/lib/storage";

export default function TeacherStudents() {
  const { user } = useAuth();

  const students = useMemo(
    () =>
      getUsers().filter(
        (u) => u.role === "student" && u.teacherCode === user.teacherCode,
      ),
    [user],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <TeacherMobileNav />
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">
            My Students 👦
          </h1>

          {students.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-4xl block mb-3">🏫</span>
              <p>
                No students yet. Share your teacher code:{" "}
                <span className="font-mono font-bold text-primary">
                  {user.teacherCode}
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((s) => (
                <FunCard
                  key={s.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold">
                      {s.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground">
                        {s.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Score: {s.score} pts
                      </p>
                    </div>
                  </div>
                  <LevelBadge level={s.level} current={s.level} />
                </FunCard>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
