import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface Dormitory {
  id: number;
  name: string;
  address:string;
}

const GetAllDormitories: React.FC = () => {
  const [dormitories, setDormitories] = useState<Dormitory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDormitories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Dormitory/SystemAdmin/Get/AllDormitorories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error("Hiba történt a kollégiumok lekérésekor.");
        }

        const result = await response.json();
        setDormitories(result.data);
      } catch (err: any) {
        setError(err.message || "Ismeretlen hiba történt.");
      } finally {
        setLoading(false);
      }
    };

    fetchDormitories();
  }, []);

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Kollégiumok listája</h2>
      <ul>
        {dormitories.map((dormitory) => (
          <li key={dormitory.id}>{dormitory.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllDormitories;