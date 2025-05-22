import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface IssueReportDto {
  id: number;
  date: Date;
  location: {
    name: string;
    dormitory: {
      name: string;
    };
  };
  issueType: {
    name: string;
  };
  description: string;
  issueStatus: number;
  notes: {
    text: string;
  }[];
}

const GetStudentIssueReports: React.FC = () => {
  const [reports, setReports] = useState<IssueReportDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDescription, setNewDescription] = useState<string>("");
  const token = localStorage.getItem("token");

  const issueStatusMap: Record<number, string> = {
    0: "Új",
    1: "Folyamatban",
    2: "Elkészült",
    3: "Lezárva",
    4: "Validált",
  };

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/IssueReport/Student/Get/MyReports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          setReports(result.data);
          toast.success("Jelentések sikeresen betöltve!");
        } else {
          setError(result.message || "Hiba történt a jelentések lekérésekor.");
          toast.error(
            result.message || "Hiba történt a jelentések lekérésekor."
          );
        }
      } catch (err) {
        setError("Hálózati vagy egyéb hiba történt.");
        toast.error("Hálózati vagy egyéb hiba történt.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/Student/Delete/MyReport/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Sikeres törlés!");
        setReports(reports.filter((r) => r.id !== id));
      } else {
        toast.error(result.message || "Törlés sikertelen.");
      }
    } catch (error) {
      toast.error("Hiba történt a törlés közben.");
    }
  };

  const handleValidate = async (id: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/Student/ValidateIssue/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Sikeres validálás!");
        setReports(
          reports.map((r) => (r.id === id ? { ...r, issueStatus: 4 } : r))
        );
      } else {
        toast.error(result.message || "Validálás sikertelen.");
      }
    } catch (error) {
      toast.error("Hiba történt a validálás közben.");
    }
  };

  const handleDescriptionChange = async (id: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/Student/Change/Description/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDescription),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Leírás sikeresen módosítva!");
        setReports(
          reports.map((r) =>
            r.id === id ? { ...r, description: newDescription } : r
          )
        );
        setEditingId(null);
        setNewDescription("");
      } else {
        toast.error(result.message || "Módosítás sikertelen.");
      }
    } catch (error) {
      toast.error("Hiba történt a módosítás közben.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewDescription("");
  };

  return (
    <div>
      <h3>Saját hibajelentések</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Betöltés...</p>}

      {reports.length === 0 && !error && !loading && (
        <p>Nincs hibajelentésed.</p>
      )}

      {reports.map((report) => (
        <div
          key={report.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>ID:</strong> {report.id}
          </p>
          <p>
            <strong>Leírás:</strong>{" "}
            {editingId === report.id ? (
              <>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <button onClick={() => handleDescriptionChange(report.id)}>
                  Mentés
                </button>
                <button onClick={handleCancelEdit}>Mégse</button>
              </>
            ) : (
              report.description
            )}
          </p>
          <p>
            <strong>Dátum:</strong> {new Date(report.date).toLocaleString()}
          </p>
          <p>
            <strong>Helyszín:</strong> {report.location.name}
           
          </p>
          <p>
            <strong>Hibatípus:</strong> {report.issueType.name}
          </p>
          <p>
            <strong>Státusz:</strong>{" "}
            {issueStatusMap[report.issueStatus] ?? "Ismeretlen"}
          </p>
          {report.notes.length > 0 && (
            <div>
              <strong>Megjegyzések:</strong>
              <ul>
                {report.notes.map((note, index) => (
                  <li key={index}>{note.text}</li>
                ))}
              </ul>
            </div>
          )}

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => {
                setEditingId(report.id);
                setNewDescription(report.description);
              }}
              disabled={editingId === report.id}
            >
              Módosítás
            </button>
            <button onClick={() => handleDelete(report.id)}>Törlés</button>
            <button onClick={() => handleValidate(report.id)}>Validálás</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GetStudentIssueReports;