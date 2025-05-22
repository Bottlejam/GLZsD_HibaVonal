import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface IssueReportDto {
  id: number;
  date: string;
  description: string;
  reporter: { username: string };
  issueType: { name: string };
  location: { name: string };
  issueStatus: number;
  notes: { text: string }[];
  assignedWorker?: { username: string } | null;
}

const GetReports_Worker: React.FC = () => {
  const [issueReports, setIssueReports] = useState<IssueReportDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const issueStatusMap: Record<number, string> = {
    0: "Új",
    1: "Folyamatban",
    2: "Elkészült",
    3: "Lezárva",
    4: "Jóváhagyva",
  };

  useEffect(() => {
    const fetchIssueReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/IssueReport/MaintenanceWorker/Get/ReportsAssignedToMe`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Hiba történt az adatok lekérésekor");
        }

        const data = await response.json();
        setIssueReports(data.data);
        toast.success("Hibajelentések sikeresen betöltve.");
      } catch (err: any) {
        setError(err.message || "Ismeretlen hiba történt.");
        toast.error(err.message || "Ismeretlen hiba történt.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssueReports();
  }, [token]);

  const handleMarkAsDone = async (issueId: number) => {
    try {
      const doneStatus = 2; // Elkészült
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/MaintenanceWorker/MarkIssueAsCompleted/${issueId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doneStatus),
        }
      );

      if (!response.ok) throw new Error("Állapot módosítás sikertelen");

      toast.success("Hibajelentés elkészült státuszba állítva");
      setIssueReports((prev) =>
        prev.map((issue) =>
          issue.id === issueId ? { ...issue, issueStatus: doneStatus } : issue
        )
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Hibajelentések listája</h2>
      {issueReports.length === 0 && <p>Nincs megjeleníthető hibajelentés.</p>}
      <ul>
        {issueReports.map((issue) => (
          <li key={issue.id} style={{ marginBottom: 20 }}>
            <p>
              <strong>ID:</strong> {issue.id}
            </p>
            <p>
              <strong>Dátum:</strong> {issue.date}
            </p>
            <p>
              <strong>Leírás:</strong> {issue.description}
            </p>
            <p>
              <strong>Jelentő:</strong> {issue.reporter?.username}
            </p>
            <p>
              <strong>Hiba típusa:</strong> {issue.issueType?.name} <p><strong>Helyszín:</strong>{" "} {issue.location?.name}</p>
             
            </p>
            <p>
              <strong>Állapot:</strong> {issueStatusMap[issue.issueStatus] ?? "Ismeretlen"}
            </p>
          

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                alignItems: "center",
              }}
            >
              {/* Hozzárendelés gomb eltávolítva */}
              {/* Csak a 'Kész' gomb marad, ha az állapot nem 'Elkészült' */}
              {issue.issueStatus !== 2 && (
                <button onClick={() => handleMarkAsDone(issue.id)}>Kész</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetReports_Worker;