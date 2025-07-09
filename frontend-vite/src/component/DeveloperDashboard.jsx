import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DeveloperDashboard({ user }) {
  const [bugs, setBugs] = useState([]);
  const [editState, setEditState] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllBugs();
  }, []);

  const fetchAllBugs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/bugs");
      setBugs(res.data);

      const state = {};
      res.data.forEach((bug) => {
        state[bug._id] = {
          assignedTo: bug.assignedTo || "",
          priority: bug.priority,
          status: bug.status || "New",
        };
      });
      setEditState(state);
    } catch (err) {
      console.error("Error fetching bugs:", err);
    }
  };

  const handleChange = (bugId, field, value) => {
    setEditState((prev) => ({
      ...prev,
      [bugId]: { ...prev[bugId], [field]: value },
    }));
  };

  const handleSave = async (bugId) => {
    try {
      const updates = editState[bugId];
      await axios.put(`http://localhost:5000/bugs/${bugId}`, updates);
      fetchAllBugs();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const userImage = user?.picture || "https://cdn-icons-png.flaticon.com/512/9131/9131529.png";

  return (
    <div className="min-h-screen w-full bg-[#FAEB92] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-2xl p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center">
          <img
            src={userImage}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-[#9929EA] shadow-md grayscale"
          />
          <h1 className="text-2xl font-semibold mt-4 text-[#000000]">
            Welcome, {user?.name || "Developer"} 👨‍💻
          </h1>
          <button
            onClick={handleLogout}
            className="mt-3 bg-[#9929EA] hover:bg-[#CC66DA] text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Bug Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left table-auto border rounded-md overflow-hidden">
            <thead className="bg-[#CC66DA] text-white uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Reporter</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bugs.map((bug) => (
                <tr key={bug._id} className="hover:bg-[#FAEB92]">
                  <td className="px-4 py-2">{bug.title}</td>
                  <td className="px-4 py-2">{bug.description}</td>
                  <td className="px-4 py-2">
                    <select
                      value={editState[bug._id]?.priority || "Low"}
                      onChange={(e) => handleChange(bug._id, "priority", e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">{bug.type}</td>
                  <td className="px-4 py-2">{bug.reporter}</td>
                  <td className="px-4 py-2">
                    <input
                      value={editState[bug._id]?.assignedTo || ""}
                      onChange={(e) => handleChange(bug._id, "assignedTo", e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={editState[bug._id]?.status || "New"}
                      onChange={(e) => handleChange(bug._id, "status", e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option>New</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleSave(bug._id)}
                      className="bg-[#9929EA] hover:bg-[#CC66DA] text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DeveloperDashboard;
