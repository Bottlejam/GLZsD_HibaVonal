import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface User {
  id: number;
  username: string;
}

interface Location {
  id: number;
  name: string;
}

interface IssueReport {
  id: number;
  title: string;
  description: string;
  status: string;
  location?: Location;
}

interface Note {
  id: number;
  text: string;
  createdAt: string;
  issueReportId: number;
  createdBy: User;
}

const GetAllNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [issueReports, setIssueReports] = useState<IssueReport[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Nem vagy bejelentkezve.");
      return;
    }

    const fetchNotes = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Note/MaintenanceManager/Get/AllNotes`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
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

    const fetchIssueReports = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/IssueReport/MaintenanceManager/Get/AllIssueReports`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();
        if (response.ok) {
          // Csak nem validáltak
          const notValidatedReports = (result.data || []).filter(
            (ir: IssueReport) => ir.status?.toLowerCase() !== "validált"
          );
          setIssueReports(notValidatedReports);
        } else {
          toast.error(result.message || "Hiba történt az IssueReport-ok lekérdezésekor.");
        }
      } catch (err) {
        console.error("IssueReport lekérés hiba:", err);
        toast.error("Hálózati hiba történt az IssueReport-ok lekérésekor.");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/User/MaintenanceManager/Get/AllStudentsInDormitory`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();
        if (response.ok) {
          setUsers(result.data || []);
        } else {
          toast.error(result.message || "Hiba történt a felhasználók lekérdezésekor.");
        }
      } catch (err) {
        console.error("Felhasználók lekérése hiba:", err);
        toast.error("Hálózati hiba történt a felhasználók lekérésekor.");
      }
    };

    fetchNotes();
    fetchIssueReports();
    fetchUsers();
  }, [token]);

  const handleDeleteNote = async (noteId: number) => {
    if (!token) return;

    const confirmDelete = window.confirm("Biztosan törlöd ezt a jegyzetet?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}api/Note/MaintenanceManager/Delete/Note/${noteId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        toast.success("Jegyzet sikeresen törölve.");
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      } else {
        const result = await response.json();
        toast.error(result.message || "Nem sikerült törölni a jegyzetet.");
      }
    } catch (err) {
      console.error("Törlési hiba:", err);
      toast.error("Hiba történt a jegyzet törlésekor.");
    }
  };

  // Csak azok a jegyzetek, amelyekhez van nem validált issue report
  const filteredNotes =
    issueReports.length > 0
      ? notes.filter(note => issueReports.some(ir => ir.id === note.issueReportId))
      : notes;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Összes jegyzet (Gondnok)</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {filteredNotes.length === 0 ? (
        <p>Nincs elérhető jegyzet.</p>
      ) : (
        <ul className="space-y-4">
          {filteredNotes.map(note => {
            const issueReport = issueReports.find(ir => ir.id === note.issueReportId);
            const userName = note.createdBy?.username || "Ismeretlen";

            return (
              <li key={note.id} className="border p-4 rounded-xl shadow">
                <p><strong>Jegyzet ID:</strong> {note.id}</p>
                <p><strong>Szöveg:</strong> {note.text}</p>
                <p><strong>Létrehozva:</strong> {new Date(note.createdAt).toLocaleString()}</p>
                <p><strong>Bejelentés ID:</strong> {note.issueReportId}</p>

                {issueReport && (
                  <div className="mt-2">
              
                    <p><strong>Leírás:</strong> {issueReport.description}</p>
                    {issueReport.location && (
                      <p><strong>Helyszín:</strong> {issueReport.location.name}</p>
                    )}
               
                  </div>
                )}

                <p><strong>Készítő:</strong> {userName}</p>

                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  Törlés
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default GetAllNotes;