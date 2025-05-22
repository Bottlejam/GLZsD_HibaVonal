import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface Note {
  id: number;
  text: string;
  issueReportId: number;
  createdAt: string;
}

const GetUserNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState<string>("");

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

      if (response.ok) {
        setNotes(result.data);
        toast.success("Jegyzetek sikeresen betöltve!");
      } else {
        setError(result.message || "Hiba történt a jegyzetek lekérésekor.");
        toast.error(result.message || "Hiba történt a jegyzetek lekérésekor.");
      }
    } catch {
      setError("Hálózati hiba történt.");
      toast.error("Hálózati hiba történt.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Note/Student/Delete/Note/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Jegyzet törölve.");
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } else {
        toast.error(result.message || "Nem sikerült törölni a jegyzetet.");
      }
    } catch {
      toast.error("Hálózati hiba törlés közben.");
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditedText(note.text);
  };

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Note/Student/Update/Note/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: editedText }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Jegyzet frissítve.");
        setNotes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, text: editedText } : n))
        );
        setEditingNoteId(null);
        setEditedText("");
      } else {
        toast.error(result.message || "Nem sikerült frissíteni a jegyzetet.");
      }
    } catch {
      toast.error("Hálózati hiba frissítés közben.");
    }
  };

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
                <strong>Szöveg:</strong>{" "}
                {editingNoteId === note.id ? (
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                ) : (
                  note.text
                )}
              </p>
              <p>
                <strong>Létrehozva:</strong>{" "}
                {new Date(note.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Hiba ID:</strong> {note.issueReportId}
              </p>

              {editingNoteId === note.id ? (
                <>
                  <button onClick={() => handleUpdate(note.id)}>Mentés</button>
                  <button onClick={() => setEditingNoteId(null)}>Mégse</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(note)}>Módosítás</button>
                  <button onClick={() => handleDelete(note.id)}>Törlés</button>
                </>
              )}
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