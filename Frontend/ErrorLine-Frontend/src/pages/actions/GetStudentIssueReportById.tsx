import React, { useState } from "react";
import API_BASE_URL from "../api";

interface IssueReportDto {
  id: number;
  description: string;
  issueType: {
    name: string;
  };
  location: {
    name: string;
    dormitory: {
      name: string;
    };
  };
  reporter: {
    name: string;
    email: string;
  };
  // Bővíthető ha több mező kell
}

const GetStudentIssueReportById: React.FC = () => {
  const [issueId, setIssueId] = useState("");
  const [issue, setIssue] = useState<IssueReportDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleTrack = async () => {
    setError(null);
    setIssue(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/Student/Get/IssueById/${issueId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setIssue(result.data);
      } else {
        setError(result.message || "Nem található hibajelentés.");
      }
    } catch (err) {
      setError("Hálózati vagy egyéb hiba történt.");
    }
  };

  return (
    <div>
      <h3>Hibajelentés lekérdezése ID alapján</h3>
      <input
        type="number"
        placeholder="Issue ID"
        value={issueId}
        onChange={(e) => setIssueId(e.target.value)}
      />
      <button onClick={handleTrack}>Keresés</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {issue && (
        <div style={{ marginTop: "1em" }}>
          <p>
            <strong>ID:</strong> {issue.id}
          </p>
          <p>
            <strong>Leírás:</strong> {issue.description}
          </p>
          <p>
            <strong>Helyszín:</strong> {issue.location.dormitory.name} /{" "}
            {issue.location.name}
          </p>
          <p>
            <strong>Hibatípus:</strong> {issue.issueType.name}
          </p>
          <p>
            <strong>Beküldő:</strong> {issue.reporter.name} (
            {issue.reporter.email})
          </p>
        </div>
      )}
    </div>
  );
};

export default GetStudentIssueReportById;
