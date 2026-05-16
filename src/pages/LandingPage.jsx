import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import {
  ArrowRight,
  Sparkles,
  Check,
  Star,
  BookOpen,
  BarChart3,
  HelpCircle,
  Megaphone,
  Bell,
  WifiOff,
  ShieldCheck,
  Smartphone,
  Zap,
  Trophy,
  Users,
  Play,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Multimedia courses",
    desc: "Mix videos, images and rich text into every lesson.",
  },
  {
    icon: HelpCircle,
    title: "Smart quizzes",
    desc: "MCQs with instant feedback and progress tracking.",
  },
  {
    icon: BarChart3,
    title: "Progress analytics",
    desc: "Visualize scores, levels and momentum at a glance.",
  },
  {
    icon: Megaphone,
    title: "Live announcements",
    desc: "Reach the whole class with priority alerts.",
  },
  {
    icon: Bell,
    title: "Real-time notifications",
    desc: "Stay in sync with class activity instantly.",
  },
  {
    icon: WifiOff,
    title: "100% offline",
    desc: "Everything works without internet. Data stays local.",
  },
];

const levels = [
  {
    num: 1,
    name: "Beginner",
    emoji: "🌱",
    desc: "Counting & basics",
    color: "from-emerald-400 to-teal-500",
  },
  {
    num: 2,
    name: "Intermediate",
    emoji: "🚀",
    desc: "× and ÷",
    color: "from-blue-400 to-indigo-500",
  },
  {
    num: 3,
    name: "Advanced",
    emoji: "⭐",
    desc: "Fractions",
    color: "from-purple-400 to-fuchsia-500",
  },
  {
    num: 4,
    name: "Expert",
    emoji: "🏆",
    desc: "Problem solving",
    color: "from-amber-400 to-orange-500",
  },
];

