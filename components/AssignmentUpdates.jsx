import React, { useEffect, useMemo, useState } from "react";

const INITIAL_ASSIGNMENTS = [
  { id: 1, subject: "DBMS", title: "ER Diagram Design", due: "2025-08-05", status: "Pending" },
  { id: 2, subject: "Operating Systems", title: "Deadlock Case Study", due: "2025-08-07", status: "Pending" },
  { id: 3, subject: "Maths", title: "Linear Algebra Worksheet", due: "2025-08-09", status: "Completed" },
  { id: 4, subject: "Python", title: "Data Analysis Project", due: "2025-08-10", status: "Pending" },
  { id: 5, subject: "IoT", title: "Sensor Data Logger", due: "2025-08-12", status: "Completed" },
  { id: 6, subject: "DBMS", title: "SQL Queries Assignment", due: "2025-08-15", status: "Pending" },
  { id: 7, subject: "Operating Systems", title: "Scheduling Algorithm Report", due: "2025-08-17", status: "Completed" },
  { id: 8, subject: "Python", title: "Flask Mini Project", due: "2025-08-20", status: "Pending" },
  { id: 9, subject: "Maths", title: "Probability Problems Set", due: "2025-08-22", status: "Completed" },
  { id: 10, subject: "IoT", title: "ESP32 Setup Task", due: "2025-08-25", status: "Pending" },
];

const getColorByStatus = (s) =>
  s === "Completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600";

const AssignmentUpdates = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("assignments");
    setAssignments(saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS);
  }, []);

  const save = (data) => {
    setAssignments(data);
    localStorage.setItem("assignments", JSON.stringify(data));
  };

  const handleSubmit = (id, file) => {
    if (!file) return;
    const updated = assignments.map((a) =>
      a.id === id
        ? {
            ...a,
            status: "Completed",
            submittedOn: new Date().toISOString(),
            fileName: file.name,
          }
        : a
    );
    save(updated);
  };

  const stats = useMemo(() => {
    const total = assignments.length;
    const done = assignments.filter((a) => a.status === "Completed").length;
    const pending = total - done;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return { total, done, pending, percent };
  }, [assignments]);

  return (
    <section className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Assignments</h2>

        {/* Stats */}
        <div className="mb-6 bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between text-sm font-medium mb-2">
          <span>Total: {stats.total}</span>
          <span className="text-green-600">Completed: {stats.done}</span>
          <span className="text-red-600">Pending: {stats.pending}</span>
          <span>{stats.percent}% done</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {assignments.map((a) => {
            const overdue =
              a.status !== "Completed" && new Date(a.due) < new Date();

            return (
              <div
                key={a.id}
                className={`bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                  overdue ? "border border-red-200" : ""
                }`}
              >
                {/* left */}
                <div>
                  <p className="font-semibold text-gray-800">
                    {a.subject}: {a.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Due: {a.due}{" "}
                    {overdue && a.status !== "Completed" && (
                      <span className="text-red-500 font-semibold ml-1">
                        (Overdue)
                      </span>
                    )}
                  </p>

                  {a.status === "Completed" && (
                    <p className="text-xs text-green-600 mt-1">
                      Submitted on: {new Date(a.submittedOn).toLocaleString()}{" "}
                      {a.fileName && (
                        <span className="text-gray-700">
                          • File: <span className="font-medium">{a.fileName}</span>
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* right */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${getColorByStatus(
                      a.status
                    )}`}
                  >
                    {a.status}
                  </span>

                  {/* Only show upload when pending */}
                  {a.status === "Pending" && (
                    <>
                      <label
                        htmlFor={`upload-${a.id}`}
                        className="cursor-pointer text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Upload & Submit
                      </label>
                      <input
                        id={`upload-${a.id}`}
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => handleSubmit(a.id, e.target.files[0])}
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AssignmentUpdates;
