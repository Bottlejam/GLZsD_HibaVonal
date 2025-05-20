import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface IssueReport {
  id: number;
  date: Date;
  description: string;
  reporter: Reporter;
  issueType: IssueType;
  location: Location;
  issueStatus: number;
  notes: Note[];
}

interface Reporter {
  id: number;
}

interface Location {
  id: number;
  name: string;
}

interface IssueType {
  id: number;
  name: string;
}

interface Note {
  text: string;
  createdAt: Date;
  createdById: number;
}

const GetReports_Worker: React.FC = () => {
  const [issueReports, setIssueReports] = useState<IssueReport[]>([]);
  const StatusTypeNames: { [key: number]: string } = {
    0: "Új",
    1: "Folyamatban",
    2: "Kész",
    3: "Lezárt",
    4: "Validált",
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchIssueReports = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/IssueReport/MaintenanceWorker/Get/ReportsAssignedToMe`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Hiba történt a hibabejelentések lekérésekkor");
        }

        const result = await response.json();
        setIssueReports(result.data);
      } catch (err: any) {
        setError(err.message || "Ismeretlen hiba történt.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssueReports();
  }, []);

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Hibabejelentéseim listája</h2>
      <ul>
        {issueReports.map((issueReport) => (
          <li key={issueReport.id} style={{ marginBottom: "1rem" }}>
            <strong>({issueReport.id}) bejelentő:</strong>{" "}
            {issueReport.reporter.id},{" "}
            <strong>{issueReport.issueType.name}</strong>:{" "}
            {issueReport.description} <br />
            <em>
              {new Date(issueReport.date).toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </em>
            {" – "}
            <strong>{issueReport.location.name}</strong> (
            {issueReport.location.id}), státusz:{" "}
            {StatusTypeNames[issueReport.issueStatus]}
            {issueReport.notes.length > 0 ? (
              <ul>
                {issueReport.notes.map((note, index) => (
                  <li key={index}>
                    <em>{new Date(note.createdAt).toLocaleString("hu-HU")}</em>{" "}
                    – <strong>{note.createdById}</strong>: {note.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <em>Nincs megjegyzés</em>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetReports_Worker;
