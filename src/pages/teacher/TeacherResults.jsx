import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { TeacherSidebar, TeacherMobileNav } from "@/components/TeacherSidebar";
import { FunCard } from "@/components/FunComponents";
import { getResults, getUsers } from "@/lib/storage";

export default function TeacherResults() {
  const { user } = useAuth();

  const results = useMemo(() => {
    const allResults = getResults();
    const users = getUsers();
    return allResults
      .filter((r) => r.teacherCode === user.teacherCode)
      .map((r) => {
        const student = users.find((u) => u.id === r.userId);
        return { ...r, username: student?.username || "Unknown" };
      })
      .sort((a, b) => b.date - a.date);
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <TeacherMobileNav />
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">
            Results 📊
          </h1>

          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-4xl block mb-3">📈</span>
              No results yet.
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((r, i) => (
                <FunCard key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-semibold text-foreground">
                      {r.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Level {r.level} · {new Date(r.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-display font-bold text-primary">
                      {r.score}/{r.total}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((r.score / r.total) * 100)}% correct
                    </p>
                  </div>
                </FunCard>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
