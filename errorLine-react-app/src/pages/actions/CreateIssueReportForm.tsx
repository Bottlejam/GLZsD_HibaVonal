import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface Location {
  id: number;
  name: string;
}

interface IssueType {
  id: number;
  name: string;
}

interface CreateIssueReportDto {
  description: string;
  locationId: number;
  issueTypeId: number;
}

const CreateIssueReportForm: React.FC = () => {
  const [description, setDescription] = useState("");
  const [locationId, setLocationId] = useState<number | "">("");
  const [issueTypeId, setIssueTypeId] = useState<number | "">("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // 👇 Lekérjük a legördülő lista adatait betöltéskor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, issueTypesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/Location/Admin/Get/AllLocations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/IssueReport/Admin/Get/AllIssueTypes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const locationsData = await locationsRes.json();
        const issueTypesData = await issueTypesRes.json();

        setLocations(locationsData.data || []);
        setIssueTypes(issueTypesData.data || []);
      } catch (err) {
        console.error("Hiba az adatok betöltésekor:", err);
        setError("Nem sikerült betölteni a legördülő listákat.");
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!description || !locationId || !issueTypeId) {
      setError("Minden mezőt ki kell tölteni!");
      return;
    }

    const data: CreateIssueReportDto = {
      description,
      locationId: Number(locationId),
      issueTypeId: Number(issueTypeId),
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/Student/Create/IssueReport`,
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
        setMessage("Hibajelentés sikeresen létrehozva!");
        setDescription("");
        setLocationId("");
        setIssueTypeId("");
      } else {
        setError(result.message || "Hiba történt a létrehozás során.");
      }
    } catch (err) {
      setError("Ismeretlen hiba történt.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Új hibajelentés</h3>

      <textarea
        placeholder="Leírás"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <select
        value={locationId}
        onChange={(e) => setLocationId(Number(e.target.value))}
        required
      >
        <option value="">-- Válassz helyszínt --</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.name}
          </option>
        ))}
      </select>

      <select
        value={issueTypeId}
        onChange={(e) => setIssueTypeId(Number(e.target.value))}
        required
      >
        <option value="">-- Válassz hibatípust --</option>
        {issueTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>

      <button type="submit">Létrehozás</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CreateIssueReportForm;
