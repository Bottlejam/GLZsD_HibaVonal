import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

const DeleteDormitory: React.FC = () => {
  const [dormitoryId, setDormitoryId] = useState<number | "">("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleDelete = async () => {
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

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Dormitory/SystemAdmin/Delete/Dormitory/${dormitoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Kollégium sikeresen törölve.");
        setDormitoryId("");
      } else {
        toast.error(result.message || "Hiba történt a kollégium törlésekor.");
      }
    } catch (err) {
      toast.error("Hálózati hiba történt.");
    }
  };

  return (
    <div>
      <h2>Kollégium törlése ID alapján</h2>
      <input
        type="number"
        placeholder="Kollégium ID"
        value={dormitoryId}
        onChange={(e) => setDormitoryId(Number(e.target.value))}
        min={1}
      />
      <button onClick={handleDelete}>Törlés</button>

      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default DeleteDormitory;
