import React, { useState } from "react";
import API_BASE_URL from "../api";

interface NoteCreateDto {
  text: string;
}

const CreateNote: React.FC = () => {
  const [issueId, setIssueId] = useState<number | "">("");
  const [noteText, setNoteText] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    if (!token) {
      setError("Nem vagy bejelentkezve.");
      setLoading(false);
      return;
    }

    if (!issueId || !noteText.trim()) {
      setError("Kérlek, adj meg minden mezőt.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Note/Student/Create/Note/${issueId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: noteText }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Jegyzet sikeresen létrehozva.");
        setNoteText("");
        setIssueId("");
      } else {
        setError(result.message || "Hiba történt a jegyzet létrehozásakor.");
      }
    } catch (err) {
      setError("Hálózati hiba történt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Új jegyzet létrehozása hibaügyhöz</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Hiba ID:</label>
          <input
            type="number"
            min={1}
            value={issueId}
            onChange={(e) => setIssueId(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Jegyzet szövege:</label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Mentés..." : "Jegyzet létrehozása"}
        </button>
      </form>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default CreateNote;
