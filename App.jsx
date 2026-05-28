import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import Login from "./auth/Login";
import Sidebar from "./components/Sidebar";
import StudentDashboard from "./pages/StudentDashboard";

/* --------------- Route Guard --------------- */
const ProtectedStudentRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("role") === "student";
  const studentData = localStorage.getItem("student");

  // 🔐 Only allow access if role is "student" AND student data is present
  return isLoggedIn && studentData
    ? children
    : <Navigate to="/" replace state={{ from: location }} />;
};

/* --------------- Student Layout Shell --------------- */
const StudentShell = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen relative bg-gray-50">
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen((p) => !p)}
        className="fixed top-4 left-4 z-50 bg-white shadow p-2 rounded-md"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Dark overlay on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        active={activeTab}
        setActive={setActiveTab}
      />

      <main
        className={`flex-1 p-6 transition-all duration-200 ${
          isSidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        {/* ✅ Dashboard receives activeTab (and gets student from localStorage inside) */}
        <StudentDashboard activeTab={activeTab} />
      </main>
    </div>
  );
};

/* --------------- App Entry --------------- */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/student"
          element={
            <ProtectedStudentRoute>
              <StudentShell />
            </ProtectedStudentRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
