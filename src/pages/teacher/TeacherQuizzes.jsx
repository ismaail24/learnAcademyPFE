import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { TeacherSidebar, TeacherMobileNav } from "@/components/TeacherSidebar";
import { FunCard } from "@/components/FunComponents";
import { getQuizzes, saveQuizzes } from "@/lib/storage";
import { Plus, Pencil, Trash2, X, Check, HelpCircle } from "lucide-react";

const emptyQuestion = {
  question: "",
  questionType: "text",
  options: ["", "", "", ""],
  correctIndex: 0,
};

export default function TeacherQuizzes() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState(getQuizzes);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    level: 1,
    questions: [{ ...emptyQuestion }],
  });

  const myQuizzes = useMemo(
    () => quizzes.filter((q) => q.teacherCode === user.teacherCode),
    [quizzes, user],
  );

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        { ...emptyQuestion, options: ["", "", "", ""] },
      ],
    });
  };

  const removeQuestion = (idx) => {
    if (form.questions.length <= 1) return;
    setForm({ ...form, questions: form.questions.filter((_, i) => i !== idx) });
  };

  const updateQuestion = (idx, field, value) => {
    const updated = form.questions.map((q, i) =>
      i === idx ? { ...q, [field]: value } : q,
    );
    setForm({ ...form, questions: updated });
  };

  const updateOption = (qIdx, oIdx, value) => {
    const updated = form.questions.map((q, i) => {
      if (i !== qIdx) return q;
      const opts = [...q.options];
      opts[oIdx] = value;
      return { ...q, options: opts };
    });
    setForm({ ...form, questions: updated });
  };

  const handleSave = (e) => {
    e.preventDefault();
    let updated;
    if (editing) {
      updated = quizzes.map((q) =>
        q.id === editing.id ? { ...q, ...form, updatedAt: Date.now() } : q,
      );
    } else {
      const newQuiz = {
        id: Date.now().toString(),
        ...form,
        teacherCode: user.teacherCode,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      updated = [...quizzes, newQuiz];
    }
    saveQuizzes(updated);
    setQuizzes(updated);
    setForm({
      title: "",
      level: 1,
      questions: [{ ...emptyQuestion, options: ["", "", "", ""] }],
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updated = quizzes.filter((q) => q.id !== id);
    saveQuizzes(updated);
    setQuizzes(updated);
  };

  const startEdit = (quiz) => {
    setForm({
      title: quiz.title,
      level: quiz.level,
      questions: quiz.questions.map((q) => ({ ...q, options: [...q.options] })),
    });
    setEditing(quiz);
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
              Quizzes 🧩
            </h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditing(null);
                setForm({
                  title: "",
                  level: 1,
                  questions: [{ ...emptyQuestion, options: ["", "", "", ""] }],
                });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-hero text-primary-foreground font-medium text-sm shadow-fun hover:shadow-hover transition-all"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "Create Quiz"}
            </button>
          </div>

          {showForm && (
            <FunCard className="mb-6 animate-slide-up" hover={false}>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Quiz Title
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
                      placeholder="e.g. Addition Quiz Level 1"
                    />
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-foreground">
                      Questions
                    </h3>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="text-xs px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                    >
                      + Add Question
                    </button>
                  </div>

                  {form.questions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="p-4 rounded-xl border border-border bg-muted/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          Question {qIdx + 1}
                        </span>
                        {form.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIdx)}
                            className="text-destructive text-xs hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                          Question type
                        </label>
                        <select
                          value={q.questionType || "text"}
                          onChange={(e) =>
                            updateQuestion(qIdx, "questionType", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                        >
                          <option value="text">📝 Text</option>
                          <option value="image">🖼️ Image URL</option>
                        </select>
                      </div>
                      <input
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(qIdx, "question", e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                        placeholder={
                          q.questionType === "image"
                            ? "Image URL for the question"
                            : "Question text"
                        }
                      />
                      {q.questionType === "image" && q.question && (
                        <img
                          src={q.question}
                          alt="preview"
                          className="h-20 rounded-lg object-contain bg-muted"
                        />
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={q.correctIndex === oIdx}
                              onChange={() =>
                                updateQuestion(qIdx, "correctIndex", oIdx)
                              }
                              className="accent-primary"
                            />
                            <input
                              value={opt}
                              onChange={(e) =>
                                updateOption(qIdx, oIdx, e.target.value)
                              }
                              required
                              className="flex-1 px-3 py-1.5 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                              placeholder={`Option ${oIdx + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-success text-accent-foreground font-medium text-sm hover:opacity-90 transition-all"
                >
                  <Check size={16} /> {editing ? "Update" : "Save"} Quiz
                </button>
              </form>
            </FunCard>
          )}

          <div className="space-y-3">
            {myQuizzes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <span className="text-4xl block mb-3">🧩</span>
                No quizzes yet. Create your first one!
              </div>
            ) : (
              myQuizzes.map((quiz) => (
                <FunCard
                  key={quiz.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <HelpCircle size={16} className="text-primary" />
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        Level {quiz.level}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-foreground">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {quiz.questions.length} questions
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(quiz)}
                      className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id)}
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
