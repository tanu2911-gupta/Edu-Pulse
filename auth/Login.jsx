import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // ✅ Add this
import loginImg from "../assets/login-illustration.png";

export default function Login() {
  const [role, setRole] = useState("Student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    if (role === "Student") {
      try {
        const res = await axios.post("http://localhost:5000/login", {
          student_id: username,
          password: password,
        });

        if (res.data.status === "success") {
          // Store student data
          localStorage.setItem("roll", res.data.student.StudentID);
          localStorage.setItem("role", "student");
          localStorage.setItem("student", JSON.stringify(res.data.student));
          navigate("/student");
        } else {
          setError("Invalid ID or Password");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to connect to server");
      }
    } else if (role === "Teacher") {
      alert("Teacher dashboard not implemented yet");
    } else if (role === "Admin") {
      alert("Admin dashboard not implemented yet");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-purple-300">
      <div className="flex flex-col md:flex-row shadow-lg rounded-2xl overflow-hidden max-w-4xl w-full">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-10">
          <h2 className="text-3xl font-bold text-purple-700 mb-2">Login</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your account details
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option>Student</option>
                <option>Teacher</option>
                <option>Admin</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-sm text-purple-700 hover:underline cursor-pointer">
              Forgot Password?
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <span className="text-purple-600 hover:underline cursor-pointer">
              Sign up
            </span>
          </p>
        </div>

        {/* Right: Illustration */}
        <div className="hidden md:flex w-full md:w-1/2 bg-purple-500 items-center justify-center">
          <div className="text-center text-white p-6">
            <h2 className="text-2xl font-bold mb-2">Welcome to</h2>
            <h1 className="text-3xl font-bold mb-4">Edupulse</h1>
            <p className="text-sm text-purple-100 mb-4">
              Login to access your account
            </p>
            <img
              src={loginImg}
              alt="login visual"
              className="w-64 h-64 object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
