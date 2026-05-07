export function initializeStorage() {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
  }
  if (!localStorage.getItem("exercises")) {
    localStorage.setItem("exercises", JSON.stringify([]));
  }
  if (!localStorage.getItem("results")) {
    localStorage.setItem("results", JSON.stringify([]));
  }
  if (!localStorage.getItem("courses")) {
    localStorage.setItem("courses", JSON.stringify([]));
  }
  if (!localStorage.getItem("announcements")) {
    localStorage.setItem("announcements", JSON.stringify([]));
  }
  if (!localStorage.getItem("quizzes")) {
    localStorage.setItem("quizzes", JSON.stringify([]));
  }
  if (!localStorage.getItem("quizResults")) {
    localStorage.setItem("quizResults", JSON.stringify([]));
  }
}

// Le reste des fonctions reste identique...
export function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

export function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getCurrentUser() {
  const u = localStorage.getItem("currentUser");
  return u ? JSON.parse(u) : null;
}

export function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

export function getExercises() {
  return JSON.parse(localStorage.getItem("exercises") || "[]");
}

export function saveExercises(exercises) {
  localStorage.setItem("exercises", JSON.stringify(exercises));
}

export function getCourses() {
  return JSON.parse(localStorage.getItem("courses") || "[]");
}

export function saveCourses(courses) {
  localStorage.setItem("courses", JSON.stringify(courses));
}

export function getResults() {
  return JSON.parse(localStorage.getItem("results") || "[]");
}

export function saveResults(results) {
  localStorage.setItem("results", JSON.stringify(results));
}

export function generateTeacherCode() {
  return "TC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function getLevelName(level) {
  const names = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
    4: "Expert",
  };
  return names[level] || "Unknown";
}

export function getLevelColor(level) {
  const colors = {
    1: "from-primary to-fun-purple",
    2: "from-secondary to-fun-pink",
    3: "from-accent to-fun-teal",
    4: "from-fun-purple to-fun-pink",
  };
  return colors[level] || "from-primary to-fun-purple";
}

export function getAnnouncements() {
  return JSON.parse(localStorage.getItem("announcements") || "[]");
}

export function saveAnnouncements(announcements) {
  localStorage.setItem("announcements", JSON.stringify(announcements));
}

export function getQuizzes() {
  return JSON.parse(localStorage.getItem("quizzes") || "[]");
}

export function saveQuizzes(quizzes) {
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
}

export function getQuizResults() {
  return JSON.parse(localStorage.getItem("quizResults") || "[]");
}

export function saveQuizResults(results) {
  localStorage.setItem("quizResults", JSON.stringify(results));
}
