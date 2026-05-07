import { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getUsers,
  saveUsers,
  generateTeacherCode,
} from "@/lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    if (u) setUser(u);
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const users = getUsers();
    const found = users.find(
      (u) => u.username === username && u.password === password,
    );
    if (!found)
      return { success: false, message: "Invalid username or password" };
    setCurrentUser(found);
    setUser(found);
    return { success: true, user: found };
  };

  const register = (username, password, role, teacherCode) => {
    const users = getUsers();
    if (users.find((u) => u.username === username)) {
      return { success: false, message: "Username already exists" };
    }
    if (role === "student") {
      const validTeacher = users.find(
        (u) => u.role === "teacher" && u.teacherCode === teacherCode,
      );
      if (!validTeacher && teacherCode !== "DEFAULT") {
        return { success: false, message: "Invalid teacher code" };
      }
    }
    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      role,
      teacherCode: role === "teacher" ? generateTeacherCode() : teacherCode,
      level: role === "student" ? 1 : 0,
      score: 0,
    };
    saveUsers([...users, newUser]);
    setCurrentUser(newUser);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === updatedUser.id);
    if (idx !== -1) users[idx] = updatedUser;
    saveUsers(users);
    setCurrentUser(updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
