import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface Note {
  id: number;
  text: string;
  createdAt: string;
  issueReportId: number;
  createdById: number;
}

interface IssueReport {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
}

const GetAllNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [issueReports, setIssueReports] = useState<IssueReport[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Nem vagy bejelentkezve.");
      return;
    }

    // Jegyzetek lekérése
    const fetchNotes = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Note/MaintenanceManager/Get/AllNotes`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          setNotes(result.data || []);
        } else {
          toast.error(result.message || "Hiba történt a jegyzetek lekérdezésekor.");
        }
      } catch (err) {
          console.error("Jegyzetek lekérése hiba:", err);

        toast.error("Hálózati hiba történt a jegyzetek lekérésekor.");
      }
    };

    // IssueReport-ok lekérése
    const fetchIssueReports = async () => {
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

    console.log("IssueReport API status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("IssueReport API hiba:", response.status, errorData);
      toast.error(errorData?.message || "Hiba történt az IssueReport-ok lekérdezésekor.");
      return;
    }

    const result = await response.json();
    console.log("IssueReport API sikeres adat:", result);

    const filtered = (result.data || []).filter(
      (ir: IssueReport) => ir.status.toLowerCase() !== "validált"
    );
    setIssueReports(filtered);
  } catch (err) {
    console.error("Fetch hiba az IssueReport-ok lekérésekor:", err);
    toast.error("Hálózati hiba történt az IssueReport-ok lekérésekor.");
  }
};
    fetchNotes();
    fetchIssueReports();
  }, [token]);

  // Csak azok a jegyzetek, amelyekhez nem validált issueReport tartozik
  const filteredNotes = notes.filter(note =>
    issueReports.some(ir => ir.id === note.issueReportId)
  );

  return (
    <div>
      <h2>Összes jegyzet (Gondnok)</h2>
      {error && <p className="text-red-500">{error}</p>}

      {filteredNotes.length === 0 ? (
        <p>Nincs elérhető jegyzet.</p>
      ) : (
        <ul className="space-y-4">
          {filteredNotes.map(note => {
            const issueReport = issueReports.find(ir => ir.id === note.issueReportId);

            return (
              <li key={note.id} className="border p-4 rounded-xl shadow">
                <p><strong>ID:</strong> {note.id}</p>
                <p><strong>Szöveg:</strong> {note.text}</p>
                <p><strong>Létrehozva:</strong> {new Date(note.createdAt).toLocaleString()}</p>
                <p><strong>IssueReport ID:</strong> {note.issueReportId}</p>

                {issueReport && (
                  <>
                    <p><strong>Cím:</strong> {issueReport.title}</p>
                    <p><strong>Leírás:</strong> {issueReport.description}</p>
                    <p><strong>Súlyosság:</strong> {issueReport.severity}</p>
                    <p><strong>Státusz:</strong> {issueReport.status}</p>
                  </>
                )}

                <p><strong>Készítő ID:</strong> {note.createdById}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default GetAllNotes;
