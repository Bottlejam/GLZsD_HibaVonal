import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast, { Toaster } from "react-hot-toast";

const GetNoteById: React.FC = () => {
  const [noteId, setNoteId] = useState<number | "">("");
  const [note, setNote] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleGetNote = async () => {
    if (!token) {
      setError("Nem vagy bejelentkezve.");
      setNote(null);
      return;
    }
    if (!noteId) {
      setError("Kérlek, adj meg egy érvényes jegyzet ID-t.");
      setNote(null);
      return;
    }
     setLoading(true);
      try {
      const response = await fetch(
        `${API_BASE_URL}/api/Note/MaintenanceManager/Get/NoteById/${noteId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setNote(result.data);
        toast.success("Jegyzet sikeresen lekérve.");
      } else {
        toast.error(result.message || "Hiba történt a jegyzet lekérdezésekor.");
        setNote(null);
      }
    } catch (err) {
      toast.error("Hálózati hiba történt.");
      setNote(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Jegyzet lekérdezése ID alapján</h2>
      <input
        type="number"
        placeholder="Jegyzet ID"
        value={noteId}
        onChange={(e) => setNoteId(Number(e.target.value))}
        min={1}
      />
      <button onClick={handleGetNote}>Lekérdezés</button>

      {note && (
        <div style={{ marginTop: "1rem", color: "green" }}>
          <p>
            <strong>Jegyzet ID:</strong> {note.id}
          </p>
          <p>
            <strong>Szöveg:</strong> {note.text}
          </p>
          <p>
            <strong>Létrehozva:</strong>{" "}
            {new Date(note.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Issue ID:</strong> {note.issueReportId}
          </p>
          <p>
            <strong>Létrehozó ID:</strong> {note.createdById}
          </p>
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default GetNoteById;
