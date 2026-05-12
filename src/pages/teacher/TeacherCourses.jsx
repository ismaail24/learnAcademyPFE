import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { TeacherSidebar, TeacherMobileNav } from "@/components/TeacherSidebar";
import { FunCard } from "@/components/FunComponents";
import { FileUpload } from "@/components/FileUpload";
import { getCourses, saveCourses } from "@/lib/storage";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

// ✅ Convert any YouTube URL to embed URL
const convertYoutubeUrl = (url) => {
  if (!url) return "";

  // Already embed URL
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  // youtube watch?v=
  const watchMatch = url.match(/v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // youtu.be
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  // youtube shorts
  const shortsMatch = url.match(/shorts\/([^?]+)/);
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  return url;
};

export default function TeacherCourses() {
  const { user } = useAuth();

  const [courses, setCourses] = useState(getCourses);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "text",
    content: "",
    level: 1,
  });

  const myCourses = useMemo(
    () => courses.filter((c) => c.teacherCode === user.teacherCode),
    [courses, user],
  );

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      type: "text",
      content: "",
      level: 1,
    });

    setEditing(null);
    setShowForm(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    let updatedCourses = [];

    if (editing) {
      updatedCourses = courses.map((course) =>
        course.id === editing.id
          ? {
              ...course,
              ...form,
            }
          : course,
      );
    } else {
      const newCourse = {
        id: Date.now().toString(),
        ...form,
        teacherCode: user.teacherCode,
      };

      updatedCourses = [...courses, newCourse];
    }

    saveCourses(updatedCourses);
    setCourses(updatedCourses);

    resetForm();
  };

  const handleDelete = (id) => {
    const updated = courses.filter((course) => course.id !== id);

    saveCourses(updated);
    setCourses(updated);
  };

  const startEdit = (course) => {
    setForm({
      title: course.title,
      description: course.description,
      type: course.type,
      content: course.content,
      level: course.level,
    });

    setEditing(course);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <TeacherMobileNav />

      <div className="flex">
        <TeacherSidebar />

        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">Courses 📚</h1>

            <button
              onClick={() => {
                if (showForm) {
                  resetForm();
                } else {
                  setShowForm(true);
                }
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-105 transition-all"
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}

              {showForm ? "Cancel" : "Add Course"}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <FunCard className="mb-8 animate-slide-up" hover={false}>
              <form onSubmit={handleSave} className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Course Title
                  </label>

                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter course title"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>

                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                    placeholder="Course description..."
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
                  />
                </div>

                {/* Type + Level */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Course Type
                    </label>

                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          type: e.target.value,
                          content: "",
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="text">📝 Text</option>
                      <option value="video">🎥 Video</option>
                      <option value="image">🖼️ Image</option>
                    </select>
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Level
                    </label>

                    <select
                      value={form.level}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          level: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value={1}>1 - Beginner</option>
                      <option value={2}>2 - Intermediate</option>
                      <option value={3}>3 - Advanced</option>
                      <option value={4}>4 - Expert</option>
                    </select>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Content
                  </label>

                  {form.type === "text" ? (
                    <textarea
                      required
                      rows={5}
                      value={form.content}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          content: e.target.value,
                        })
                      }
                      placeholder="Write lesson content..."
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
                    />
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={form.content}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            content:
                              form.type === "video"
                                ? convertYoutubeUrl(e.target.value)
                                : e.target.value,
                          })
                        }
                        placeholder={
                          form.type === "video"
                            ? "Paste any YouTube URL..."
                            : "Paste image URL..."
                        }
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                      />

                      <FileUpload
                        accept={form.type === "video" ? "video/*" : "image/*"}
                        label={
                          form.type === "video"
                            ? "Upload Video"
                            : "Upload Image"
                        }
                        onFileSelect={(data) =>
                          setForm({
                            ...form,
                            content: data,
                          })
                        }
                      />

                      {/* Image Preview */}
                      {form.content && form.type === "image" && (
                        <img
                          src={form.content}
                          alt="preview"
                          className="h-40 rounded-xl object-contain bg-muted"
                        />
                      )}

                      {/* Video Preview */}
                      {form.content && form.type === "video" && (
                        <>
                          {form.content.startsWith("http") ? (
                            <iframe
                              src={form.content}
                              title="Video Preview"
                              className="w-full h-64 rounded-xl"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={form.content}
                              controls
                              className="w-full h-64 rounded-xl bg-muted"
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:scale-105 transition-all"
                >
                  <Check size={18} />

                  {editing ? "Update Course" : "Save Course"}
                </button>
              </form>
            </FunCard>
          )}

          {/* Courses */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myCourses.length === 0 ? (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                <span className="text-6xl block mb-4">📚</span>

                <p className="text-lg">No courses available yet</p>
              </div>
            ) : (
              myCourses.map((course) => (
                <FunCard key={course.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {course.type === "video"
                          ? "🎥 Video"
                          : course.type === "image"
                            ? "🖼️ Image"
                            : "📝 Text"}{" "}
                        · Level {course.level}
                      </span>

                      <h3 className="font-bold text-lg mt-3">{course.title}</h3>

                      <p className="text-sm text-muted-foreground mt-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(course)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
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
