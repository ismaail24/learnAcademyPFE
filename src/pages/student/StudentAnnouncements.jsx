import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { StudentSidebar, StudentMobileNav } from "@/components/StudentSidebar";
import { FunCard } from "@/components/FunComponents";
import { getAnnouncements } from "@/lib/storage";
import { Megaphone } from "lucide-react";

export default function StudentAnnouncements() {
  const { user } = useAuth();

  const announcements = useMemo(
    () =>
      getAnnouncements()
        .filter((a) => a.teacherCode === user.teacherCode)
        .sort((a, b) => b.createdAt - a.createdAt),
    [user],
  );

  const priorityColors = {
    urgent: "bg-destructive/10 text-destructive border-destructive/30",
    important: "bg-secondary/10 text-secondary border-secondary/30",
    normal: "bg-primary/10 text-primary border-primary/30",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <StudentMobileNav />
      <div className="flex">
        <StudentSidebar />
        <main className="flex-1 min-w-4xl mx-auto px-12 py-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Announcements 📢
          </h1>
          <p className="text-muted-foreground mb-8">
            Stay updated with your teacher's announcements
          </p>

          {announcements.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <span className="text-6xl block mb-4">📢</span>
              <p className="text-xl font-display">No announcements yet!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((a, i) => (
                <FunCard
                  key={a.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone size={18} className="text-primary" />
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityColors[a.priority]}`}
                    >
                      {a.priority === "urgent"
                        ? "🔴 Urgent"
                        : a.priority === "important"
                          ? "🟡 Important"
                          : "🟢 Normal"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      by {a.teacherName} ·{" "}
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground">
                    {a.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                    {a.content}
                  </p>
                </FunCard>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
