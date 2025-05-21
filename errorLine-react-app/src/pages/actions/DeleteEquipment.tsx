import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

const DeleteEquipment: React.FC = () => {
  const [equipmentId, setEquipmentId] = useState<number | "">("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    if (!token) {
      setError("Nem vagy bejelentkezve.");
      setMessage(null);
      return;
    }
    if (!equipmentId) {
      setError("Kérlek, adj meg egy érvényes equipment ID-t.");
      setMessage(null);
      return;
    }

     try {
      const response = await fetch(
        `${API_BASE_URL}/api/Equipment/Admin/Delete/Equipment/${equipmentId}`,
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
        toast.success(result.message || "Equipment sikeresen törölve.");
        setEquipmentId("");
      } else {
        toast.error(result.message || "Hiba történt az equipment törlésekor.");
      }
    } catch (err) {
      toast.error("Hálózati hiba történt.");
    }
  };



  return (
    <div>
      <h2>Equipment törlése ID alapján</h2>
      <input
        type="number"
        placeholder="Equipment ID"
        value={equipmentId}
        onChange={(e) => setEquipmentId(Number(e.target.value))}
        min={1}
      />
      <button onClick={handleDelete}>Törlés</button>

      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default DeleteEquipment;
