import React, { useEffect, useState } from "react";
import axios from "axios";

function BugList() {
  const [bugs, setBugs] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchBugs = async () => {
    try {
      const url = user?.role === "reporter"
        ? `http://localhost:5000/bugs?reporter=${user.name}`
        : "http://localhost:5000/bugs";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBugs(res.data);
    } catch (err) {
      console.error("Error fetching bugs:", err);
    }
  };

  const deleteBug = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/bugs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBugs();
    } catch (err) {
      console.error("Error deleting bug:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/bugs/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBugs();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  return (
    <div>
      <h4>Bug List</h4>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Reporter</th>
            <th>Priority</th>
            <th>Status</th>
            {user?.role === "developer" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bugs.map((bug) => (
            <tr key={bug._id}>
              <td>{bug.title}</td>
              <td>{bug.reporter}</td>
              <td>{bug.priority}</td>
              <td>
                {user?.role === "developer" ? (
                  <select
                    value={bug.status || "Open"}
                    onChange={(e) => updateStatus(bug._id, e.target.value)}
                    className="form-select form-select-sm"
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </select>
                ) : (
                  bug.status || "Open"
                )}
              </td>
              {user?.role === "developer" && (
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteBug(bug._id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BugList;
