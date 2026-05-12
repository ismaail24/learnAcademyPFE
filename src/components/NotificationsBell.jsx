import { useEffect, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import {
  getNotifications,
  markAllRead,
  clearNotifications,
} from "@/lib/notifications";

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function NotificationsBell() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const refresh = () => setItems(getNotifications(user.id));
    refresh();
    const onUpdate = (e) => {
      if (!e.detail || e.detail.uid === user.id) refresh();
    };
    window.addEventListener("notifications-updated", onUpdate);
    window.addEventListener("storage", refresh);
    const interval = setInterval(refresh, 5000);
    return () => {
      window.removeEventListener("notifications-updated", onUpdate);
      window.removeEventListener("storage", refresh);
      clearInterval(interval);
    };
  }, [user]);

  if (!user) return null;

  const unread = items.filter((n) => !n.read).length;

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v && unread > 0) {
          setTimeout(() => {
            markAllRead(user.id);
            setItems(getNotifications(user.id));
          }, 800);
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          className="relative p-2 rounded-xl hover:bg-muted transition-all"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-foreground" />
          {unread > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-primary" />
            <span className="font-display font-bold text-sm text-foreground">
              Notifications
            </span>
            {unread > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold">
                {unread} new
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {items.length > 0 && (
              <>
                <button
                  onClick={() => {
                    markAllRead(user.id);
                    setItems(getNotifications(user.id));
                  }}
                  title="Mark all read"
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <CheckCheck size={14} />
                </button>
                <button
                  onClick={() => {
                    clearNotifications(user.id);
                    setItems([]);
                  }}
                  title="Clear all"
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                You'll see updates here in real time.
              </p>
            </div>
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 border-b border-border last:border-0 hover:bg-muted/40 transition-colors ${
                  !n.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex gap-3">
                  <div className="text-2xl shrink-0">{n.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      )}
                    </div>
                    {n.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {n.description}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {timeAgo(n.date)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
