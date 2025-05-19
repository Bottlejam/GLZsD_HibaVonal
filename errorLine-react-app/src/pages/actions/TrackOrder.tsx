import React, { useState } from "react";
import API_BASE_URL from "../api";

interface Order {
  id: number;
  equipmentId: number;
  quantity: number;
  status: string;
  description?: string;
}

const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState<number>(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleFetchOrder = async () => {
    if (!token) {
      setError("Nem vagy bejelentkezve.");
      setMessage(null);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/User/Get/MaintenanceManager/OrderById/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setOrder(result.data);
        setMessage(result.message);
        setError(null);
      } else {
        setError(result.message || "Hiba történt a rendelés lekérésekor.");
        setMessage(null);
        setOrder(null);
      }
    } catch (err) {
      setError("Hálózati hiba történt.");
      setMessage(null);
      setOrder(null);
    }
  };

  return (
    <div>
      <h2>Rendelés lekérése ID alapján</h2>
      <input
        type="number"
        placeholder="Rendelés ID"
        value={orderId}
        onChange={(e) => setOrderId(Number(e.target.value))}
        min={1}
      />
      <button onClick={handleFetchOrder}>Lekérés</button>

      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {order && (
        <div style={{ marginTop: "1em" }}>
          <h3>Rendelés adatai:</h3>
          <p>
            <strong>ID:</strong> {order.id}
          </p>
          <p>
            <strong>Eszköz ID:</strong> {order.equipmentId}
          </p>
          <p>
            <strong>Mennyiség:</strong> {order.quantity}
          </p>
          <p>
            <strong>Állapot:</strong> {order.status}
          </p>
          {order.description && (
            <p>
              <strong>Leírás:</strong> {order.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
