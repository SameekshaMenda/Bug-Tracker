import React, { useState } from "react";
import BugForm from "./component/BugForm";
import BugList from "./component/BugList";
import Login from "./component/Login";
import DeveloperDashboard from "./component/DeveloperDashboard";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  if (!user) return <Login onLogin={(user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  }} />;

  return (
    <div className="container mt-4">
      <h2>Welcome, {user.name} ({user.role})</h2>

      {user.role === "developer" ? (
        <DeveloperDashboard user={user} />
      ) : (
        <>
          <BugForm onBugAdded={() => {}} />
          <BugList reporter={user.name} />
        </>
      )}
    </div>
  );
}

export default App;
