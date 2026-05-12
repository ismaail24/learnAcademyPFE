import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { FunCard, LevelBadge } from "@/components/FunComponents";
import { getUsers, saveUsers } from "@/lib/storage";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";

const AVATARS = [
  "🧮",
  "🦊",
  "🐼",
  "🦄",
  "🐯",
  "🐶",
  "🐸",
  "🐱",
  "🦁",
  "🐵",
  "🐧",
  "🦉",
  "👦",
  "👧",
  "🧒",
  "👨‍🏫",
  "👩‍🏫",
  "🧑‍🎓",
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(
    user.avatar || (user.role === "teacher" ? "👨‍🏫" : "🧒"),
  );

  const handleSave = (e) => {
    e.preventDefault();
    if (!username.trim()) return toast.error("Username required");
    if (password && password.length < 4)
      return toast.error("Password must be at least 4 chars");

    const users = getUsers();
    if (
      username !== user.username &&
      users.some((u) => u.username === username)
    ) {
      return toast.error("Username already taken");
    }

    const updated = {
      ...user,
      username: username.trim(),
      avatar,
      ...(password ? { password } : {}),
    };
    updateUser(updated);
    setPassword("");
    toast.success("Profile updated! ✨");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-all"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <FunCard hover={false} className="animate-pop">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-3xl gradient-hero flex items-center justify-center text-5xl mb-3 animate-float shadow-fun">
              {avatar}
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              My Profile
            </h1>
            <p className="text-sm text-muted-foreground capitalize">
              {user.role}
            </p>
            {user.role === "student" && (
              <div className="mt-3 flex items-center gap-3">
                <LevelBadge level={user.level} current={user.level} size="sm" />
                <span className="text-sm font-display font-bold text-secondary">
                  {user.score} pts
                </span>
              </div>
            )}
            {user.role === "teacher" && (
              <p className="mt-3 text-xs text-muted-foreground">
                Code:{" "}
                <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {user.teacherCode}
                </span>
              </p>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Choose your avatar
              </label>
              <div className="grid grid-cols-9 gap-2">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={`text-2xl p-2 rounded-xl border-2 transition-all ${
                      avatar === a
                        ? "border-primary bg-primary/10 scale-110"
                        : "border-transparent hover:bg-muted"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                New password{" "}
                <span className="text-muted-foreground">
                  (leave empty to keep current)
                </span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-semibold gradient-hero text-primary-foreground shadow-fun hover:shadow-hover transition-all"
            >
              <Save size={18} /> Save Changes
            </button>
          </form>
        </FunCard>
      </main>
    </div>
  );
}
