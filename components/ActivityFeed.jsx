import React from "react";

const ActivityFeed = () => {
  return (
    <section className="w-full flex justify-center">
      {/* Wide horizontally, tall vertically */}
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 min-h-[70vh]">
          <h2 className="text-lg font-semibold mb-4 text-purple-700 text-center">
            Activity
          </h2>

          <ul className="space-y-3 text-sm text-gray-700">
            <li className="p-3 rounded-md bg-purple-50">
              📢 Maths teacher uploaded a new assignment: “Trigonometry Basics”
            </li>
            <li className="p-3 rounded-md bg-purple-50">🧪 DBMS Assignment Updated</li>
            <li className="p-3 rounded-md bg-purple-50">
              📅 Mid-semester exam schedule released. Check exam section.
            </li>
            <li className="p-3 rounded-md bg-purple-50">
              📘 English teacher shared notes for “Macbeth - Act 2”
            </li>
            <li className="p-3 rounded-md bg-purple-50">
              🧑‍🏫 AI workshop on Monday at 11:00 AM in Seminar Hall.
            </li>
            <li className="p-3 rounded-md bg-purple-50">
              📂 Submit OOPS Assignment 3 by Thursday night.
            </li>
            <li className="p-3 rounded-md bg-purple-50">
              🔔 Library books return deadline extended till Friday.
            </li>
            <li className="p-3 rounded-md bg-purple-50">
              📝 Class test for DBMS on Tuesday. Portion: Units 1–3.
            </li>
            <li className="p-3 rounded-md bg-purple-50">
              💡 Hackathon registration open till 30th July.
            </li>
            <li className="p-3 rounded-md bg-purple-50">
              🎓 Guest lecture on Machine Learning on Saturday, 10:00 AM.
            </li>
            <li className="p-3 rounded-md bg-purple-50">
              🗓️ Python class cancelled on Friday due to seminar.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ActivityFeed;
