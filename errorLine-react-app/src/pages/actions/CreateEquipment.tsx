import React, { useState } from "react";
import API_BASE_URL from "../api";

interface CreateEquipmentDto {
  name: string;
  stock: number;
  price: number;
  locationId: number;
}

const CreateEquipment: React.FC = () => {
  const [formData, setFormData] = useState<CreateEquipmentDto>({
    name: "",
    stock: 0,
    price: 0,
    locationId: 0,
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "stock" ||
        name === "price" ||
        name === "locationId" ||
        name === "dormitoryId"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Equipment/Admin/Create/Equipment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Eszköz sikeresen létrehozva.");
        setFormData({
          name: "",
          stock: 0,
          price: 0,
          locationId: 0,
        });
      } else {
        setError(result.message || "Hiba történt az eszköz létrehozásakor.");
      }
    } catch (err) {
      setError("Hálózati hiba történt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Új eszköz létrehozása</h2>
      <form onSubmit={handleSubmit}>
        <label>Név:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label>Készlet:</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />
        <label>Ár:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <label>Helyszín ID:</label>
        <input
          type="number"
          name="locationId"
          value={formData.locationId}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Mentés..." : "Létrehozás"}
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateEquipment;
