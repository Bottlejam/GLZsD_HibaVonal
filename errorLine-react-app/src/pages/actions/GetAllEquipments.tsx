import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface Equipment {
  id: number;
  name: string;
  stock: number;
  price: number;
  location: Location;
}

interface Location {
  id: number;
  name: string;
}

const GetAllEquipments: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Equipment/Admin/Get/AllEquipments`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Hiba történt az eszközök lekérésekor.");
        }

        const result = await response.json();
        setEquipments(result.data);
      } catch (err: any) {
        setError(err.message || "Ismeretlen hiba történt.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Eszközök listája</h2>
      <ul>
        {equipments.map((equipment) => (
          <li key={equipment.id}>
            Id: {equipment.id} {equipment.name}: {equipment.stock}, helyszín:{" "}
            {equipment.location.name}({equipment.location.id})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllEquipments;
