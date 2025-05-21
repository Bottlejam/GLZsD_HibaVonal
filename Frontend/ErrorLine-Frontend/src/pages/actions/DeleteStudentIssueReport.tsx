import React, { useState } from "react";
import API_BASE_URL from "../api";

const DeleteStudentIssueReport: React.FC = () => {
  const [issueId, setIssueId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    setMessage(null);
    setError(null);

    if (!issueId) {
      setError("Kérlek, add meg a hibajelentés ID-ját.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/Student/Delete/MyReport/${issueId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("A hibajelentés sikeresen törölve lett.");
        setIssueId("");
      } else {
        setError(result.message || "Nem sikerült törölni a hibajelentést.");
      }
    } catch (err) {
      setError("Hálózati vagy egyéb hiba történt.");
    }
  };

  return (
    <div>
      <h3>Hibajelentés törlése</h3>
      <input
        type="number"
        placeholder="Hibajelentés ID"
        value={issueId}
        onChange={(e) => setIssueId(e.target.value)}
      />
      <button onClick={handleDelete}>Törlés</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DeleteStudentIssueReport;
