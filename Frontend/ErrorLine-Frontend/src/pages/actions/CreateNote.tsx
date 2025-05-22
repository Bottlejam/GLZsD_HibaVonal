import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface IssueReportDto {
  id: number;
  date: Date;
  description: string;
  issueStatus: number;
}

const CreateNote: React.FC = () => {
  const [issueId, setIssueId] = useState<number>(0);
  const [noteText, setNoteText] = useState<string>("");
  const [reports, setReports] = useState<IssueReportDto[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/IssueReport/Student/Get/MyReports`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const reportsData = await reportsRes.json();

        setReports(reportsData.data || []);
      } catch (err) {
        console.error("Hiba az adatok betöltésekor:", err);
        // setError helyett toast
        toast.error("Nem sikerült betölteni a legördülő listákat.");
      }
    };

    fetchData();
  }, [token]);

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
        toast.success(result.message || "Jegyzet sikeresen létrehozva.");
        setNoteText("");
        setIssueId(0);
      } else {
        toast.error(
          result?.message ?? "Hiba történt a jegyzet létrehozásakor."
        );
      }
    } catch (err) {
      toast.error("Hálózati hiba történt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Új jegyzet létrehozása hibaügyhöz</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <select
            value={issueId}
            onChange={(e) => setIssueId(Number(e.target.value))}
            required
          >
            <option value="">-- Válassz hibabejelentést --</option>
            {reports
              .filter((rep) => rep.issueStatus === 2)
              .map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.description} ({rep.id}) -{" "}
                  {new Date(rep.date).toLocaleString("hu-HU")}
                </option>
              ))}
          </select>
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