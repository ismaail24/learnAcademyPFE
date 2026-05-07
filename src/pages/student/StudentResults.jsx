import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { StudentSidebar, StudentMobileNav } from "@/components/StudentSidebar";
import { FunCard } from "@/components/FunComponents";
import { getResults } from "@/lib/storage";
import { RotateCcw } from "lucide-react";

export default function StudentResults() {
  const { user } = useAuth();

  const results = useMemo(
    () =>
      getResults()
        .filter((r) => r.userId === user.id)
        .sort((a, b) => b.date - a.date),
    [user],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <StudentMobileNav />
      <div className="flex">
        <StudentSidebar />
        <main className="flex-1 min-w-2xl mx-auto px-12 py-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            My Results 📊
          </h1>
          <p className="text-muted-foreground mb-8">
            Total Score:{" "}
            <span className="font-display font-bold text-primary text-xl">
              {user.score} pts
            </span>
          </p>

          {results.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <span className="text-6xl block mb-4">📈</span>
              <p className="text-xl font-display mb-4">No results yet!</p>
              <Link
                to="/student/exercises"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-hero text-primary-foreground font-display font-semibold shadow-fun hover:shadow-hover transition-all"
              >
                Start Exercises 🚀
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((r, i) => {
                const pct = Math.round((r.score / r.total) * 100);
                return (
                  <FunCard
                    key={i}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display font-semibold text-foreground">
                          {pct >= 80 ? "🏆" : pct >= 50 ? "⭐" : "💪"} Level{" "}
                          {r.level} Quiz
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(r.date).toLocaleDateString()} · {r.score}/
                          {r.total} correct
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-2xl font-display font-bold ${pct >= 80 ? "text-accent" : pct >= 50 ? "text-secondary" : "text-destructive"}`}
                        >
                          {pct}%
                        </p>
                      </div>
                    </div>
                  </FunCard>
                );
              })}

              <div className="text-center pt-4">
                <Link
                  to="/student/exercises"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-fun text-secondary-foreground font-display font-semibold shadow-fun hover:shadow-hover transition-all"
                >
                  <RotateCcw size={18} /> Retry Exercises
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
