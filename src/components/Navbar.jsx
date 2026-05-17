import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, X, User } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationsBell } from "@/components/NotificationsBell";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

import { useLanguage } from "@/contexts/LanguageContext";

import logo from "@/assets/IsmOu_logo.png";

export function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const { t, lang } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const avatar = user?.avatar || (user?.role === "teacher" ? "👨‍🏫" : "🧒");

  return (
    // 🔥 key={lang} force refresh navbar when language changes
    <nav
      key={lang}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-card"
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              className="h-[80px] md:h-[90px] lg:h-[110px] w-auto"
              alt="IsmOu Academy Logo"
            />
          </Link>

          {/* ================= Desktop ================= */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />

            <ThemeToggle />

            {user && <NotificationsBell />}

            {user ? (
              <>
                {/* Profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted transition-all"
                >
                  <span className="text-xl">{avatar}</span>

                  <span className="text-sm font-semibold text-foreground">
                    {user.username}
                  </span>

                  {user.role === "teacher" && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
                      {t("Teacher")}
                    </span>
                  )}
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
                >
                  <LogOut size={16} />

                  {t("Logout")}
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  {t("Login")}
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl text-sm font-medium gradient-hero text-primary-foreground hover:opacity-90 transition-all duration-200 shadow-fun"
                >
                  {t("Register")}
                </Link>
              </>
            )}
          </div>

          {/* ================= Mobile Toggle ================= */}
          <div className="md:hidden flex items-center gap-1">
            {user && <NotificationsBell />}

            <LanguageSwitcher />

            <ThemeToggle />

            <button className="p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ================= Mobile Menu ================= */}
        {menuOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            {user ? (
              <div className="flex flex-col gap-2">
                {/* Profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-muted"
                >
                  <User size={16} />

                  {user.username}
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut size={16} />

                  {t("Logout")}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Login */}
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg"
                >
                  {t("Login")}
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm gradient-hero text-primary-foreground rounded-xl text-center"
                >
                  {t("Register")}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
