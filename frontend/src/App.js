import React, { useState } from "react";
import BugForm from "./component/BugForm";
import BugList from "./component/BugList";
import Login from "./component/Login";

function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="container mt-4">
      <h2>Welcome, {user.name} ({user.role})</h2>
      <BugForm onBugAdded={() => {}} />
      <BugList />
    </div>
  );
}

export default App;
