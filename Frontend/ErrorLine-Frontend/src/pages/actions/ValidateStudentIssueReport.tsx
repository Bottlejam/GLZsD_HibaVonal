import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast, { Toaster } from "react-hot-toast";

const ValidateStudentIssueReport: React.FC = () => {
  const [issueId, setIssueId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleValidate = async () => {
    setMessage(null);
    setError(null);

    if (!issueId) {
      setError("Kérlek, add meg a hibajelentés ID-ját.");
      return;
    }

   try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/Student/ValidateIssue/${issueId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("A hibajelentés sikeresen érvényesítve lett.");
        setIssueId("");
      } else {
        toast.error(result.message || "Nem sikerült érvényesíteni a hibajelentést.");
      }
    } catch (err) {
      toast.error("Hálózati vagy egyéb hiba történt.");
    }
  };

  return (
    <div>
      <h3>Hibajelentés érvényesítése</h3>
      <input
        type="number"
        placeholder="Hibajelentés ID"
        value={issueId}
        onChange={(e) => setIssueId(e.target.value)}
      />
      <button onClick={handleValidate}>Érvényesítés</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ValidateStudentIssueReport;
