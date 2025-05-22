import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

const DeleteMyNote: React.FC = () => {
  const [noteId, setNoteId] = useState<number | "">("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleDeleteNote = async () => {
    if (!token) {
      setError("Nem vagy bejelentkezve.");
      setMessage(null);
      return;
    }
    if (!noteId) {
      setError("Adj meg egy jegyzet ID-t!");
      setMessage(null);
      return;
    }

   try {
      const response = await fetch(
        `${API_BASE_URL}/api/Note/Student/Delete/Note/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Jegyzet sikeresen törölve.");
        setNoteId("");
      } else {
        toast.error(result.message || "Hiba történt a jegyzet törlésekor.");
      }
    } catch (err) {
      toast.error("Hálózati hiba történt.");
    }
  };

  return (
    <div>
      <h2>Saját jegyzet törlése</h2>
      <input
        type="number"
        placeholder="Jegyzet ID"
        value={noteId}
        onChange={(e) => setNoteId(Number(e.target.value))}
        min={1}
      />
      <button onClick={handleDeleteNote}>Törlés</button>

      {message && (
        <div style={{ color: "green", marginTop: "1rem" }}>{message}</div>
      )}
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
    </div>
  );
};

export default DeleteMyNote;
