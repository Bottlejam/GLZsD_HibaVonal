import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface Location {
  id: number;
  name: string;
  description: string;
  locationType: number;
  dormitoryId: number;
}

const GetAllLocations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [newName, setNewName] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newLocationType, setNewLocationType] = useState<number>(0);

  const locationTypes: { [key: number]: string } = {
    0: "CommonPlace",
    1: "Room",
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
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
        setLocations(result.data);
        toast.success("Helyszínek sikeresen betöltve!");
        setError(null);
      } catch (err: any) {
        const message = err.message || "Ismeretlen hiba történt.";
        toast.error(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchLocations();
    } else {
      toast.error("Nincs bejelentkezve.");
      setLoading(false);
    }
  }, [token]);

  // Törlés
  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!window.confirm("Biztosan törölni szeretnéd?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/Location/Admin/Delete/Location/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Nem sikerült törölni a helyszínt.");

      setLocations((prev) => prev.filter((loc) => loc.id !== id));
      toast.success("Helyszín törölve!");
    } catch (err: any) {
      toast.error(err.message || "Ismeretlen hiba történt.");
    }
  };

  // Módosítási ablak megnyitása
  const openEditModal = (loc: Location) => {
    setEditLocation(loc);
    setNewName(loc.name);
    setNewDescription(loc.description);
    setNewLocationType(loc.locationType);
  };

  // Módosítás mentése
const handleSaveEdit = async () => {
  if (!editLocation || !token) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/Location/Admin/Update/Location/${editLocation.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newName,
        locationType: newLocationType,
      }),
    });

    if (!response.ok) throw new Error("Nem sikerült frissíteni a helyszínt.");

    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === editLocation.id
          ? { ...loc, name: newName, locationType: newLocationType }
          : loc
      )
    );

    toast.success("Helyszín sikeresen frissítve.");
    setEditLocation(null);
  } catch (err: any) {
    toast.error(err.message || "Ismeretlen hiba történt.");
  }
};
  const closeEditModal = () => {
    setEditLocation(null);
  };

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Helyszínek listája</h2>
      <ul>
        {locations.map((loc) => (
          <li key={loc.id}>
            <strong>
              ID: {loc.id} - {loc.name}
            </strong>{" "}
            — {loc.description} — Típus: {locationTypes[loc.locationType] || "Ismeretlen"}
            <button onClick={() => handleDelete(loc.id)} style={{ marginLeft: 10 }}>
              Törlés
            </button>
            <button onClick={() => openEditModal(loc)} style={{ marginLeft: 10 }}>
              Módosítás
            </button>
          </li>
        ))}
      </ul>

      {editLocation && (
  <div
  >
    <div
    >
      <h3>Helyszín módosítása</h3>
      <label>
        Név:
        <br />
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </label>
      <br />
      {/* LEÍRÁS mező törölve */}
      <label>
        Típus:
        <br />
        <select
          value={newLocationType}
          onChange={(e) => setNewLocationType(Number(e.target.value))}
        >
          <option value={0}>CommonPlace</option>
          <option value={1}>Room</option>
        </select>
      </label>
      <br />
      <br />
      <button onClick={handleSaveEdit}>Mentés</button>
      <button onClick={closeEditModal} style={{ marginLeft: 10 }}>
        Mégse
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default GetAllLocations;