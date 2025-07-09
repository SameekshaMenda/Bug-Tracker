import React, { useState, useEffect } from "react";
import axios from "axios";

function BugForm({ onBugAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    reporter: "",
    assignedTo: "",
    type: "",
  });

  const [bugType, setBugType] = useState("");
  const [loading, setLoading] = useState(false);
  const [reporterBugs, setReporterBugs] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const profileImg = user?.picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    if (user?.name) {
      setForm((prev) => ({ ...prev, reporter: user.name }));
      fetchBugs(user.name);
      setShowWelcome(true);
    }
  }, [user]);

  const fetchBugs = async (reporterName) => {
    try {
      const res = await axios.get(`http://localhost:5000/bugs?reporter=${encodeURIComponent(reporterName)}`);
      setReporterBugs(res.data);
    } catch (err) {
      console.error("Failed to fetch reporter bugs:", err.message);
    }
  };

  const autoSuggestAI = async (desc) => {
    try {
      setLoading(true);
      const priorityRes = await axios.post("http://localhost:5000/ai/predict-priority", { description: desc });
      const typeRes = await axios.post("http://localhost:5000/ai/predict-type", { description: desc });

      setForm((prev) => ({
        ...prev,
        priority: priorityRes.data.priority,
        type: typeRes.data.type,
      }));
      setBugType(typeRes.data.type);
    } catch (error) {
      console.error("AI prediction failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "description" && value.length > 10) {
      autoSuggestAI(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/bugs", form);
      onBugAdded();
      fetchBugs(form.reporter); // update bug list

      setForm({
        title: "",
        description: "",
        priority: "Medium",
        reporter: user.name,
        assignedTo: "",
        type: "",
      });
      setBugType("");
    } catch (err) {
      console.error("Failed to submit bug:", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#FAEB92] flex flex-col items-center justify-center px-4 py-10 relative">
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-[#9929EA] hover:bg-[#CC66DA] text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      {/* Main container */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl w-full">
        {/* Profile + Welcome */}
        {showWelcome && (
          <div className="flex flex-col items-center mb-6">
            <img
              src={profileImg}
              alt="User"
              className="w-24 h-24 rounded-full border-4 border-[#9929EA] shadow-md filter grayscale"
            />
            <h2 className="mt-3 text-lg font-semibold text-[#000000]">
              Welcome, {user?.name || "Reporter"} 👋
            </h2>
          </div>
        )}

        {/* Bug Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="title"
              placeholder="Bug Title"
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#CC66DA]"
              value={form.title}
              onChange={handleChange}
              required
            />
            <input
              name="reporter"
              className="border px-3 py-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
              value={form.reporter}
              readOnly
            />
          </div>

          <textarea
            name="description"
            placeholder="Describe the issue"
            className="border mt-4 w-full px-3 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-[#9929EA]"
            value={form.description}
            onChange={handleChange}
          ></textarea>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <select
              name="priority"
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#CC66DA]"
              value={form.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input
              name="assignedTo"
              placeholder="Assign to (optional)"
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#CC66DA]"
              value={form.assignedTo}
              onChange={handleChange}
            />

            <input
              name="type"
              placeholder="Bug Type"
              readOnly
              className="border px-3 py-2 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
              value={form.type}
            />
          </div>

          {bugType && (
            <div className="mt-3 text-sm text-[#9929EA] font-semibold">
              🧠 AI Predicted Bug Type: <span className="italic">{bugType}</span>
            </div>
          )}
          {loading && <p className="text-gray-500 mt-2">Analyzing description with AI...</p>}

          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded mt-6"
          >
            Submit Bug
          </button>
        </form>

        {/* Reported Bug List */}
        {reporterBugs.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-[#000000] mb-2">
              Your Submitted Bugs
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 text-sm rounded">
                <thead className="bg-[#CC66DA] text-white uppercase">
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Priority</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Assigned To</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reporterBugs.map((bug) => (
                    <tr key={bug._id} className="hover:bg-[#FAEB92]">
                      <td className="border px-4 py-2">{bug.title}</td>
                      <td className="border px-4 py-2">{bug.description}</td>
                      <td className="border px-4 py-2">{bug.priority}</td>
                      <td className="border px-4 py-2">{bug.type}</td>
                      <td className="border px-4 py-2">{bug.assignedTo}</td>
                      <td className="border px-4 py-2">{bug.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BugForm;
