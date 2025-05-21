import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface Location {
  id: number;
  name: string;
  description: string;
  dormitoryId: number;
}

const GetAllLocations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Location/Admin&Student/Get/AllLocations`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Nem sikerült lekérni a helyszíneket.");
        }

        const result = await response.json();
        setLocations(result.data); // result.data = location lista
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Helyszínek listája</h2>
      <ul>
        {locations.map((loc) => (
          <li key={loc.id}>
            <strong>{loc.name}</strong> {loc.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllLocations;
