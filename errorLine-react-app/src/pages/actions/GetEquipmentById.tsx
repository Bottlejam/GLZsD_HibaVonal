import React, { useState } from "react";
import API_BASE_URL from "../api";

interface Location {
  id: number;
  name: string;
  
}

interface Dormitory {
  id: number;
  name: string;
}

interface Equipment {
  id: number;
  name: string;
  stock: number;
  price: number;
  location: Location;
  dormitory: Dormitory;
}

const GetEquipmentById: React.FC = () => {
  const [equipmentId, setEquipmentId] = useState<number | "">("");
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchEquipment = async () => {
    if (!equipmentId) {
      setError("Kérlek, adj meg egy érvényes eszköz ID-t.");
      setEquipment(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Equipment/Admin/Get/EquipmentById/${equipmentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setEquipment(result.data);
      } else {
        setError(result.message || "Hiba történt a lekéréskor.");
        setEquipment(null);
      }
    } catch (err) {
      setError("Hálózati hiba történt.");
      setEquipment(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Eszköz lekérése ID alapján</h2>
      <input
        type="number"
        placeholder="Eszköz ID"
        value={equipmentId}
        onChange={(e) => setEquipmentId(Number(e.target.value))}
        min={1}
      />
      <button onClick={fetchEquipment} disabled={loading}>
        Lekérés
      </button>

      {loading && <p>Betöltés...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {equipment && (
        <div style={{ marginTop: "1rem" }}>
          <h3>{equipment.name}</h3>
          <p><strong>Készlet:</strong> {equipment.stock}</p>
          <p><strong>Ár:</strong> {equipment.price} Ft</p>
          <p><strong>Helyszín:</strong> {equipment.location?.name}</p>
          
          <p><strong>Kollégium:</strong> {equipment.dormitory?.name}</p>
        </div>
      )}
    </div>
  );
};

export default GetEquipmentById;