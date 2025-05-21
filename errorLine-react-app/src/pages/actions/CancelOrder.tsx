import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

const CancelOrder: React.FC = () => {
  const [orderId, setOrderId] = useState<number | "">("");
  const token = localStorage.getItem("token");

  const handleCancel = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Order/MaintenanceManager/CancelOrder/${orderId}`,
        {
          method: "PATCH", // 🔁 PATCH, nem DELETE
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Hiba történt a rendelés visszavonásakor.");
      } else {
        toast.success(result.message || "Sikeres rendelés visszavonás.");
        setOrderId(""); // reseteljük az inputot
      }
    } catch (error) {
      console.error("Hiba:", error);
      toast.error("Hálózati hiba történt.");
    }
  };

  return (
    <div>
      <h2>Rendelés törlése (státusz: visszavonás)</h2>
      <input
        type="number"
        placeholder="Rendelés ID"
        value={orderId}
        onChange={(e) => setOrderId(Number(e.target.value))}
      />
      <button onClick={handleCancel}>Rendelés visszavonása</button>
    </div>
  );
};

export default CancelOrder;
