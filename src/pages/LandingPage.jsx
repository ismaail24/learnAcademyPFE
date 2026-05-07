import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import {
  BookOpen,
  BarChart3,
  Gamepad2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: <Gamepad2 size={32} />,
    title: "Interactive Exercises",
    description:
      "Practice math with fun, engaging exercises adapted to your level",
    emoji: "🎮",
    color: "gradient-hero",
  },
  {
    icon: <BookOpen size={32} />,
    title: "Multimedia Courses",
    description:
      "Learn with videos, images, and text lessons created by teachers",
    emoji: "📚",
    color: "gradient-fun",
  },
  {
    icon: <BarChart3 size={32} />,
    title: "Progress Tracking",
    description:
      "Track your scores, unlock levels, and earn badges as you learn",
    emoji: "📊",
    color: "gradient-success",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-20">
          ➕
        </div>
        <div
          className="absolute top-40 right-20 text-5xl animate-float opacity-20"
          style={{ animationDelay: "1s" }}
        >
          ✖️
        </div>
        <div
          className="absolute bottom-20 left-1/4 text-4xl animate-float opacity-20"
          style={{ animationDelay: "2s" }}
        >
          ➗
        </div>
        <div
          className="absolute bottom-10 right-1/3 text-5xl animate-float opacity-20"
          style={{ animationDelay: "0.5s" }}
        >
          ➖
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles size={16} />
              Math made fun for kids!
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary via-fun-purple to-fun-pink bg-clip-text text-transparent">
                LEARN ACADEMY{" "}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body">
              Learn Math in a Fun and Interactive Way
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-display font-semibold gradient-hero text-primary-foreground shadow-fun hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
              >
                Get Started
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-2xl text-lg font-display font-semibold text-primary border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Why LEARN ACADEMY? 🚀
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to make math learning exciting and effective
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group bg-card rounded-3xl border border-border shadow-card p-8 hover:shadow-hover hover:-translate-y-2 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${f.color} flex items-center justify-center text-primary-foreground mb-6 group-hover:animate-wiggle`}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3">
                  {f.emoji} {f.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            🧮 LEARN ACADEMY © {new Date().getFullYear()} — Making math fun for
            everyone!
          </p>
        </div>
      </footer>
    </div>
  );
}
