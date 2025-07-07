import React, { useEffect, useState } from "react";
import axios from "axios";

function DeveloperDashboard({ user }) {
  const [bugs, setBugs] = useState([]);
  const [editState, setEditState] = useState({});

  useEffect(() => {
    fetchAllBugs();
  }, []);

  const fetchAllBugs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/bugs");
      setBugs(res.data);

      // Initialize editable state
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
      fetchAllBugs(); // Refresh list after saving
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Developer Bug Management</h4>

      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Type</th>
            <th>Reporter</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bugs.map((bug) => (
            <tr key={bug._id}>
              <td>{bug.title}</td>
              <td>{bug.description}</td>

              <td>
                <select
                  value={editState[bug._id]?.priority || "Low"}
                  onChange={(e) =>
                    handleChange(bug._id, "priority", e.target.value)
                  }
                  className="form-select"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </td>

              <td>{bug.type}</td>
              <td>{bug.reporter}</td>

              <td>
                <input
                  value={editState[bug._id]?.assignedTo || ""}
                  onChange={(e) =>
                    handleChange(bug._id, "assignedTo", e.target.value)
                  }
                  className="form-control"
                />
              </td>

              <td>
                <select
                  value={editState[bug._id]?.status || "New"}
                  onChange={(e) =>
                    handleChange(bug._id, "status", e.target.value)
                  }
                  className="form-select"
                >
                  <option>New</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </td>

              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleSave(bug._id)}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeveloperDashboard;
