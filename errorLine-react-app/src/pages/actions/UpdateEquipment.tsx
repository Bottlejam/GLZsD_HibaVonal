import React, { useState } from "react";
import API_BASE_URL from "../api";

interface EquipmentUpdateDto {
  name: string;
  stock: number;
  price: number;
  locationId: number; // feltételezve, hogy csak az ID-t küldjük update-hez
  dormitoryId: number; // ha kell, vagy eltávolítható, ha nem update-eljük
}

const UpdateEquipment: React.FC = () => {
  const [equipmentId, setEquipmentId] = useState<number | "">("");
  const [formData, setFormData] = useState<EquipmentUpdateDto>({
    name: "",
    stock: 0,
    price: 0,
    locationId: 0,
    dormitoryId: 0,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "name" ? value : Number(value),
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Nem vagy bejelentkezve.");
      setMessage(null);
      return;
    }
    if (!equipmentId) {
      setError("Kérlek, adj meg egy érvényes Equipment ID-t.");
      setMessage(null);
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Equipment/Admin/Update/Equipment/${equipmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Equipment sikeresen frissítve.");
      } else {
        setError(result.message || "Hiba történt az equipment frissítésekor.");
      }
    } catch (err) {
      setError("Hálózati hiba történt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Equipment frissítése ID alapján</h2>
      <input
        type="number"
        placeholder="Equipment ID"
        value={equipmentId}
        onChange={(e) => setEquipmentId(Number(e.target.value))}
        min={1}
      />
      <form onSubmit={handleUpdate}>
        <div>
          <label>Név:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Készlet:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min={0}
          />
        </div>
        <div>
          <label>Ár:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min={0}
          />
        </div>
        <div>
          <label>Location ID:</label>
          <input
            type="number"
            name="locationId"
            value={formData.locationId}
            onChange={handleChange}
            required
            min={1}
          />
        </div>
        <div>
          <label>Dormitory ID:</label>
          <input
            type="number"
            name="dormitoryId"
            value={formData.dormitoryId}
            onChange={handleChange}
            required
            min={1}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Frissítés..." : "Frissítés"}
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UpdateEquipment;
