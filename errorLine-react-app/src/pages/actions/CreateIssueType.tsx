import React, { useState } from "react";
import API_BASE_URL from "../api";

interface CreateIssueType {
  name: string;
}

const CreateIssueType: React.FC = () => {
  const [issueType, setIssueType] = useState<CreateIssueType>({
    name: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIssueType({ ...issueType, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/Admin/Create/IssueType`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(issueType),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("Hibatípus sikeresen létrehozva!");
        setIssueType({
          name: "",
        });
      } else {
        setError(result.message || "Hiba történt a létrehozás során.");
      }
    } catch (err: any) {
      setError("Ismeretlen hiba történt.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Hibatípus létrehozása</h3>
      <input
        type="text"
        name="name"
        placeholder="Hibatípus neve"
        value={issueType.name}
        onChange={handleChange}
        required
      />
      <button type="submit">Létrehozás</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CreateIssueType;