const steps = [
  {
    n: "01",
    title: "Create a class",
    desc: "Sign up as a teacher and get your unique class code.",
  },
  {
    n: "02",
    title: "Invite students",
    desc: "Share the code. Students join in seconds, no email required.",
  },
  {
    n: "03",
    title: "Teach & track",
    desc: "Publish content, monitor progress, celebrate wins.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Primary Teacher",
    text: "My students actually look forward to math class now. The quizzes are addictive!",
    emoji: "👩‍🏫",
  },
  {
    name: "Lucas, 9",
    role: "Student",
    text: "I unlocked level 3 yesterday! The badges are so cool.",
    emoji: "🧒",
  },
  {
    name: "David K.",
    role: "School Director",
    text: "Finally a tool that works offline in our rural school. Game changer.",
    emoji: "🧑‍💼",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[36rem] h-[36rem] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-1/3 right-0 w-[30rem] h-[30rem] rounded-full bg-fun-pink/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] rounded-full bg-fun-purple/15 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/70 backdrop-blur-md text-xs font-semibold text-foreground mb-8 shadow-sm animate-slide-up">
            <Sparkles size={12} className="text-primary" />
            New: Real-time class notifications
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px]">
              LIVE
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.05] text-foreground animate-slide-up">
            Math made{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-fun-purple to-fun-pink bg-clip-text text-transparent">
                magical
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,6 Q50,0 100,6 T200,6"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-primary/50"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br />
            for primary school.
          </h1>

          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mt-8 leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            The all-in-one classroom for teachers and students. Interactive
            lessons, playful quizzes, real-time progress — and it works{" "}
            <span className="font-semibold text-foreground">100% offline</span>.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 justify-center mt-10 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold gradient-hero text-primary-foreground shadow-fun hover:shadow-hover hover:-translate-y-0.5 transition-all"
            >
              Start free now
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold text-foreground bg-card border border-border hover:border-primary/40 hover:bg-muted transition-all"
            >
              <Play size={16} /> Sign in
            </Link>
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-muted-foreground animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-primary" /> No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-primary" /> Works offline
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-primary" /> Made for kids 6-12
            </span>
          </div>

          {/* Floating preview card */}
          <div
            className="relative max-w-3xl mx-auto mt-20 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="absolute -top-4 -left-4 w-14 h-14 rounded-2xl bg-card border border-border shadow-card flex items-center justify-center text-2xl rotate-[-8deg] animate-float">
              ➕
            </div>
            <div
              className="absolute -top-2 -right-6 w-14 h-14 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-2xl animate-float"
              style={{ animationDelay: "1s" }}
            >
              🏆
            </div>
            <div
              className="absolute -bottom-4 left-1/4 w-12 h-12 rounded-2xl bg-card border border-border shadow-card flex items-center justify-center text-xl rotate-[12deg] animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              ✖️
            </div>

            <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-hover overflow-hidden">
              <div className="flex items-center gap-1.5 px-5 py-3 border-b border-border bg-muted/40">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div className="ml-3 text-xs text-muted-foreground font-mono">
              IsmOu Academy/student
                </div>
              </div>
              <div className="p-6 sm:p-8 grid sm:grid-cols-5 gap-5 text-left">
                <div className="sm:col-span-2 rounded-2xl bg-gradient-to-br from-primary/10 to-fun-pink/10 p-5">
                  <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                    Today's quiz
                  </p>
                  <p className="text-2xl font-display font-bold text-foreground mt-2">
                    8 × 7 = ?
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {["54", "56", "48", "63"].map((n) => (
                      <div
                        key={n}
                        className={`px-3 py-2 rounded-xl text-sm font-bold border text-center ${
                          n === "56"
                            ? "bg-primary text-primary-foreground border-primary shadow-fun"
                            : "bg-card border-border text-foreground"
                        }`}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center text-lg">
                        🧒
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          Hello Lucas!
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Level 2 · Intermediate
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      <Zap size={12} /> 248 pts
                    </div>
                  </div>
                  {[
                    { l: "Courses completed", v: 12, max: 15, c: "bg-primary" },
                    { l: "Quizzes passed", v: 8, max: 10, c: "bg-fun-pink" },
                    { l: "Daily streak", v: 5, max: 7, c: "bg-accent" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-foreground">
                          {s.l}
                        </span>
                        <span className="text-muted-foreground">
                          {s.v}/{s.max}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full ${s.c} rounded-full transition-all`}
                          style={{ width: `${(s.v / s.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="py-6 border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-muted-foreground text-sm">
          <span className="font-semibold text-foreground">
            Trusted by classrooms worldwide
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} /> Privacy-first
          </span>
          <span className="flex items-center gap-1.5">
            <WifiOff size={14} /> Offline-ready
          </span>
          <span className="flex items-center gap-1.5">
            <Smartphone size={14} /> Any device
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={14} /> Unlimited students
          </span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-display font-bold text-primary uppercase tracking-[0.2em]">
              Features
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mt-3 tracking-tight">
              Everything you need to teach math.
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Powerful for teachers. Joyful for students. Simple for everyone.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group relative rounded-3xl border border-border bg-card p-6 hover:shadow-hover hover:-translate-y-1 hover:border-primary/30 transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-fun-pink/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEVELS */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-display font-bold text-secondary uppercase tracking-[0.2em]">
              Progression
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mt-3 tracking-tight">
              Level up, one win at a time.
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Score 80% to unlock the next level. Built-in motivation, no
              pressure.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {levels.map((lv) => (
              <div
                key={lv.num}
                className="group relative bg-card rounded-3xl border border-border p-6 hover:shadow-hover hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${lv.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-display font-bold text-muted-foreground">
                      LEVEL {lv.num}
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className={`w-1.5 h-1.5 rounded-full ${n <= lv.num ? "bg-primary" : "bg-border"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-5xl mb-3">{lv.emoji}</div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-1">
                    {lv.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{lv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-display font-bold text-accent uppercase tracking-[0.2em]">
              How it works
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mt-3 tracking-tight">
              Up and running in 3 steps.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className="relative bg-card rounded-3xl border border-border p-6 hover:shadow-hover transition-all"
              >
                <div className="text-5xl font-display font-bold bg-gradient-to-br from-primary to-fun-pink bg-clip-text text-transparent mb-3">
                  {s.n}
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-display font-bold text-fun-pink uppercase tracking-[0.2em]">
              Loved by
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mt-3 tracking-tight">
              Teachers and kids agree.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-card rounded-3xl border border-border p-6 hover:shadow-hover transition-all"
              >
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-5">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="text-3xl">{t.emoji}</div>
                  <div>
                    <p className="font-bold text-foreground text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-fun-purple to-fun-pink p-10 sm:p-16 text-center text-primary-foreground shadow-hover">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <Trophy size={48} className="mx-auto mb-5 opacity-90" />
              <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight">
                Ready to make math fun?
              </h2>
              <p className="text-lg opacity-90 max-w-xl mx-auto mt-5">
                Join SmartMath today. Free forever. No credit card. No setup.
              </p>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-2xl text-base font-bold bg-white text-primary hover:-translate-y-0.5 hover:shadow-2xl transition-all"
              >
                Get started free
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧮</span>
            <span className="font-display font-bold text-foreground">
            IsmOu Academy
            </span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <p>Made with ❤️ for primary school teachers and students.</p>
        </div>
      </footer>
    </div>
  );
}
