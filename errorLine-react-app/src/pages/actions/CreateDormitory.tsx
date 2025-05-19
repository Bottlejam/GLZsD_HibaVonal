import React, { useState } from "react";
import API_BASE_URL from "../api";

interface CreateDormitoryDto {
  name: string;
  address: string;
}

const CreateDormitory: React.FC = () => {
  const [formData, setFormData] = useState<CreateDormitoryDto>({
    name: "",
    address: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token"); // ha kell auth

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/Dormitory/SystemAdmin/Create/Dormitory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Kollégium sikeresen létrehozva.");
        setFormData({ name: "", address: "" });
      } else {
        setError(result.message || "Hiba történt a kollégium létrehozásakor.");
      }
    } catch (err) {
      setError("Hálózati hiba történt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Új kollégium létrehozása</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Cím:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Mentés..." : "Létrehozás"}
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateDormitory;