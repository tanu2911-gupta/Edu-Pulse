import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// --------- Dummy Academic Data (same style as your other components) ----------
const internalMarks = [
  { subject: "SPM", outOf: 50, scored: 42 },
  { subject: " IOT ", outOf: 50, scored: 38 },
  { subject: "AI", outOf: 50, scored: 35 },
  { subject: "AWD", outOf: 50, scored: 45 },
  { subject: "ET", outOf: 50, scored: 40 },
];

const attendance = [
  {
    subject: "SPM",
    theory: { conducted: 42, attended: 34 },
    practical: { conducted: 18, attended: 16 },
  },
  {
    subject: "IOT",
    theory: { conducted: 40, attended: 36 },
    practical: { conducted: 20, attended: 14 },
  },
  {
    subject: "AI",
    theory: { conducted: 38, attended: 31 },
    practical: { conducted: 0, attended: 0 },
  },
  {
    subject: "AWD",
    theory: { conducted: 32, attended: 26 },
    practical: { conducted: 16, attended: 15 },
  },
  {
    subject: "ET",
    theory: { conducted: 30, attended: 24 },
    practical: { conducted: 12, attended: 10 },
  },
];

// Assignments are already saved in localStorage by your AssignmentUpdates.jsx
const getAssignmentsFromLS = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("assignments"));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
};

// ----------------- Helper funcs -----------------
const pct = (attended, conducted) =>
  conducted === 0 ? 0 : Math.round((attended / conducted) * 100);

const sigmoid = (z) => 1 / (1 + Math.exp(-z));

// very simple “ML” style weighted score -> probability
const mlPredictPassProb = ({ marksPct, attendancePct, assignPct }) => {
  const m = marksPct / 100;
  const a = attendancePct / 100;
  const as = assignPct / 100;
  const z = 3.0 * m + 1.8 * a + 0.9 * as - 2.0; // tweakable
  return Math.round(sigmoid(z) * 100); // %
};

const GraphsView = () => {
  const assignments = getAssignmentsFromLS();

  const {
    marksBarData,
    attBarData,
    radarData,
    overallPerf,
    assignPieData,
  } = useMemo(() => {
    // Marks %
    const marksBarData = internalMarks.map((m) => ({
      subject: m.subject,
      percent: Math.round((m.scored / m.outOf) * 100),
    }));

    // Attendance %
    const attBarData = attendance.map((s) => {
      const totalCond = s.theory.conducted + s.practical.conducted;
      const totalAtt = s.theory.attended + s.practical.attended;
      const percent = pct(totalAtt, totalCond);
      return {
        subject: s.subject,
        percent,
      };
    });

    // Assignments completed %
    const total = assignments.length || 1;
    const completed = assignments.filter((a) => a.status === "Completed").length;
    const assignPct = Math.round((completed / total) * 100);

    const assignPieData = [
      { name: "Completed", value: completed },
      { name: "Pending", value: total - completed },
    ];

    // Radar Data (combine per subject)
    // For assignments per subject -> rough equal weight (or 100 if any completed), we will use global assign% for each subject
    const bySubject = {};
    marksBarData.forEach((m) => (bySubject[m.subject] = { marksPct: m.percent }));
    attBarData.forEach((a) => {
      if (!bySubject[a.subject]) bySubject[a.subject] = {};
      bySubject[a.subject].attendancePct = a.percent;
    });

    const radarData = Object.keys(bySubject).map((sub) => {
      const marksPct = bySubject[sub].marksPct || 0;
      const attendancePct = bySubject[sub].attendancePct || 0;

      // Assign same assignPct to all subjects (since we didn't split per subject in LS)
      const perf = mlPredictPassProb({
        marksPct,
        attendancePct,
        assignPct,
      });

      return {
        subject: sub,
        Marks: marksPct,
        Attendance: attendancePct,
        Performance: perf,
      };
    });

    // Overall performance
    const avgMarks = Math.round(
      marksBarData.reduce((a, b) => a + b.percent, 0) / marksBarData.length
    );
    const avgAttendance = Math.round(
      attBarData.reduce((a, b) => a + b.percent, 0) / attBarData.length
    );

    const overallPerf = mlPredictPassProb({
      marksPct: avgMarks,
      attendancePct: avgAttendance,
      assignPct,
    });

    return {
      marksBarData,
      attBarData,
      radarData,
      overallPerf,
      assignPieData,
    };
  }, [assignments]);

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <section className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">
          Overall Performance
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Based on: Marks (60%), Attendance (30%), Assignments (10%)
        </p>
        <div className="text-4xl font-bold text-purple-700">
          {overallPerf}%
        </div>
        <p className="text-gray-500 mt-2">
          {overallPerf >= 75
            ? "Looking good! High chance of passing."
            : overallPerf >= 60
            ? "Borderline. Improve marks/attendance/assignments."
            : "At risk. Focus on improving across metrics."}
        </p>
      </div>

      {/* Marks Bar */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-green-600 mb-4">
          Internal Marks (%)
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marksBarData}>
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percent" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Bar */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">
          Attendance (%)
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attBarData}>
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percent" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assignments Pie */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-pink-600 mb-4">
          Assignments (Completed vs Pending)
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assignPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {assignPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-purple-600 mb-4">
          Subject-wise Performance Radar
        </h2>
        <div className="h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Marks"
                dataKey="Marks"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.4}
              />
              <Radar
                name="Attendance"
                dataKey="Attendance"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              <Radar
                name="Performance"
                dataKey="Performance"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default GraphsView;
