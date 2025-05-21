import React, { useState } from "react";
import { useEffect } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

const ChangeIssueStatus: React.FC = () => {
  const [issueId, setIssueId] = useState<number|"">("");
  const [statusName, setStatusName] = useState("Folyamatban");
  const [status, setStatus] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    switch (statusName) {
      case "Új":
        setStatus(0);
        break;
      case "Folyamatban":
        setStatus(1);
        break;
      case "Kész":
        setStatus(2);
        break;
      case "Lezárt":
        setStatus(3);
        break;
      case "Validált":
        setStatus(4);
        break;
      default:
        setStatus(0);
    }
  }, [statusName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
 try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/MaintenanceManager/ChangeIssueStatus/${issueId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(status),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Hibabejelentés állapota átállítva.");
        setIssueId("");
        setStatusName("Folyamatban");
      } else {
        toast.error(result.message || "Hiba a frissítés során.");
      }
    } catch (err) {
      toast.error("Ismeretlen hiba történt.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Hiba státuszának állítása</h3>
      <input
        type="number"
        placeholder="Hiba ID"
        value={issueId}
        onChange={(e) => setIssueId(Number(e.target.value))}
        required
      />
      <select
        value={statusName}
        onChange={(e) => setStatusName(e.target.value)}
      >
        <option value="Új">Új</option>
        <option value="Folyamatban">Folyamatban</option>
        <option value="Kész">Kész</option>
        <option value="Lezárt">Lezárt</option>
        <option value="Validált">Validált</option>
      </select>
      <button type="submit">Frissítés</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default ChangeIssueStatus;
