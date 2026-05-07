import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { TeacherSidebar, TeacherMobileNav } from "@/components/TeacherSidebar";
import { FunCard } from "@/components/FunComponents";
import { FileUpload } from "@/components/FileUpload";
import { getCourses, saveCourses } from "@/lib/storage";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

export default function TeacherCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState(getCourses);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", type: "text", content: "", level: 1 });

  const myCourses = useMemo(
    () => courses.filter((c) => c.teacherCode === user.teacherCode),
    [courses, user]
  );

  const handleSave = (e) => {
    e.preventDefault();
    let updated;
    if (editing) {
      updated = courses.map((c) =>
        c.id === editing.id ? { ...c, ...form } : c
      );
    } else {
      const newCourse = { id: Date.now().toString(), ...form, teacherCode: user.teacherCode };
      updated = [...courses, newCourse];
    }
    saveCourses(updated);
    setCourses(updated);
    setForm({ title: "", description: "", type: "text", content: "", level: 1 });
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updated = courses.filter((c) => c.id !== id);
    saveCourses(updated);
    setCourses(updated);
  };

  const startEdit = (c) => {
    setForm({ title: c.title, description: c.description, type: c.type, content: c.content, level: c.level });
    setEditing(c);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <TeacherMobileNav />
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-display font-bold text-foreground">Courses 📚</h1>
            <button
              onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: "", description: "", type: "text", content: "", level: 1 }); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-hero text-primary-foreground font-medium text-sm shadow-fun hover:shadow-hover transition-all"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "Add Course"}
            </button>
          </div>

          {showForm && (
            <FunCard className="mb-6 animate-slide-up" hover={false}>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all" placeholder="Course title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all" placeholder="Short description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, content: "" })} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all">
                      <option value="text">📝 Text</option>
                      <option value="video">🎥 Video</option>
                      <option value="image">🖼️ Image</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Level</label>
                    <select value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all">
                      <option value={1}>1 - Beginner</option>
                      <option value={2}>2 - Intermediate</option>
                      <option value={3}>3 - Advanced</option>
                      <option value={4}>4 - Expert</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Content {form.type === "video" ? "(YouTube embed URL or upload)" : form.type === "image" ? "(Image)" : "(Text)"}
                  </label>
                  {form.type === "text" ? (
                    <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={4} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all resize-none" placeholder="Write your lesson content..." />
                  ) : (
                    <div className="space-y-2">
                      <input value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all" placeholder={form.type === "video" ? "https://www.youtube.com/embed/..." : "Paste image URL or upload below"} />
                      <FileUpload
                        accept={form.type === "video" ? "video/*" : "image/*"}
                        label={form.type === "video" ? "Upload Video File" : "Upload Image File"}
                        onFileSelect={(data) => setForm({ ...form, content: data })}
                      />
                      {form.content && form.type === "image" && (
                        <img src={form.content} alt="preview" className="h-32 rounded-lg object-contain bg-muted" />
                      )}
                      {form.content && form.type === "video" && !form.content.startsWith("http") && (
                        <video src={form.content} controls className="h-32 rounded-lg bg-muted" />
                      )}
                    </div>
                  )}
                </div>
                <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-success text-accent-foreground font-medium text-sm hover:opacity-90 transition-all">
                  <Check size={16} /> {editing ? "Update" : "Save"} Course
                </button>
              </form>
            </FunCard>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {myCourses.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <span className="text-4xl block mb-3">📖</span>
                No courses yet. Create your first one!
              </div>
            ) : (
              myCourses.map((c) => (
                <FunCard key={c.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {c.type === "video" ? "🎥 Video" : c.type === "image" ? "🖼️ Image" : "📝 Text"} · Level {c.level}
                      </span>
                      <h3 className="font-display font-bold text-foreground mt-2">{c.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(c)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all">
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
