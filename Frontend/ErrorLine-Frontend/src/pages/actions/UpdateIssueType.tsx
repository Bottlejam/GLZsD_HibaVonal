import React, { useState } from "react";
import API_BASE_URL from "../api";

const UpdateIssueTypeForm: React.FC = () => {
  const [id, setId] = useState<number>(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const data = {
      name,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/Admin/Update/IssueType/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("Hibatípus frissítve");
      } else {
        setError(result.message || "Hiba a frissítés során.");
      }
    } catch (err) {
      setError("Ismeretlen hiba történt.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Hibítípus frissítése</h3>
      <input
        type="number"
        placeholder="Hibítípus ID"
        value={id}
        onChange={(e) => setId(Number(e.target.value))}
        required
      />
      <input
        type="string"
        placeholder="Név"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Frissítés</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default UpdateIssueTypeForm;
