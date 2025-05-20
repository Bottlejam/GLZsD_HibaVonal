import React, { useState } from "react";
import API_BASE_URL from "../api";

const CancelOrder: React.FC = () => {
  const [orderId, setOrderId] = useState<number>(0);
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
        alert("Hiba: " + result.message);
      } else {
        alert(result.message || "Sikeres törlés");
      }
    } catch (error) {
      console.error("Hiba:", error);
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
