import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface Equipment {
  id: number;
  name: string;
  stock: number;
  price: number;
  location: Location;
}

interface Location {
  id: number;
  name: string;
}

const GetAllEquipments: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    stock: 0,
    price: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Equipment/Admin/Get/AllEquipments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Hiba történt az eszközök lekérésekor.");
      }

      const result = await response.json();
      setEquipments(result.data);
    } catch (err: any) {
      toast.error(err.message || "Ismeretlen hiba történt.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt az eszközt?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/Equipment/Admin/Delete/Equipment/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Törlés sikertelen");

      toast.success("Eszköz törölve");
      fetchEquipments(); // frissítés
    } catch (err: any) {
      toast.error(err.message || "Hiba történt a törlés során");
    }
  };

  const handleEditClick = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setEditFormData({
      name: equipment.name,
      stock: equipment.stock,
      price: equipment.price,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "stock" || name === "price" ? Number(value) : value,
    }));
  };

  const handleEditSubmit = async () => {
    if (!editingEquipment) return;

    try {
    const response = await fetch(
      `${API_BASE_URL}/api/Equipment/Admin/Update/Equipment/${editingEquipment.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editFormData.name,
          stock: editFormData.stock,
          price: editFormData.price,
          locationId: editingEquipment.location.id, // ezt küldd, mert kell a DTO-nak
        }),
      }
    );

    if (!response.ok) throw new Error("Hiba a módosítás során");

    toast.success("Sikeres módosítás");
    setEditingEquipment(null);
    fetchEquipments();
  } catch (err: any) {
    toast.error(err.message || "Hiba történt");
  }
};

  if (loading) return <div>Betöltés...</div>;

  return (
 <div style={{ maxWidth: 700, marginLeft: 0, marginRight: "auto" }}>
      <h2>Eszközök listája</h2>
      <ul style={{ padding: 0 }}>
        {equipments.map((equipment) => (
          <li
            key={equipment.id}
            style={{
              marginBottom: "1rem",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: 5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
  <strong>{equipment.name} (ID: {equipment.id})</strong> — {equipment.stock} db — {equipment.price} Ft — Helyszín:{" "}
  {equipment.location.name} (ID: {equipment.location.id})
</div>
            <div>
              <button onClick={() => handleEditClick(equipment)} style={{ marginRight: 8 }}>
                Módosítás
              </button>
              <button onClick={() => handleDelete(equipment.id)}>Törlés</button>
            </div>
          </li>
        ))}
      </ul>

      {editingEquipment && (
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
            <h3>{editingEquipment.name} módosítása</h3>
            <label>
              Név:
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
              />
            </label>
            <br />
            <label>
              Készlet:
              <input
                type="number"
                name="stock"
                value={editFormData.stock}
                onChange={handleEditChange}
              />
            </label>
            <br />
            <label>
              Ár:
              <input
                type="number"
                name="price"
                value={editFormData.price}
                onChange={handleEditChange}
              />
            </label>
            <br />
            <div style={{ marginTop: 15 }}>
              <button onClick={handleEditSubmit}>Mentés</button>{" "}
              <button onClick={() => setEditingEquipment(null)}>Mégse</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllEquipments;