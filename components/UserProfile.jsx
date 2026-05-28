import React, { useEffect, useState } from "react";

const STORAGE_KEY = "user_profile";

const defaultProfile = {
  name: localStorage.getItem("username") || "Student",
  roll: localStorage.getItem("roll") || "23302D0013",
  email: "student@example.com",
  phone: "9999999999",
  branch: "BSc IT",
  semester: "V",
  address: "Mumbai, India",
  avatar: "",

  attendance: 85,
  marks: 78,
  assignments: 65,
};

const UserProfile = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [backup, setBackup] = useState(defaultProfile);
  const [edit, setEdit] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setProfile((p) => ({ ...p, avatar: "" }));
  };

  const handleEdit = () => {
    setBackup(profile);
    setEdit(true);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setEdit(false);
    setToast("Profile saved successfully!");
    setTimeout(() => setToast(""), 2500);
  };

  const handleCancel = () => {
    setProfile(backup);
    setEdit(false);
  };

  return (
    <div className="relative max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
      {toast && (
        <div className="absolute top-3 right-3 bg-green-500 text-white text-sm px-3 py-1 rounded">
          {toast}
        </div>
      )}

      {/* Avatar & Name */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={
              profile.avatar ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-purple-300"
          />
          {edit && (
            <>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded cursor-pointer shadow"
              >
                Change
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatar}
              />
            </>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-purple-700">{profile.name}</h2>
          <p className="text-sm text-gray-500">Roll No: {profile.roll}</p>
          {edit && profile.avatar && (
            <button
              onClick={removeAvatar}
              className="mt-2 text-xs text-red-600 hover:underline"
            >
              Remove photo
            </button>
          )}
        </div>

        {!edit ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Academic Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold text-purple-600">Attendance</h3>
          <p className="text-2xl font-bold">{profile.attendance}%</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold text-purple-600">Marks</h3>
          <p className="text-2xl font-bold">{profile.marks}%</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold text-purple-600">Assignments</h3>
          <p className="text-2xl font-bold">{profile.assignments}%</p>
        </div>
      </div>

      {/* Personal Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Personal Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              disabled={!edit}
              value={profile.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                !edit ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Roll No</label>
            <input
              type="text"
              disabled
              value={profile.roll}
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              disabled={!edit}
              value={profile.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                !edit ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              disabled={!edit}
              value={profile.phone}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                !edit ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Branch</label>
            <input
              type="text"
              name="branch"
              disabled={!edit}
              value={profile.branch}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                !edit ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Semester</label>
            <input
              type="text"
              name="semester"
              disabled={!edit}
              value={profile.semester}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                !edit ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
          
            
          </div>
        </div>
      </div>
    
  );
};

export default UserProfile;
