import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface Note {
  id: number;
  text: string;
  createdAt: string;
  issueReportId: number;
}

const GetUserNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Note/Student/Get/MyNotes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("Jegyzetek API válasz:", result);

      if (response.ok) {
        setNotes(result.data);
      } else {
        setError(result.message || "Hiba történt a jegyzetek lekérésekor.");
      }
    } catch {
      setError("Hálózati hiba történt.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <h2>Saját jegyzeteim</h2>
      {loading && <p>Betöltés...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {notes.length > 0 ? (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
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
                <strong>Hiba ID:</strong> {note.issueReportId}
              </p>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>Nincs még jegyzeted.</p>
      )}
    </div>
  );
};

export default GetUserNotes;
