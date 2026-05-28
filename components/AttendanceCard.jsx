import React, { useEffect, useState } from "react";
import axios from "axios";

const getColor = (p) =>
  p >= 75 ? "bg-green-500" : p >= 60 ? "bg-yellow-500" : "bg-red-500";

const Progress = ({ percent }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className={`${getColor(percent)} h-2 rounded-full`}
      style={{ width: `${percent}%` }}
    />
  </div>
);

const pct = (attended, conducted) =>
  conducted === 0 ? 0 : Math.round((attended / conducted) * 100);

const AttendanceCard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [aggregate, setAggregate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const studentID = localStorage.getItem("roll");
        const res = await axios.get(`http://127.0.0.1:5000/attendance/${studentID}`);
        console.log("Raw data from backend:", res.data);
        const data = res.data.attendance;

        const enriched = data.map((item) => {
          const theoryPct = pct(item.theory.attended, item.theory.conducted);
          const pracPct = pct(item.practical.attended, item.practical.conducted);

          const totalAttended = item.theory.attended + item.practical.attended;
          const totalConducted = item.theory.conducted + item.practical.conducted;
          const overallPct = pct(totalAttended, totalConducted);

          return {
            ...item,
            theoryPct,
            pracPct,
            overallPct,
            totalAttended,
            totalConducted,
          };
        });

        setAttendanceData(enriched);

        // Calculate aggregate
        const totalC = enriched.reduce((a, r) => a + r.totalConducted, 0);
        const totalA = enriched.reduce((a, r) => a + r.totalAttended, 0);
        setAggregate(pct(totalA, totalC));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-purple-600 py-10">Loading attendance...</div>
    );
  }

  return (
    <section className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          Attendance (Subject-wise)
        </h2>

        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 text-xs uppercase text-gray-500 mb-2">
          <span className="col-span-3">Subject</span>
          <span className="col-span-3">Theory (Att/Cond)</span>
          <span className="col-span-3">Practical (Att/Cond)</span>
          <span className="col-span-3 text-right">Overall %</span>
        </div>

        <div className="space-y-4">
          {attendanceData.map((r, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg p-4 md:grid md:grid-cols-12 md:items-center gap-3"
            >
              {/* Subject */}
              <div className="md:col-span-3 mb-2 md:mb-0">
                <p className="font-semibold text-gray-800">{r.subject}</p>
              </div>

              {/* Theory */}
              <div className="md:col-span-3 mb-2 md:mb-0">
                <p className="text-sm text-gray-600">
                  Theory:{" "}
                  <span className="font-medium">
                    {r.theory.attended}/{r.theory.conducted}
                  </span>{" "}
                  ({r.theoryPct}%)
                </p>
                <Progress percent={r.theoryPct} />
              </div>

              {/* Practical */}
              <div className="md:col-span-3 mb-2 md:mb-0">
                {r.practical.conducted > 0 ? (
                  <>
                    <p className="text-sm text-gray-600">
                      Practical:{" "}
                      <span className="font-medium">
                        {r.practical.attended}/{r.practical.conducted}
                      </span>{" "}
                      ({r.pracPct}%)
                    </p>
                    <Progress percent={r.pracPct} />
                  </>
                ) : (
                  <p className="text-sm text-gray-400 italic">No practicals</p>
                )}
              </div>

              {/* Overall */}
              <div className="md:col-span-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall</span>
                  <span
                    className={`text-sm font-bold ${r.overallPct >= 75
                      ? "text-green-600"
                      : r.overallPct >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                      }`}
                  >
                    {r.overallPct}%
                  </span>
                </div>
                <Progress percent={r.overallPct} />
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Aggregate Attendance
            </span>
            <span
              className={`text-lg font-bold ${aggregate >= 75
                ? "text-green-600"
                : aggregate >= 60
                ? "text-yellow-600"
                : "text-red-600"
                }`}
            >
              {aggregate}%
            </span>
          </div>
          <Progress percent={aggregate} />
        </div>
      </div>
    </section>
  );
};

export default AttendanceCard;
