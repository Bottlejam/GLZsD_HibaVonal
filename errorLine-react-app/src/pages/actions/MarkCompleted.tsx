import React, { useState } from "react";
import API_BASE_URL from "../api";

const MarkCompleted: React.FC = () => {
  const [issueId, setIssueId] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/MaintenanceWorker/MarkIssueAsCompleted/${issueId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("Hibabejelentés állapota átállítva.");
      } else {
        setError(result.message || "Hiba a frissítés során.");
      }
    } catch (err) {
      setError("Ismeretlen hiba történt.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Hiba "Kész"-re állítása</h3>
      <input
        type="number"
        placeholder="Hiba ID"
        value={issueId}
        onChange={(e) => setIssueId(Number(e.target.value))}
        required
      />
      <button type="submit">Frissítés</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default MarkCompleted;
