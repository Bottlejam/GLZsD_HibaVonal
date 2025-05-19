import React, { useState } from "react";
import API_BASE_URL from "../api";

const UpdateLocationForm: React.FC = () => {
  const [locationId, setLocationId] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [locationType, setLocationType] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const data = {
      name,
      locationType,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Location/Admin/Update/Location/${locationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("Helyszín sikeresen frissítve.");
      } else {
        setError(result.message || "Hiba a frissítés során.");
      }
    } catch (err) {
      setError("Ismeretlen hiba történt.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Helyszín frissítése</h3>
      <input
        type="number"
        placeholder="Helyszín ID"
        value={locationId}
        onChange={(e) => setLocationId(Number(e.target.value))}
        required
      />
      <input
        type="text"
        placeholder="Helyszín neve"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Típus (pl. 0 = Szoba, 1 = Mosdó, stb.)"
        value={locationType}
        onChange={(e) => setLocationType(Number(e.target.value))}
        required
      />
      <button type="submit">Frissítés</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default UpdateLocationForm;