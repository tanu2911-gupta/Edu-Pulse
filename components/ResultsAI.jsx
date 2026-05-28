import React, { useMemo } from "react";
import {
  buildSubjectPredictions,
  predictPassProbability,
} from "../utils/mockPredict";

const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100));

// Adjusted mock data (2 subjects will fail)
const internalMarks = [
  { subject: "DBMS", outOf: 50, scored: 20 }, // Low marks
  { subject: "Operating Systems", outOf: 50, scored: 18 }, // Low marks
  { subject: "Maths", outOf: 50, scored: 35 },
  { subject: "Python", outOf: 50, scored: 45 },
  { subject: "IoT", outOf: 50, scored: 40 },
];

const attendance = [
  {
    subject: "DBMS",
    theory: { conducted: 42, attended: 20 }, // Low attendance
    practical: { conducted: 18, attended: 8 },
  },
  {
    subject: "Operating Systems",
    theory: { conducted: 40, attended: 18 }, // Low attendance
    practical: { conducted: 20, attended: 8 },
  },
  {
    subject: "Maths",
    theory: { conducted: 38, attended: 31 },
    practical: { conducted: 0, attended: 0 },
  },
  {
    subject: "Python",
    theory: { conducted: 32, attended: 26 },
    practical: { conducted: 16, attended: 15 },
  },
  {
    subject: "IoT",
    theory: { conducted: 30, attended: 24 },
    practical: { conducted: 12, attended: 10 },
  },
];

const getAssignmentsFromLS = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("assignments"));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const ResultsAI = () => {
  const { subjectResults, overallPassProb, completed, totalAssignments } =
    useMemo(() => {
      const assignments = getAssignmentsFromLS();
      const totalAssignments = assignments.length || 1;
      const completed = assignments.filter(
        (a) => a.status === "Completed"
      ).length;
      const assignmentsCompletedPct = Math.round(
        (completed / totalAssignments) * 100
      );

      const avgMarksPct = Math.round(
        internalMarks.reduce(
          (acc, m) => acc + (m.scored / m.outOf) * 100,
          0
        ) / internalMarks.length
      );

      const attPcts = attendance.map((s) => {
        const c =
          (s.theory?.conducted || 0) + (s.practical?.conducted || 0);
        const a =
          (s.theory?.attended || 0) + (s.practical?.attended || 0);
        return pct(a, c);
      });
      const avgAttendancePct = Math.round(
        attPcts.reduce((a, b) => a + b, 0) / attPcts.length
      );

      const overallPassProb = predictPassProbability({
        marksPct: avgMarksPct,
        attendancePct: avgAttendancePct,
        assignPct: assignmentsCompletedPct,
      });

      const subjectResults = buildSubjectPredictions({
        internalMarks,
        attendance,
        assignmentsCompletedPct,
      });

      return {
        subjectResults,
        overallPassProb,
        completed,
        totalAssignments,
      };
    }, []);

  const atRisk = subjectResults.filter((s) => s.prediction === "Fail");

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <h2 className="text-2xl font-bold text-purple-700">
           Results
        </h2>

        {/* Overall */}
        <div className="bg-purple-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">
            Overall probability of passing the semester:
          </p>
          <p className="text-3xl font-extrabold text-purple-700">
            {overallPassProb}%
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Based on internal marks, attendance and assignment completion (
            {completed}/{totalAssignments}).
          </p>
        </div>

        {/* Subject-wise */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Subject-wise prediction
          </h3>

          {subjectResults.map((s, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 border ${
                s.prediction === "Pass"
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold flex items-center gap-2">
                  {s.prediction === "Pass" ? "✅" : "🚩"} {s.subject}
                </h4>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    s.prediction === "Pass"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {s.prediction} ({s.passProb}%)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700 mb-2">
                <p>
                  Marks: <span className="font-semibold">{s.marksPct}%</span>
                </p>
                <p>
                  Attendance:{" "}
                  <span className="font-semibold">{s.attendancePct}%</span>
                </p>
                <p>
                  Assignments:{" "}
                  <span className="font-semibold">{s.assignPct}%</span>
                </p>
              </div>

              {s.prediction === "Fail" && (
                <div className="mt-3 text-sm">
                  {s.reasons.length > 0 && (
                    <>
                      <p className="font-semibold text-red-700">
                        Why at risk:
                      </p>
                      <ul className="list-disc list-inside text-red-700">
                        {s.reasons.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {s.topics.length > 0 && (
                    <>
                      <p className="font-semibold mt-2 text-gray-800">
                        Recommended topics to study:
                      </p>
                      <ul className="list-disc list-inside">
                        {s.topics.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-100 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800">Summary</h4>
          {atRisk.length === 0 ? (
            <p className="text-green-700">
              Great! You are on track to pass all subjects.
            </p>
          ) : (
            <>
              <p className="text-red-700">
                You are at risk in <b>{atRisk.length}</b>{" "}
                subject{atRisk.length > 1 ? "s" : ""}. Focus on them:
              </p>
              <ul className="list-disc list-inside text-red-700">
                {atRisk.map((s, idx) => (
                  <li key={idx}>
                    {s.subject} ({s.passProb}%)
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResultsAI;
