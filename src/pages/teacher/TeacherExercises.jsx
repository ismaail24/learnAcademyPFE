import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { TeacherSidebar, TeacherMobileNav } from "@/components/TeacherSidebar";
import { FunCard } from "@/components/FunComponents";
import { FileUpload } from "@/components/FileUpload";
import { getExercises, saveExercises } from "@/lib/storage";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

export default function TeacherExercises() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState(getExercises);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    question: "",
    questionType: "text",
    answer: "",
    answerType: "text",
    level: 1,
  });

  const myExercises = useMemo(
    () => exercises.filter((e) => e.teacherCode === user.teacherCode),
    [exercises, user],
  );

  const handleSave = (e) => {
    e.preventDefault();
    let updated;
    if (editing) {
      updated = exercises.map((ex) =>
        ex.id === editing.id ? { ...ex, ...form } : ex,
      );
    } else {
      const newEx = {
        id: Date.now().toString(),
        ...form,
        teacherCode: user.teacherCode,
      };
      updated = [...exercises, newEx];
    }
    saveExercises(updated);
    setExercises(updated);
    setForm({
      question: "",
      questionType: "text",
      answer: "",
      answerType: "text",
      level: 1,
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updated = exercises.filter((e) => e.id !== id);
    saveExercises(updated);
    setExercises(updated);
  };

  const startEdit = (ex) => {
    setForm({
      question: ex.question,
      questionType: ex.questionType || "text",
      answer: ex.answer,
      answerType: ex.answerType || "text",
      level: ex.level,
    });
    setEditing(ex);
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
            <h1 className="text-2xl font-display font-bold text-foreground">
              Exercises ✏️
            </h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditing(null);
                setForm({
                  question: "",
                  questionType: "text",
                  answer: "",
                  answerType: "text",
                  level: 1,
                });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-hero text-primary-foreground font-medium text-sm shadow-fun hover:shadow-hover transition-all"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "Add Exercise"}
            </button>
          </div>

          {showForm && (
            <FunCard className="mb-6 animate-slide-up" hover={false}>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Question Type
                    </label>
                    <select
                      value={form.questionType}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          questionType: e.target.value,
                          question: "",
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
                    >
                      <option value="text">📝 Text</option>
                      <option value="image">🖼️ Image</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Answer Type
                    </label>
                    <select
                      value={form.answerType}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          answerType: e.target.value,
                          answer: "",
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
                    >
                      <option value="text">📝 Text</option>
                      <option value="image">🖼️ Image</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Question {form.questionType === "image" ? "(Image)" : ""}
                  </label>
                  {form.questionType === "image" ? (
                    <div className="space-y-2">
                      <input
                        value={form.question}
                        onChange={(e) =>
                          setForm({ ...form, question: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
                        placeholder="Paste image URL or upload below"
                      />
                      <FileUpload
                        accept="image/*"
                        label="Upload Question Image"
                        onFileSelect={(data) =>
                          setForm({ ...form, question: data })
                        }
                      />
                      {form.question && (
                        <img
                          src={form.question}
                          alt="preview"
                          className="h-24 rounded-lg object-contain bg-muted"
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      value={form.question}
                      onChange={(e) =>
                        setForm({ ...form, question: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
                      placeholder="e.g. 5 + 3 = ?"
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Answer {form.answerType === "image" ? "(Image)" : ""}
                    </label>
                    {form.answerType === "image" ? (
                      <div className="space-y-2">
                        <input
                          value={form.answer}
                          onChange={(e) =>
                            setForm({ ...form, answer: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
                          placeholder="Paste image URL or upload below"
                        />
                        <FileUpload
                          accept="image/*"
                          label="Upload Answer Image"
                          onFileSelect={(data) =>
                            setForm({ ...form, answer: data })
                          }
                        />
                        {form.answer && (
                          <img
                            src={form.answer}
                            alt="preview"
                            className="h-20 rounded-lg object-contain bg-muted"
                          />
                        )}
                      </div>
                    ) : (
                      <input
                        value={form.answer}
                        onChange={(e) =>
                          setForm({ ...form, answer: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
                        placeholder="e.g. 8"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Level
                    </label>
                    <select
                      value={form.level}
                      onChange={(e) =>
                        setForm({ ...form, level: Number(e.target.value) })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
                    >
                      <option value={1}>1 - Beginner</option>
                      <option value={2}>2 - Intermediate</option>
                      <option value={3}>3 - Advanced</option>
                      <option value={4}>4 - Expert</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-success text-accent-foreground font-medium text-sm hover:opacity-90 transition-all"
                >
                  <Check size={16} /> {editing ? "Update" : "Save"} Exercise
                </button>
              </form>
            </FunCard>
          )}

          <div className="space-y-3">
            {myExercises.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <span className="text-4xl block mb-3">📝</span>
                No exercises yet. Create your first one!
              </div>
            ) : (
              myExercises.map((ex) => (
                <FunCard
                  key={ex.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    {ex.questionType === "image" ? (
                      <img
                        src={ex.question}
                        alt="question"
                        className="h-16 rounded-lg object-contain bg-muted mb-1"
                      />
                    ) : (
                      <p className="font-display font-semibold text-foreground">
                        {ex.question}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Answer:{" "}
                      {ex.answerType === "image" ? (
                        <img
                          src={ex.answer}
                          alt="answer"
                          className="inline-block h-8 rounded object-contain bg-muted ml-1"
                        />
                      ) : (
                        <span className="font-mono font-bold text-accent">
                          {ex.answer}
                        </span>
                      )}{" "}
                      · Level {ex.level}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(ex)}
                      className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(ex.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
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
