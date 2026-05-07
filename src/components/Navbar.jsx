import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const pathname = useLocation().pathname;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ✅ Déconnexion automatique quand on est sur "/"
  useEffect(() => {
    if (
      (pathname === "/" || pathname === "/login" || pathname === "/register") &&
      user
    ) {
      logout();
      navigate("/");
    }
  }, [pathname]); // Se réexécute quand pathname change

  return (
    <nav className="min-w-full border-1 border-gray-300 sticky top-0 z-50 bg-card/100 backdrop-blur-md border-b border-border shadow-card">
      <div className="min-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            onClick={handleLogout}
            className="flex items-center gap-2 group"
          >
            <span className="text-3xl group-hover:animate-wiggle">🧮</span>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-fun-purple bg-clip-text text-transparent">
              LEARN ACADEMY{" "}
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Hi,{" "}
                  <span className="font-semibold text-foreground">
                    {user.username}
                  </span>
                  {user.role === "teacher" && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
                      Teacher
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl text-sm font-medium gradient-hero text-primary-foreground hover:opacity-90 transition-all duration-200 shadow-fun"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            {user ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground px-2">
                  Hi, {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm gradient-hero text-primary-foreground rounded-xl text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
