import React, { useState } from "react";
import API_BASE_URL from "../api";

const DeleteIssueType: React.FC = () => {
  const [id, setId] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReportController/Admin/Delete/IssueType/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("Hibatípus sikeresen törölve.");
        setId(0);
      } else {
        setError(result.message || "Hiba történt a törlés során.");
      }
    } catch (err) {
      setError("Ismeretlen hiba történt.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Hibatípus törlése</h3>
      <input
        type="number"
        placeholder="Hibatípus ID"
        value={id}
        onChange={(e) => setId(Number(e.target.value))}
        required
      />
      <button type="submit">Törlés</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default DeleteIssueType;
