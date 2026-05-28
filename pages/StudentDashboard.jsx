import React, { useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AttendanceCard from "../components/AttendanceCard";
import ActivityFeed from "../components/ActivityFeed";
import InternalMarks from "../components/InternalMarks";
import AssignmentUpdates from "../components/AssignmentUpdates";
import ResultsAI from "../components/ResultsAI";
import GraphsView from "../components/GraphsView";
import UserProfile from "../components/UserProfile";

const StudentDashboard = ({ activeTab = "dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔁 NEW: Fetch student from localStorage
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("student");
    if (!data) {
      navigate("/"); // Not logged in → go back to login
    } else {
      setStudent(JSON.parse(data));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  // 🔁 Pass student data to your components via props if needed
  const content = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return <ActivityFeed student={student} />;
      case "attendance":
        return <AttendanceCard student={student} />;
      case "internals":
        return <InternalMarks student={student} />;
      case "assignments":
        return <AssignmentUpdates student={student} />;
      case "results":
        return <ResultsAI student={student} />;
      case "profile":
        return <UserProfile student={student} />;
      case "graphs":
        return <GraphsView student={student} />;
      default:
        return (
          <div className="p-6 bg-white rounded-xl shadow text-gray-600">
            This section is coming soon.
          </div>
        );
    }
  }, [activeTab, student]);

  if (!student) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex justify-center items-center flex-col text-center w-full">
          <h1 className="text-3xl font-bold text-purple-700">{student.Name}</h1>
          <p className="text-sm text-gray-600">Roll No: {student.StudentID}</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">{content}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;
