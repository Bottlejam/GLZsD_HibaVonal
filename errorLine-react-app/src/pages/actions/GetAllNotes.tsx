import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface Note {
  id: number;
  text: string;
  createdAt: string;
  issueReportId: number;
  createdById: number;
}

const GetAllNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotes = async () => {
      if (!token) {
        setError("Nem vagy bejelentkezve.");
        return;
      }

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
          setError(null);
        } else {
          setError(
            result.message || "Hiba történt a jegyzetek lekérdezésekor."
          );
        }
      } catch (err) {
        setError("Hálózati hiba történt.");
      }
    };

    fetchNotes();
  }, [token]);

  return (
    <div>
      <h2>Összes jegyzet (Gondnok)</h2>
      {error && <p className="text-red-500">{error}</p>}
      {notes.length === 0 ? (
        <p>Nincs elérhető jegyzet.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note.id} className="border p-4 rounded-xl shadow">
              <p>
                <strong>ID:</strong> {note.id}
              </p>
              <p>
                <strong>Szöveg:</strong> {note.text}
              </p>
              <p>
                <strong>Létrehozva:</strong>{" "}
                {new Date(note.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>IssueReport ID:</strong> {note.issueReportId}
              </p>
              <p>
                <strong>Készítő ID:</strong> {note.createdById}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetAllNotes;
