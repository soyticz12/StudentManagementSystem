// =====================================
// src/App.tsx
// =====================================
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import StudentDashboard from "./Pages/Dashboard";
import { CoursesPage } from "./Pages/Courses";
import { ModulesPage } from "./Pages/Modules";
import { ClassmatesPage } from "./Pages/Classmates";
import { ProfilePage } from "./Pages/Profile";
import LoginPage from "./Pages/Login"; 
import AssignmentPage from "./Pages/Assignment";

// (Optional) very simple professor dashboard stub.
// Replace with your real page when ready.
function ProfessorDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Professor Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        This is a placeholder. Build your professor view here.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />

          {/* Student area */}
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Courses / Modules */}
          <Route path="/courses" element={<CoursesPage />} />
          {/* Matches navigate(`/courses/${code}/modules`) */}
          <Route path="/courses/:code/modules" element={<ModulesPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/modules/completed" element={<ModulesPage />} />

          {/* Social */}
          <Route path="/classmates" element={<ClassmatesPage />} />

          {/* Assignment */}
          <Route path="/assignments/:assignmentId" element={<AssignmentPage />} />

          {/* Professor area */}
          <Route path="/professor" element={<ProfessorDashboard />} />

          {/* (Optional) 404 fallback */}
          {/* <Route path="*" element={<div className="p-6">Page not found</div>} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
