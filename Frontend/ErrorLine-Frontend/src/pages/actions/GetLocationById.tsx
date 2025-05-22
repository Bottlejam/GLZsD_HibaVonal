import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast, { Toaster } from "react-hot-toast";

interface Location {
  id: number;
  name: string;
  locationType: number;
}

const GetLocationById: React.FC = () => {
  const [locationId, setLocationId] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const LocationTypeNames: { [key: number]: string } = {
    0: "Közös helység",
    1: "Szoba",
  };

  const token = localStorage.getItem("token");

  const handleSearch = async () => {
    if (!locationId) return;

    setLoading(true);
    setError(null);
    setLocation(null);

     try {
      const response = await fetch(
        `${API_BASE_URL}/api/Location/Admin&Student/Get/LocationById/${locationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 404) {
        const res = await response.json();
        throw new Error(res.message);
      }

      if (!response.ok) {
        throw new Error("Hiba történt a lekérdezés során.");
      }

      const result = await response.json();
      setLocation(result.data);
      toast.success("Helyszín sikeresen lekérve.");
    } catch (err: any) {
      toast.error(err.message || "Ismeretlen hiba.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2>Helyszín lekérdezése ID alapján</h2>
      <input
        type="number"
        placeholder="Location ID"
        value={locationId}
        onChange={(e) => setLocationId(e.target.value)}
      />
      <button onClick={handleSearch}>Keresés</button>

      {loading && <p>Betöltés...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {location && (
        <div style={{ marginTop: "1rem" }}>
          <h3>{location.name}</h3>
          <p>Helyszín típusa: {LocationTypeNames[location.locationType]}</p>
        </div>
      )}
    </div>
  );
};

export default GetLocationById;
