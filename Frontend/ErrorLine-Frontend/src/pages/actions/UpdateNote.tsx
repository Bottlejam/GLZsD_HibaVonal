import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast, { Toaster } from "react-hot-toast";

const UpdateNote: React.FC = () => {
  const [noteId, setNoteId] = useState<number | "">("");
  const [newText, setNewText] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleUpdate = async () => {
    if (!token) {
      setError("Nem vagy bejelentkezve.");
      setMessage(null);
      return;
    }

    if (!noteId || newText.trim() === "") {
      setError("Adj meg érvényes jegyzet ID-t és szöveget.");
      setMessage(null);
      return;
    }

   try {
      const response = await fetch(
        `${API_BASE_URL}/api/Note/Student/Update/Note/${noteId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newText }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Jegyzet sikeresen frissítve.");
        setNoteId("");
        setNewText("");
      } else {
        toast.error(result.message || "Hiba történt a frissítés során.");
      }
    } catch (err) {
      toast.error("Hálózati hiba történt.");
    }
  };
  return (
    <div>
      <h2>Jegyzet frissítése</h2>
      <input
        type="number"
        placeholder="Jegyzet ID"
        value={noteId}
        onChange={(e) => setNoteId(Number(e.target.value))}
        min={1}
      />
      <br />
      <textarea
        placeholder="Új szöveg"
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleUpdate}>Frissítés</button>

      {message && (
        <div style={{ color: "green", marginTop: "1rem" }}>{message}</div>
      )}
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
    </div>
  );
};

export default UpdateNote;
