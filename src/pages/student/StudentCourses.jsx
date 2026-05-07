import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { StudentSidebar, StudentMobileNav } from "@/components/StudentSidebar";
import { FunCard, LevelBadge } from "@/components/FunComponents";
import { getCourses } from "@/lib/storage";
import { Eye, X } from "lucide-react";

export default function StudentCourses() {
  const { user } = useAuth();
  const [viewingCourse, setViewingCourse] = useState(null);

  const courses = useMemo(
    () =>
      getCourses().filter(
        (c) =>
          c.level <= user.level &&
          (c.teacherCode === user.teacherCode || c.teacherCode === "DEFAULT"),
      ),
    [user],
  );

  if (viewingCourse) {
    const c = viewingCourse;
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <StudentMobileNav />
        <div className="flex">
          <StudentSidebar />
          <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
            <button
              onClick={() => setViewingCourse(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-all"
            >
              <X size={16} /> Back to Courses
            </button>
            <FunCard hover={false} className="animate-pop">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">
                  {c.type === "video" ? "🎥" : c.type === "image" ? "🖼️" : "📝"}
                </span>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl text-foreground">
                    {c.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {c.description}
                  </p>
                </div>
                <LevelBadge level={c.level} current={user.level} size="sm" />
              </div>
              <div className="rounded-xl overflow-hidden bg-muted/50">
                {c.type === "video" && (
                  <div className="aspect-video">
                    <iframe
                      src={c.content}
                      title={c.title}
                      className="w-full h-full rounded-xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {c.type === "image" && (
                  <img
                    src={c.content}
                    alt={c.title}
                    className="w-full rounded-xl max-h-96 object-contain"
                  />
                )}
                {c.type === "text" && (
                  <div className="p-6 text-foreground leading-relaxed whitespace-pre-wrap">
                    {c.content}
                  </div>
                )}
              </div>
            </FunCard>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <StudentMobileNav />
      <div className="flex">
        <StudentSidebar />
        <main className="flex-1 min-w-4xl mx-auto px-12 py-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            My Courses 📚
          </h1>
          <p className="text-muted-foreground mb-8">
            Learn new math concepts with videos, images, and text lessons
          </p>

          {courses.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <span className="text-6xl block mb-4">📖</span>
              <p className="text-xl font-display">
                No courses available for your level yet!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.map((c, i) => (
                <FunCard
                  key={c.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">
                      {c.type === "video"
                        ? "🎥"
                        : c.type === "image"
                          ? "🖼️"
                          : "📝"}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-foreground">
                        {c.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {c.description}
                      </p>
                    </div>
                    <LevelBadge
                      level={c.level}
                      current={user.level}
                      size="sm"
                    />
                  </div>
                  <button
                    onClick={() => setViewingCourse(c)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-hero text-primary-foreground font-medium text-sm shadow-fun hover:shadow-hover transition-all w-full justify-center"
                  >
                    <Eye size={16} /> Overview
                  </button>
                </FunCard>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
