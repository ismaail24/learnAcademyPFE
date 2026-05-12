import { toast } from "sonner";
import {
  getCourses,
  getExercises,
  getQuizzes,
  getAnnouncements,
  getUsers,
  getResults,
  getQuizResults,
} from "./storage";

const SEEN_KEY = (uid, type) => `notif_seen:${uid}:${type}`;
const STORE_KEY = (uid) => `notif_store:${uid}`;
const MAX_STORED = 50;

function readSeen(uid, type) {
  try {
    return new Set(
      JSON.parse(localStorage.getItem(SEEN_KEY(uid, type)) || "[]"),
    );
  } catch {
    return new Set();
  }
}

function writeSeen(uid, type, set) {
  localStorage.setItem(SEEN_KEY(uid, type), JSON.stringify(Array.from(set)));
}

export function getNotifications(uid) {
  if (!uid) return [];
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY(uid)) || "[]");
  } catch {
    return [];
  }
}

export function saveNotifications(uid, list) {
  localStorage.setItem(
    STORE_KEY(uid),
    JSON.stringify(list.slice(0, MAX_STORED)),
  );
  window.dispatchEvent(
    new CustomEvent("notifications-updated", { detail: { uid } }),
  );
}

export function markAllRead(uid) {
  const list = getNotifications(uid).map((n) => ({ ...n, read: true }));
  saveNotifications(uid, list);
}

export function clearNotifications(uid) {
  saveNotifications(uid, []);
}

function pushNotification(uid, notif) {
  const list = getNotifications(uid);
  list.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: Date.now(),
    read: false,
    ...notif,
  });
  saveNotifications(uid, list);
}

function notify(uid, emoji, title, description) {
  toast(`${emoji} ${title}`, { description });
  pushNotification(uid, { emoji, title, description });
}

export function checkNotifications(user, { silentInit = false } = {}) {
  if (!user) return;

  if (user.role === "student") {
    const tc = user.teacherCode;

    const courses = getCourses().filter(
      (c) =>
        (c.teacherCode === tc || c.teacherCode === "DEFAULT") &&
        c.level <= user.level,
    );
    diffAndNotify(user.id, "courses", courses, silentInit, (c) =>
      notify(user.id, "📚", "New course available", c.title),
    );

    const exercises = getExercises().filter(
      (e) =>
        (e.teacherCode === tc || e.teacherCode === "DEFAULT") &&
        e.level <= user.level,
    );
    diffAndNotify(user.id, "exercises", exercises, silentInit, () =>
      notify(user.id, "✏️", "New exercise added", "Practice and earn points!"),
    );

    const quizzes = getQuizzes().filter(
      (q) => q.teacherCode === tc && q.level <= user.level,
    );
    diffAndNotify(user.id, "quizzes", quizzes, silentInit, (q) =>
      notify(user.id, "🧩", "New quiz available", q.title),
    );

    const announcements = getAnnouncements().filter(
      (a) => a.teacherCode === tc,
    );
    diffAndNotify(user.id, "announcements", announcements, silentInit, (a) =>
      notify(
        user.id,
        a.priority === "urgent"
          ? "🚨"
          : a.priority === "important"
            ? "⚠️"
            : "📢",
        a.title,
        a.content?.slice(0, 80),
      ),
    );
  }

  if (user.role === "teacher") {
    const tc = user.teacherCode;

    const students = getUsers().filter(
      (u) => u.role === "student" && u.teacherCode === tc,
    );
    diffAndNotify(user.id, "students", students, silentInit, (s) =>
      notify(user.id, "👋", "New student joined", s.username),
    );

    const usernames = new Set(students.map((s) => s.username));
    const results = getResults()
      .filter(
        (r) =>
          usernames.has(r.username) || students.some((s) => s.id === r.userId),
      )
      .map((r, i) => ({ ...r, id: r.id || `${r.userId}-${r.date || i}` }));
    diffAndNotify(user.id, "results", results, silentInit, (r) =>
      notify(
        user.id,
        "📊",
        "Exercise result submitted",
        `${r.username || "A student"} scored ${r.score}/${r.total}`,
      ),
    );

    const qResults = getQuizResults()
      .filter(
        (r) =>
          usernames.has(r.username) || students.some((s) => s.id === r.userId),
      )
      .map((r, i) => ({
        ...r,
        id: r.id || `${r.userId}-${r.quizId}-${r.date || i}`,
      }));
    diffAndNotify(user.id, "quizResults", qResults, silentInit, (r) =>
      notify(
        user.id,
        "🧩",
        "Quiz completed",
        `${r.username || "A student"}: ${r.quizTitle} ${r.score}/${r.total}`,
      ),
    );
  }
}

function diffAndNotify(uid, type, items, silentInit, fn) {
  const seen = readSeen(uid, type);
  const isFirstRun = localStorage.getItem(SEEN_KEY(uid, type)) === null;
  const newItems = items.filter((it) => !seen.has(it.id));

  if (isFirstRun || silentInit) {
    items.forEach((it) => seen.add(it.id));
    writeSeen(uid, type, seen);
    return;
  }

  newItems.slice(0, 5).forEach((it) => fn(it));
  newItems.forEach((it) => seen.add(it.id));
  writeSeen(uid, type, seen);
}
