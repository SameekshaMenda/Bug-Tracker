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
    await axios.post("http://localhost:5000/bugs", form);
    onBugAdded(); // refresh bug list
    setForm({
      title: "",
      description: "",
      priority: "Medium",
      reporter: "",
      assignedTo: "",
      type: "",
    });
    setBugType("");
  };

  return (
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
  );
}

export default BugForm;
