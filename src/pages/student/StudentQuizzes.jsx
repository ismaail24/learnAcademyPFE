import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { StudentSidebar, StudentMobileNav } from "@/components/StudentSidebar";
import { FunCard, LevelBadge } from "@/components/FunComponents";
import { getQuizzes, getQuizResults, saveQuizResults } from "@/lib/storage";
import { Play, Check, X, RotateCcw, Trophy, ArrowRight } from "lucide-react";

export default function StudentQuizzes() {
  const { user } = useAuth();
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const quizzes = useMemo(
    () =>
      getQuizzes().filter(
        (q) => q.level <= user.level && q.teacherCode === user.teacherCode,
      ),
    [user],
  );

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setFinished(false);
  };

  const handleSelect = (idx) => {
    if (feedback !== null) return;
    setSelected(idx);
  };

  const handleCheck = () => {
    if (selected === null) return;
    const correct = activeQuiz.questions[currentQ].correctIndex === selected;
    setFeedback(correct ? "correct" : "incorrect");
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ + 1 >= activeQuiz.questions.length) {
      const result = {
        userId: user.id,
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        teacherCode: user.teacherCode,
        score,
        total: activeQuiz.questions.length,
        level: activeQuiz.level,
        date: Date.now(),
      };
      const results = getQuizResults();
      saveQuizResults([...results, result]);
      setFinished(true);
    } else {
      setCurrentQ((i) => i + 1);
      setSelected(null);
      setFeedback(null);
    }
  };

  const wrapWithLayout = (content) => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <StudentMobileNav />
      <div className="flex">
        <StudentSidebar />
        <div className="flex-1">{content}</div>
      </div>
    </div>
  );

  // Quiz list
  if (!activeQuiz) {
    return wrapWithLayout(
      <div className="min-w-4xl mx-auto px-12 py-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Quizzes 🧩
        </h1>
        <p className="text-muted-foreground mb-8">
          Test your knowledge with fun quizzes!
        </p>
        {quizzes.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <span className="text-6xl block mb-4">🧩</span>
            <p className="text-xl font-display">No quizzes available yet!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <FunCard key={quiz.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-bold text-foreground">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {quiz.questions.length} questions
                    </p>
                  </div>
                  <LevelBadge
                    level={quiz.level}
                    current={user.level}
                    size="sm"
                  />
                </div>
                <button
                  onClick={() => startQuiz(quiz)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-hero text-primary-foreground font-medium text-sm shadow-fun hover:shadow-hover transition-all w-full justify-center"
                >
                  <Play size={16} /> Start Quiz
                </button>
              </FunCard>
            ))}
          </div>
        )}
      </div>,
    );
  }

  // Finished
  if (finished) {
    const pct = Math.round((score / activeQuiz.questions.length) * 100);
    return wrapWithLayout(
      <div className="max-w-lg mx-auto px-4 py-16 text-center animate-pop">
        <div className="text-7xl mb-6">
          {pct >= 80 ? "🏆" : pct >= 50 ? "⭐" : "💪"}
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          {pct >= 80
            ? "Amazing!"
            : pct >= 50
              ? "Good job!"
              : "Keep practicing!"}
        </h1>
        <p className="text-xl text-muted-foreground mb-2">{activeQuiz.title}</p>
        <p className="text-xl text-muted-foreground mb-6">
          You scored{" "}
          <span className="font-bold text-primary">
            {score}/{activeQuiz.questions.length}
          </span>{" "}
          ({pct}%)
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => startQuiz(activeQuiz)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl gradient-fun text-secondary-foreground font-display font-semibold shadow-fun hover:shadow-hover transition-all"
          >
            <RotateCcw size={20} /> Retry
          </button>
          <button
            onClick={() => setActiveQuiz(null)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl gradient-hero text-primary-foreground font-display font-semibold shadow-fun hover:shadow-hover transition-all"
          >
            All Quizzes
          </button>
        </div>
      </div>,
    );
  }

  // Active quiz question
  const q = activeQuiz.questions[currentQ];
  return wrapWithLayout(
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Question {currentQ + 1} of {activeQuiz.questions.length}
          </span>
          <span className="font-bold text-primary">{score} pts</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-hero rounded-full transition-all duration-500"
            style={{
              width: `${((currentQ + 1) / activeQuiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <FunCard className="animate-pop" hover={false}>
        <div className="text-center py-4">
          {q.questionType === "image" ? (
            <img
              src={q.question}
              alt="Question"
              className="max-h-48 mx-auto rounded-xl mb-6 object-contain"
            />
          ) : (
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              {q.question}
            </h2>
          )}

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {q.options.map((opt, idx) => {
              let style = "border-input bg-background hover:border-primary/50";
              if (feedback) {
                if (idx === q.correctIndex)
                  style = "border-accent bg-accent/10 text-accent";
                else if (idx === selected && feedback === "incorrect")
                  style =
                    "border-destructive bg-destructive/10 text-destructive";
              } else if (idx === selected) {
                style = "border-primary bg-primary/10 text-primary";
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={!!feedback}
                  className={`p-4 rounded-xl border-2 font-display font-semibold transition-all ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`mt-6 p-4 rounded-2xl animate-pop ${feedback === "correct" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}
            >
              <div className="flex items-center justify-center gap-2 text-xl font-display font-bold">
                {feedback === "correct" ? (
                  <>
                    <Check size={24} /> Correct! 🎉
                  </>
                ) : (
                  <>
                    <X size={24} /> Wrong! Answer: {q.options[q.correctIndex]}
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            {!feedback ? (
              <button
                onClick={handleCheck}
                disabled={selected === null}
                className="px-10 py-3.5 rounded-2xl gradient-hero text-primary-foreground font-display font-semibold text-lg shadow-fun hover:shadow-hover transition-all disabled:opacity-50"
              >
                Check Answer ✅
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 mx-auto px-10 py-3.5 rounded-2xl gradient-fun text-secondary-foreground font-display font-semibold text-lg shadow-fun hover:shadow-hover transition-all"
              >
                {currentQ + 1 >= activeQuiz.questions.length ? (
                  <>
                    <Trophy size={20} /> See Results
                  </>
                ) : (
                  <>
                    <ArrowRight size={20} /> Next
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </FunCard>
    </div>,
  );
}
