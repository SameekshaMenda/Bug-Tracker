import React, { useState } from "react";
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

  // AI Prediction
  const autoSuggestAI = async (desc) => {
    try {
      setLoading(true);
      const priorityRes = await axios.post("http://localhost:5000/ai/predict-priority", {
        description: desc,
      });
      const typeRes = await axios.post("http://localhost:5000/ai/predict-type", {
        description: desc,
      });

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
      onBugAdded(); // optional callback

      // Fetch bugs reported by this reporter
      if (form.reporter.trim() !== "") {
        const res = await axios.get(
          `http://localhost:5000/bugs?reporter=${encodeURIComponent(form.reporter)}`
        );
        setReporterBugs(res.data);
      }

      // Reset form
      setForm({
        title: "",
        description: "",
        priority: "Medium",
        reporter: "",
        assignedTo: "",
        type: "",
      });
      setBugType("");
    } catch (err) {
      console.error("Failed to submit bug:", err.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-6">
            <input
              name="title"
              placeholder="Title"
              className="form-control"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              name="reporter"
              placeholder="Reporter"
              className="form-control"
              value={form.reporter}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <textarea
          name="description"
          placeholder="Description"
          className="form-control mt-2"
          value={form.description}
          onChange={handleChange}
        ></textarea>

        <div className="row mt-2">
          <div className="col-md-4">
            <select
              name="priority"
              className="form-control"
              value={form.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="col-md-4">
            <input
              name="assignedTo"
              placeholder="Assigned To"
              className="form-control"
              value={form.assignedTo}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <input
              name="type"
              placeholder="Bug Type"
              className="form-control"
              value={form.type}
              onChange={handleChange}
              readOnly
            />
          </div>
        </div>

        {bugType && (
          <div className="alert alert-info mt-3">
            🧠 <strong>Predicted Bug Type:</strong> {bugType}
          </div>
        )}

        {loading && <p className="text-muted">AI analyzing your description...</p>}

        <button className="btn btn-primary mt-3">Add Bug</button>
      </form>

      {/* Reporter Bug Table */}
      {reporterBugs.length > 0 && (
        <div>
          <h5>Bugs Reported by {reporterBugs[0].reporter}</h5>
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {reporterBugs.map((bug) => (
                <tr key={bug._id}>
                  <td>{bug.title}</td>
                  <td>{bug.description}</td>
                  <td>{bug.priority}</td>
                  <td>{bug.assignedTo}</td>
                  <td>{bug.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default BugForm;
