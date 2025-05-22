import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast, { Toaster } from "react-hot-toast";

interface UpdateDormitoryDto {
  name: string;
  address: string;
}

const UpdateDormitory: React.FC = () => {
  const [dormitoryId, setDormitoryId] = useState<number | "">("");
  const [formData, setFormData] = useState<UpdateDormitoryDto>({
    name: "",
    address: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    if (!token) {
      setError("Nem vagy bejelentkezve.");
      setMessage(null);
      return;
    }
    if (!dormitoryId) {
      setError("Kérlek, adj meg egy érvényes kollégium ID-t.");
      setMessage(null);
      return;
    }
    if (!formData.name || !formData.address) {
      setError("Töltsd ki az összes mezőt.");
      setMessage(null);
      return;
    }
     setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Dormitory/SystemAdmin/Update/Location/${dormitoryId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Kollégium sikeresen frissítve.");
      } else {
        toast.error(result.message || "Hiba történt a kollégium frissítésekor.");
      }
    } catch {
      toast.error("Hálózati hiba történt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Kollégium frissítése</h2>
      <input
        type="number"
        placeholder="Kollégium ID"
        value={dormitoryId}
        onChange={(e) => setDormitoryId(Number(e.target.value))}
        min={1}
      />
      <input
        type="text"
        name="name"
        placeholder="Név"
        value={formData.name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="address"
        placeholder="Cím"
        value={formData.address}
        onChange={handleInputChange}
      />
      <button onClick={handleUpdate}>Frissítés</button>

      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default UpdateDormitory;
