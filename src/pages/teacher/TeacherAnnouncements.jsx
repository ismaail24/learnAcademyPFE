import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { TeacherSidebar, TeacherMobileNav } from "@/components/TeacherSidebar";
import { FunCard } from "@/components/FunComponents";
import { getAnnouncements, saveAnnouncements } from "@/lib/storage";
import { Plus, Pencil, Trash2, X, Check, Megaphone } from "lucide-react";

export default function TeacherAnnouncements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState(getAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    priority: "normal",
  });

  const myAnnouncements = useMemo(
    () => announcements.filter((a) => a.teacherCode === user.teacherCode),
    [announcements, user],
  );

  const handleSave = (e) => {
    e.preventDefault();
    let updated;
    if (editing) {
      updated = announcements.map((a) =>
        a.id === editing.id ? { ...a, ...form, updatedAt: Date.now() } : a,
      );
    } else {
      const newAnnouncement = {
        id: Date.now().toString(),
        ...form,
        teacherCode: user.teacherCode,
        teacherName: user.username,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      updated = [newAnnouncement, ...announcements];
    }
    saveAnnouncements(updated);
    setAnnouncements(updated);
    setForm({ title: "", content: "", priority: "normal" });
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updated = announcements.filter((a) => a.id !== id);
    saveAnnouncements(updated);
    setAnnouncements(updated);
  };

  const startEdit = (a) => {
    setForm({ title: a.title, content: a.content, priority: a.priority });
    setEditing(a);
    setShowForm(true);
  };

  const priorityColors = {
    urgent: "bg-destructive/10 text-destructive border-destructive/30",
    important: "bg-secondary/10 text-secondary border-secondary/30",
    normal: "bg-primary/10 text-primary border-primary/30",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <TeacherMobileNav />
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-display font-bold text-foreground">
              Announcements 📢
            </h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditing(null);
                setForm({ title: "", content: "", priority: "normal" });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-hero text-primary-foreground font-medium text-sm shadow-fun hover:shadow-hover transition-all"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "New Announcement"}
            </button>
          </div>

          {showForm && (
            <FunCard className="mb-6 animate-slide-up" hover={false}>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Title
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
                    placeholder="Announcement title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Content
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all resize-none"
                    placeholder="Write your announcement..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
                  >
                    <option value="normal">🟢 Normal</option>
                    <option value="important">🟡 Important</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-success text-accent-foreground font-medium text-sm hover:opacity-90 transition-all"
                >
                  <Check size={16} /> {editing ? "Update" : "Publish"}{" "}
                  Announcement
                </button>
              </form>
            </FunCard>
          )}

          <div className="space-y-3">
            {myAnnouncements.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <span className="text-4xl block mb-3">📢</span>
                No announcements yet. Create your first one!
              </div>
            ) : (
              myAnnouncements.map((a) => (
                <FunCard key={a.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Megaphone size={16} className="text-primary" />
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityColors[a.priority]}`}
                        >
                          {a.priority === "urgent"
                            ? "🔴 Urgent"
                            : a.priority === "important"
                              ? "🟡 Important"
                              : "🟢 Normal"}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-foreground">
                        {a.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                        {a.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(a)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </FunCard>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
