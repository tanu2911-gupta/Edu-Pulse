import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaCalendar,
  FaTable,
  FaChartBar,
  FaTicketAlt,
  FaTachometerAlt,
  FaTimes,
  FaBook,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const Sidebar = ({ isOpen, onClose, active, setActive }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const items = [
    { label: "Dashboard", icon: <FaTachometerAlt />, tab: "dashboard" },
    { label: "Attendance", icon: <FaCalendar />, tab: "attendance" },
    { label: "Internal", icon: <FaTable />, tab: "internals" },
    { label: "Assignments", icon: <FaBook />, tab: "assignments" },
    { label: "Graphs", icon: <FaChartBar />, tab: "graphs" },
    { label: "Results", icon: <FaTicketAlt />, tab: "results" },
    { label: "User Profile", icon: <FaUser />, tab: "profile" },
  ];

  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg dark:shadow-none z-50
        transform transition-transform duration-200
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
        <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400">
          OPTIONS 
        </h2>
        <button
          onClick={onClose}
          className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 md:hidden"
          aria-label="Close menu"
        >
          <FaTimes />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.tab}
            onClick={() => {
              setActive(item.tab);
              onClose?.();
            }}
            className={`flex items-center w-full px-4 py-2 rounded-md text-left transition
              ${
                active === item.tab
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-purple-100 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-800">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
        >
          {theme === "light" ? (
            <>
              <FaMoon /> <span>Dark Mode</span>
            </>
          ) : (
            <>
              <FaSun /> <span>Light Mode</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
