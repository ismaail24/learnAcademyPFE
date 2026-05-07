import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [teacherCode, setTeacherCode] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    const result = register(username, password, role, teacherCode || "DEFAULT");
    if (!result.success) {
      setError(result.message);
      return;
    }
    navigate(
      result.user.role === "teacher"
        ? "/teacher/dashboard"
        : "/student/dashboard",
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md animate-pop">
          <div className="bg-card rounded-3xl border border-border shadow-card p-8">
            <div className="text-center mb-8">
              <span className="text-5xl block mb-3">✨</span>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Join LEARN ACADEMY!
              </h1>
              <p className="text-muted-foreground mt-2">
                Create your account to start
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center animate-wiggle">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all pr-12"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`py-3 rounded-xl font-display font-semibold text-sm border-2 transition-all duration-200 ${
                      role === "student"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    👦 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("teacher")}
                    className={`py-3 rounded-xl font-display font-semibold text-sm border-2 transition-all duration-200 ${
                      role === "teacher"
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border text-muted-foreground hover:border-secondary/40"
                    }`}
                  >
                    👨‍🏫 Teacher
                  </button>
                </div>
              </div>

              {role === "student" && (
                <div className="animate-slide-up">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Teacher Code{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={teacherCode}
                    onChange={(e) =>
                      setTeacherCode(e.target.value.toUpperCase())
                    }
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                    placeholder="e.g. TC-ABC123"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to use default content
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-display font-semibold text-lg gradient-hero text-primary-foreground shadow-fun hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300"
              >
                Create Account ✨
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
