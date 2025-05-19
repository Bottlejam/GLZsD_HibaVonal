import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../api";

const CancelOrder: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/api/User/MaintenanceManager/CancelOrder/{orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        setMessage(response.data.message);
        setError(null);
      } else {
        setError("Nem sikerült a rendelés törlése.");
        setMessage(null);
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Ismeretlen hiba történt.");
      }
      setMessage(null);
    }
  };

  return (
    <div>
      <h2>Rendelés törlése</h2>
      <input
        type="number"
        placeholder="Rendelés azonosító"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <button onClick={handleCancelOrder}>Törlés</button>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CancelOrder;
