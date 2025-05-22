import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface CreateLocationDto {
  name: string;
  locationType: string;
}

const CreateLocationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [locationType, setLocationType] = useState("CommonPlace");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const data: CreateLocationDto = {
      name,
      locationType,
    };

     try {
      const response = await fetch(
        `${API_BASE_URL}/api/Location/Admin/Create/Location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Helyszín sikeresen létrehozva!");
        setName("");
        setLocationType("CommonPlace");
      } else {
        toast.error(result.message || "Hiba történt a létrehozás során.");
      }
    } catch (err: any) {
      toast.error("Ismeretlen hiba történt.");
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <h3>Helyszín létrehozása</h3>
      <input
        type="text"
        placeholder="Helyszín neve"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select
        value={locationType}
        onChange={(e) => setLocationType(e.target.value)}
      >
        <option value="CommonPlace">Közös helység</option>
        <option value="Room">Szoba</option>
      </select>
      <button type="submit">Létrehozás</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CreateLocationForm;
