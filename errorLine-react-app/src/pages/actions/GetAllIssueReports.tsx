import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface IssueReportDto {
  id: number;
  description: string;
  status: string;
  locationName: string;
  assignedWorkerName?: string;
  // Add hozzá a DTO többi mezőjét, amire szükséged van
}

const GetAllIssueReports: React.FC = () => {
  const [issueReports, setIssueReports] = useState<IssueReportDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchIssueReports = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/IssueReport/MaintenanceManager/Get/AllIssueReports`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Hiba történt az adatok lekérésekor"
          );
        }

        const data = await response.json();

        // Az API válasza így néz ki: { statusCode, message, data }
        setIssueReports(data.data);
      } catch (err: any) {
        setError(err.message || "Ismeretlen hiba történt.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssueReports();
  }, [token]);

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Hibajelentések listája</h2>
      {issueReports.length === 0 && <p>Nincs megjeleníthető hibajelentés.</p>}
      <ul>
        {issueReports.map((issue) => (
          <li key={issue.id}>
            {issue.description}
            {issue.assignedWorkerName &&
              `(Felelős: ${issue.assignedWorkerName})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllIssueReports;
