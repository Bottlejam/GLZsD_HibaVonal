import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

const ChangeIssueDescription: React.FC = () => {
  const [issueId, setIssueId] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);

    if (!issueId || !newDescription) {
      setError("Kérlek, tölts ki minden mezőt.");
      return;
    }

   try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/Student/Change/Description/${issueId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newDescription),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Leírás sikeresen módosítva.");
        setIssueId("");
        setNewDescription("");
      } else {
        toast.error(result.message || "Nem sikerült a leírás módosítása.");
      }
    } catch (err) {
      toast.error("Hálózati vagy szerverhiba történt.");
    }
  };

  return (
    <div>
      <h3>Hibajelentés leírásának módosítása</h3>

      <input
        type="number"
        placeholder="Hibajelentés ID"
        value={issueId}
        onChange={(e) => setIssueId(e.target.value)}
      />
      <br />

      <textarea
        placeholder="Új leírás"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        rows={4}
        cols={50}
      />
      <br />

      <button onClick={handleSubmit}>Módosítás</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ChangeIssueDescription;
