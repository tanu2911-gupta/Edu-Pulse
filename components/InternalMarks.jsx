import React, { useEffect, useState } from "react";
import axios from "axios";

const getColor = (p) =>
  p >= 75 ? "bg-green-500" : p >= 50 ? "bg-yellow-500" : "bg-red-500";

const Progress = ({ percent }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className={`${getColor(percent)} h-2 rounded-full`}
      style={{ width: `${percent}%` }}
    />
  </div>
);

const InternalMarks = () => {
  const [marksData, setMarksData] = useState([]);
  const [total, setTotal] = useState({ scored: 0, outOf: 0, percent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternals = async () => {
      try {
        const studentID = localStorage.getItem("roll");
        const res = await axios.get(`http://127.0.0.1:5000/internals/${studentID}`);
        const data = res.data.internals;

        const rows = data.map((m) => ({
          ...m,
          percent: Math.round((m.scored / m.outOf) * 100),
        }));

        const scoredSum = rows.reduce((a, r) => a + r.scored, 0);
        const outOfSum = rows.reduce((a, r) => a + r.outOf, 0);

        setMarksData(rows);
        setTotal({
          scored: scoredSum,
          outOf: outOfSum,
          percent: Math.round((scoredSum / outOfSum) * 100),
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch internal marks:", error);
        setLoading(false);
      }
    };

    fetchInternals();
  }, []);

  if (loading) {
    return <div className="text-center text-green-600 py-10">Loading internal marks...</div>;
  }

  return (
    <section className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-600">Internal Marks</h2>

        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 text-xs uppercase text-gray-500 mb-2">
          <span className="col-span-4">Subject</span>
          <span className="col-span-4">Marks (Scored/Out Of)</span>
          <span className="col-span-4 text-right">Percentage</span>
        </div>

        <div className="space-y-4">
          {marksData.map((r, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg p-4 md:grid md:grid-cols-12 md:items-center gap-3"
            >
              <div className="md:col-span-4 mb-2 md:mb-0">
                <p className="font-semibold text-gray-800">{r.subject}</p>
              </div>

              <div className="md:col-span-4 mb-2 md:mb-0">
                <p className="text-sm text-gray-600">
                  {r.scored}/{r.outOf} ({r.percent}%)
                </p>
                <Progress percent={r.percent} />
              </div>

              <div className="md:col-span-4 text-right">
                <span
                  className={`text-sm font-bold ${
                    r.percent >= 75
                      ? "text-green-600"
                      : r.percent >= 50
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {r.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Total */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Overall Total</span>
            <span
              className={`text-lg font-bold ${
                total.percent >= 75
                  ? "text-green-600"
                  : total.percent >= 50
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {total.scored}/{total.outOf} ({total.percent}%)
            </span>
          </div>
          <Progress percent={total.percent} />
        </div>
      </div>
    </section>
  );
};

export default InternalMarks;
