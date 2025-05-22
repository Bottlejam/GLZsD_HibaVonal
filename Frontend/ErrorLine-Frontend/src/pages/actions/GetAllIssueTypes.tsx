import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface IssueType {
  id: number;
  name: string;
}

const GetAllIssueTypes: React.FC = () => {
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingIssueType, setEditingIssueType] = useState<IssueType | null>(null);
  const [editName, setEditName] = useState<string>("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchIssueTypes();
  }, [token]);

  const fetchIssueTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/Admin&Student/Get/AllIssueTypes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Hiba történt a hibatípusok lekérésekor.");
      }

      const result = await response.json();
      setIssueTypes(result.data);
      toast.success("Hibatípusok sikeresen betöltve.");
    } catch (err: any) {
      setError(err.message || "Ismeretlen hiba történt.");
      toast.error(err.message || "Ismeretlen hiba történt.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a hibatípust?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/IssueReport/Admin/Delete/IssueType/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Törlés sikertelen");

      toast.success("Hibatípus törölve");
      fetchIssueTypes();
    } catch (err: any) {
      toast.error(err.message || "Hiba történt a törlés során");
    }
  };

  const handleEditClick = (issueType: IssueType) => {
    setEditingIssueType(issueType);
    setEditName(issueType.name);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const handleEditSubmit = async () => {
    if (!editingIssueType) return;
    if (editName.trim() === "") {
      toast.error("A név nem lehet üres.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/Admin/Update/IssueType/${editingIssueType.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: editName }),
        }
      );

      if (!response.ok) throw new Error("Hiba a módosítás során");

      toast.success("Sikeres módosítás");
      setEditingIssueType(null);
      fetchIssueTypes();
    } catch (err: any) {
      toast.error(err.message || "Hiba történt");
    }
  };

  const handleEditCancel = () => {
    setEditingIssueType(null);
  };

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Hibatípusok listája</h2>
      <ul>
        {issueTypes.map((issueType) => (
          <li key={issueType.id} style={{ marginBottom: 8 }}>
            {issueType.name} ({issueType.id}){" "}
            <button onClick={() => handleEditClick(issueType)} style={{ marginLeft: 8 }}>
              Módosítás
            </button>{" "}
            <button onClick={() => handleDelete(issueType.id)} style={{ marginLeft: 8 }}>
              Törlés
            </button>
          </li>
        ))}
      </ul>

      {editingIssueType && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              minWidth: 300,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <h3>{editingIssueType.name} módosítása</h3>
            <label>
              Név:
              <input type="text" value={editName} onChange={handleEditChange} />
            </label>
            <br />
            <div style={{ marginTop: 15 }}>
              <button onClick={handleEditSubmit}>Mentés</button>{" "}
              <button onClick={handleEditCancel}>Mégse</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllIssueTypes;