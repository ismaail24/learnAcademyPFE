import { getLevelName } from "@/lib/storage";
import { Star, Lock } from "lucide-react";

export function LevelBadge({ level, current, size = "md" }) {
  const unlocked = current >= level;
  const isActive = current === level;

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const colors = {
    1: "from-primary to-fun-purple",
    2: "from-secondary to-fun-pink",
    3: "from-accent to-fun-teal",
    4: "from-fun-purple to-fun-pink",
  };

  if (!unlocked) {
    return (
      <span
        className={`inline-flex items-center gap-1 ${sizes[size]} rounded-full bg-muted text-muted-foreground font-display font-medium`}
      >
        <Lock size={14} />
        {getLevelName(level)}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 ${sizes[size]} rounded-full bg-gradient-to-r ${colors[level]} text-primary-foreground font-display font-medium ${
        isActive ? "shadow-fun animate-pop ring-2 ring-primary/30" : ""
      }`}
    >
      <Star size={14} fill={isActive ? "currentColor" : "none"} />
      {getLevelName(level)}
    </span>
  );
}

export function FunCard({ children, className = "", hover = true, ...props }) {
  return (
    <div
      className={`bg-card rounded-2xl border border-border shadow-card p-6 transition-all duration-300 ${
        hover ? "hover:shadow-hover hover:-translate-y-1" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({ icon, label, value, color = "primary" }) {
  const colors = {
    primary: "gradient-hero",
    secondary: "gradient-fun",
    accent: "gradient-success",
    purple: "bg-gradient-to-br from-fun-purple to-fun-pink",
  };

  return (
    <FunCard className="animate-slide-up">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center text-primary-foreground text-xl`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-display font-bold text-foreground">
            {value}
          </p>
        </div>
      </div>
    </FunCard>
  );
}
