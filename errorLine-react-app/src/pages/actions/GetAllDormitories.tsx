import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface Dormitory {
  id: number;
  name: string;
  address: string;
}

const GetAllDormitories: React.FC = () => {
  const [dormitories, setDormitories] = useState<Dormitory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDormitory, setEditingDormitory] = useState<Dormitory | null>(null);
const [editedName, setEditedName] = useState("");
const [editedAddress, setEditedAddress] = useState("");
const [modalOpen, setModalOpen] = useState(false);  
const openEditModal = (dormitory: Dormitory) => {
    setEditingDormitory(dormitory);
    setEditedName(dormitory.name);
    setEditedAddress(dormitory.address);
    setModalOpen(true);
  };
  


  const token = localStorage.getItem("token");

  const fetchDormitories = async () => {
    if (!token) {
      setError("Nincs érvényes bejelentkezés.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Dormitory/SystemAdmin/Get/AllDormitories`, // javított endpoint
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Hiba történt a kollégiumok lekérésekor.");
      }

      const result = await response.json();
      setDormitories(result.data);
    } catch (err: any) {
      setError(err.message || "Ismeretlen hiba történt.");
    } finally {
      setLoading(false);
    }
  };
  const saveEdit = async () => {
  if (!token || !editingDormitory) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/Dormitory/SystemAdmin/Update/Dormitory/${editingDormitory.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editedName,
          address: editedAddress,
        }),
      }
    );

    if (!response.ok) throw new Error("Frissítés sikertelen");

    toast.success("Sikeres módosítás!");

    // Frissítsd a listát a változtatásokkal
    setDormitories((prev) =>
      prev.map((d) =>
        d.id === editingDormitory.id ? { ...d, name: editedName, address: editedAddress } : d
      )
    );

    setModalOpen(false);
    setEditingDormitory(null);
  } catch (err: any) {
    toast.error(err.message || "Hiba történt a módosítás során.");
  }
};

  useEffect(() => {
    fetchDormitories();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token) {
      toast.error("Nincs bejelentkezés.");
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Dormitory/SystemAdmin/Delete/Dormitory/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Törlés sikertelen");
      }

      toast.success("Sikeres törlés!");
      setDormitories((prev) => prev.filter((d) => d.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Hiba történt a törlés során.");
    }
  };

 

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return  (
  <div>
    <h2>Kollégiumok listája</h2>
   <ul>
  {dormitories.map((dormitory) => (
    <li key={dormitory.id} style={{ marginBottom: "10px" }}>
      <strong>{dormitory.name}</strong> (ID: {dormitory.id}) – {dormitory.address}{" "}
      <button onClick={() => openEditModal(dormitory)}>Módosítás</button>
      <button
        onClick={() => {
          if (
            window.confirm(
              `Biztos törlöd a kollégiumot: ${dormitory.name}?`
            )
          ) {
            handleDelete(dormitory.id);
          }
        }}
      >
        Törlés
      </button>
    </li>
  ))}
</ul>

    {/* Itt jön a modal JSX */}
    {modalOpen && (
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        }}>
          <h3>Kollégium szerkesztése</h3>
          <label>
            Név:<br />
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          </label>
          <br />
          <label>
            Cím:<br />
            <input
              type="text"
              value={editedAddress}
              onChange={(e) => setEditedAddress(e.target.value)}
            />
          </label>
          <br />
          <button onClick={saveEdit}>Mentés</button>{" "}
          <button onClick={() => setModalOpen(false)}>Mégse</button>
        </div>
      </div>
    )}
  </div>
);
};

export default GetAllDormitories;