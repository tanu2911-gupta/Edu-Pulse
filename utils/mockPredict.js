// src/utils/predictor.js

/* ------------------------- Constants / Config ------------------------- */
export const PASS_THRESHOLD = 65; // tweak in one place
export const DEFAULT_WEIGHTS = {
  marks: 3.2,
  attendance: 1.8,
  assignments: 0.9,
  bias: -2.2,
};

/* ------------------------------- Helpers ------------------------------ */
const sigmoid = (z) => 1 / (1 + Math.exp(-z));
const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100));

/**
 * Optional: for explainability (how much each metric contributed)
 */
export const getContributions = ({ m, a, as, weights = DEFAULT_WEIGHTS }) => {
  const w = weights;
  const z = w.marks * m + w.attendance * a + w.assignments * as + w.bias;
  return {
    z,
    marksContrib: w.marks * m,
    attendanceContrib: w.attendance * a,
    assignmentsContrib: w.assignments * as,
    bias: w.bias,
  };
};

/* ----------------------------- Core Predict --------------------------- */
export const predictPassProbability = ({
  marksPct,
  attendancePct,
  assignPct,
  weights = DEFAULT_WEIGHTS,
}) => {
  const m = marksPct / 100;
  const a = attendancePct / 100;
  const as = assignPct / 100;

  const { z } = getContributions({ m, a, as, weights });
  return Math.round(sigmoid(z) * 100);
};

/* --------------------------- Topics & Reasons ------------------------- */
const SUBJECT_TOPICS = {
  DBMS: [
    "ER Models",
    "Normalization",
    "Transactions & Concurrency",
    "SQL Joins",
    "Indexing",
  ],
  "Operating Systems": [
    "Process Scheduling",
    "Deadlocks",
    "Memory Management",
    "File Systems",
  ],
  Maths: ["Linear Algebra", "Probability", "Calculus", "Number Theory"],
  Python: ["OOP", "Pandas", "File Handling", "Flask", "Exceptions"],
  IoT: ["Sensors & Actuators", "ESP32 Basics", "MQTT/HTTP", "Edge vs Cloud"],
};

export const getRecommendations = ({
  subject,
  marksPct,
  attendancePct,
  assignPct,
}) => {
  const reasons = [];
  if (marksPct < 50) reasons.push("Low internal marks");
  if (attendancePct < 75) reasons.push("Low attendance");
  if (assignPct < 70) reasons.push("Low assignment completion");

  const topics =
    SUBJECT_TOPICS[subject] || ["Revise core concepts", "Practice previous papers"];
  return { reasons, topics: topics.slice(0, 2) };
};

/* --------------------- Build Predictions per Subject ------------------ */
export const buildSubjectPredictions = ({
  internalMarks,
  attendance,
  assignmentsCompletedPct,
  threshold = PASS_THRESHOLD,
  weights = DEFAULT_WEIGHTS,
}) => {
  return internalMarks.map((m) => {
    const subject = m.subject;

    const att = attendance.find((a) => a.subject === subject);
    const totalCond =
      (att?.theory?.conducted || 0) + (att?.practical?.conducted || 0);
    const totalAtt =
      (att?.theory?.attended || 0) + (att?.practical?.attended || 0);
    const attendancePct = pct(totalAtt, totalCond);

    const marksPct = Math.round((m.scored / m.outOf) * 100);
    const assignPct = assignmentsCompletedPct; // using global assignment % for now

    const passProb = predictPassProbability({
      marksPct,
      attendancePct,
      assignPct,
      weights,
    });

    const prediction = passProb >= threshold ? "Pass" : "Fail";

    const { reasons, topics } =
      prediction === "Fail"
        ? getRecommendations({ subject, marksPct, attendancePct, assignPct })
        : { reasons: [], topics: [] };

    return {
      subject,
      marksPct,
      attendancePct,
      assignPct,
      passProb,
      prediction,
      reasons,
      topics,
    };
  });
};
