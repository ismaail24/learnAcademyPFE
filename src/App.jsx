import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { initializeStorage } from "@/lib/storage";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherExercises from "./pages/teacher/TeacherExercises";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherResults from "./pages/teacher/TeacherResults";
import TeacherAnnouncements from "./pages/teacher/TeacherAnnouncements";
import TeacherQuizzes from "./pages/teacher/TeacherQuizzes";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentExercises from "./pages/student/StudentExercises";
import StudentCourses from "./pages/student/StudentCourses";
import StudentResults from "./pages/student/StudentResults";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import StudentQuizzes from "./pages/student/StudentQuizzes";
import NotFound from "./pages/NotFound";

// Initialize localStorage with default data
initializeStorage();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Teacher routes */}
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/exercises"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherExercises />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/quizzes"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherQuizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/announcements"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherAnnouncements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/students"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/results"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherResults />
                </ProtectedRoute>
              }
            />

            {/* Student routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/exercises"
              element={
                <ProtectedRoute role="student">
                  <StudentExercises />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute role="student">
                  <StudentCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/quizzes"
              element={
                <ProtectedRoute role="student">
                  <StudentQuizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/announcements"
              element={
                <ProtectedRoute role="student">
                  <StudentAnnouncements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/results"
              element={
                <ProtectedRoute role="student">
                  <StudentResults />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
