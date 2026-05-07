import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { StudentSidebar, StudentMobileNav } from "@/components/StudentSidebar";
import { FunCard, LevelBadge } from "@/components/FunComponents";
import { getExercises, getResults, saveResults } from "@/lib/storage";
import { Check, X, ArrowRight, RotateCcw, Trophy, Eye } from "lucide-react";

function ExerciseOverview({ exercises, onStart, onBack }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-all"
      >
        <X size={16} /> Back
      </button>
      <h2 className="text-2xl font-display font-bold text-foreground mb-4">
        Exercise Overview 📋
      </h2>
      <div className="space-y-3 mb-6">
        {exercises.map((ex, i) => (
          <FunCard
            key={ex.id}
            hover={false}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground w-8">
                #{i + 1}
              </span>
              {ex.questionType === "image" ? (
                <img
                  src={ex.question}
                  alt="question"
                  className="h-12 rounded-lg object-contain bg-muted"
                />
              ) : (
                <p className="font-display font-semibold text-foreground flex-1">
                  {ex.question}
                </p>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                Lv.{ex.level}
              </span>
            </div>
          </FunCard>
        ))}
      </div>
      <button
        onClick={onStart}
        className="flex items-center gap-2 mx-auto px-8 py-3 rounded-2xl gradient-hero text-primary-foreground font-display font-semibold shadow-fun hover:shadow-hover transition-all"
      >
        <ArrowRight size={20} /> Start Exercises
      </button>
    </div>
  );
}

export default function StudentExercises() {
  const { user, updateUser } = useAuth();
  const [mode, setMode] = useState("list"); // list | overview | quiz | finished
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const exercises = useMemo(
    () =>
      getExercises().filter(
        (e) =>
          e.level <= user.level &&
          (e.teacherCode === user.teacherCode || e.teacherCode === "DEFAULT"),
      ),
    [user],
  );

  const current = exercises[currentIndex];

  const handleCheck = () => {
    if (!answer.trim()) return;
    const isCorrect =
      answer.trim().toLowerCase() === current.answer.toLowerCase();
    setFeedback(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setAnswer("");
    setFeedback(null);
    if (currentIndex + 1 >= exercises.length) {
      const finalScore = score;
      const result = {
        userId: user.id,
        teacherCode: user.teacherCode,
        score: finalScore,
        total: exercises.length,
        level: user.level,
        date: Date.now(),
      };
      const results = getResults();
      saveResults([...results, result]);
      const newTotalScore = user.score + finalScore;
      const pct = finalScore / exercises.length;
      let newLevel = user.level;
      if (pct >= 0.8 && user.level < 4) newLevel = user.level + 1;
      updateUser({ ...user, score: newTotalScore, level: newLevel });
      setMode("finished");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswer("");
    setFeedback(null);
    setScore(0);
    setMode("quiz");
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

  if (exercises.length === 0) {
    return wrapWithLayout(
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">📝</span>
        <h1 className="text-2xl font-display font-bold text-foreground">
          No exercises available
        </h1>
        <p className="text-muted-foreground mt-2">
          Ask your teacher to add exercises!
        </p>
      </div>,
    );
  }

  // List view with overview button
  if (mode === "list") {
    return wrapWithLayout(
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <span className="text-6xl block mb-4 animate-float">✏️</span>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Exercises
        </h1>
        <p className="text-muted-foreground mb-8">
          {exercises.length} exercises available for your level
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setMode("overview")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-primary text-primary font-display font-semibold hover:bg-primary/10 transition-all"
          >
            <Eye size={20} /> Overview
          </button>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setAnswer("");
              setFeedback(null);
              setMode("quiz");
            }}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl gradient-hero text-primary-foreground font-display font-semibold shadow-fun hover:shadow-hover transition-all"
          >
            <ArrowRight size={20} /> Start
          </button>
        </div>
      </div>,
    );
  }

  if (mode === "overview") {
    return wrapWithLayout(
      <ExerciseOverview
        exercises={exercises}
        onStart={() => {
          setCurrentIndex(0);
          setScore(0);
          setAnswer("");
          setFeedback(null);
          setMode("quiz");
        }}
        onBack={() => setMode("list")}
      />,
    );
  }

  if (mode === "finished") {
    const pct = Math.round((score / exercises.length) * 100);
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
        <p className="text-xl text-muted-foreground mb-6">
          You scored{" "}
          <span className="font-bold text-primary">
            {score}/{exercises.length}
          </span>{" "}
          ({pct}%)
        </p>
        {pct >= 80 && user.level <= 4 && (
          <p className="text-accent font-display font-semibold mb-6 animate-wiggle">
            🎉 Level Up!
          </p>
        )}
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 mx-auto px-8 py-3 rounded-2xl gradient-hero text-primary-foreground font-display font-semibold shadow-fun hover:shadow-hover transition-all"
        >
          <RotateCcw size={20} /> Try Again
        </button>
      </div>,
    );
  }

  // Quiz mode
  return wrapWithLayout(
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Question {currentIndex + 1} of {exercises.length}
          </span>
          <span className="font-bold text-primary">{score} pts</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-hero rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / exercises.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <FunCard className="animate-pop" hover={false}>
        <div className="text-center py-4">
          <span className="text-5xl block mb-6 animate-float">🤔</span>
          {current.questionType === "image" ? (
            <img
              src={current.question}
              alt="Question"
              className="max-h-48 mx-auto rounded-xl mb-6 object-contain"
            />
          ) : (
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">
              {current.question}
            </h2>
          )}

          {current.answerType === "image" ? (
            <p className="text-sm text-muted-foreground mb-4">
              Type the image description or URL as answer
            </p>
          ) : null}

          <div className="max-w-xs mx-auto">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (feedback ? handleNext() : handleCheck())
              }
              disabled={!!feedback}
              className="w-full px-6 py-4 rounded-2xl border-2 border-input bg-background text-foreground text-center text-2xl font-display font-bold focus:ring-4 focus:ring-ring/30 focus:border-primary outline-none transition-all"
              placeholder="Your answer"
              autoFocus
            />
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
                    <X size={24} /> Wrong! Answer:{" "}
                    {current.answerType === "image" ? (
                      <img
                        src={current.answer}
                        alt="answer"
                        className="inline-block h-10 rounded object-contain bg-muted ml-2"
                      />
                    ) : (
                      current.answer
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            {!feedback ? (
              <button
                onClick={handleCheck}
                disabled={!answer.trim()}
                className="px-10 py-3.5 rounded-2xl gradient-hero text-primary-foreground font-display font-semibold text-lg shadow-fun hover:shadow-hover transition-all disabled:opacity-50"
              >
                Check Answer ✅
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 mx-auto px-10 py-3.5 rounded-2xl gradient-fun text-secondary-foreground font-display font-semibold text-lg shadow-fun hover:shadow-hover transition-all"
              >
                {currentIndex + 1 >= exercises.length ? (
                  <>
                    <Trophy size={20} /> See Results
                  </>
                ) : (
                  <>
                    <ArrowRight size={20} /> Next Question
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
