import React, { useEffect, useState } from "react";
import axios from "axios";

function BugList() {
  const [bugs, setBugs] = useState([]);

  const fetchBugs = async () => {
    const res = await axios.get("http://localhost:5000/bugs");
    setBugs(res.data);
  };

  const deleteBug = async (id) => {
    await axios.delete(`http://localhost:5000/bugs/${id}`);
    fetchBugs();
  };

  useEffect(() => { fetchBugs(); }, []);

  return (
    <div>
      <h4>Bug List</h4>
      <table className="table table-bordered table-striped mt-2">
        <thead className="table-dark">
          <tr>
            <th>Title</th><th>Reporter</th><th>Priority</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bugs.map((bug) => (
            <tr key={bug._id}>
              <td>{bug.title}</td>
              <td>{bug.reporter}</td>
              <td>{bug.priority}</td>
              <td>{bug.status}</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => deleteBug(bug._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BugList;
