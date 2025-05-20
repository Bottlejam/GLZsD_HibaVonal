import React, { useState } from "react";
import API_BASE_URL from "../api";

interface OrderItem {
  equipmentId: number;
  equipmentName: string;
  quantity: number;
  equipmentPrice: number;
}

interface Order {
  id: number;
  userId: number;
  orderItems: OrderItem[];
  orderStatus: number;
  createdAt: Date;
}

const TrackOrder: React.FC = () => {
  const [order, setOrders] = useState<Order>();
  const [orderId, setOrderId] = useState<number>(0);
  const token = localStorage.getItem("token");
  const orderStatusMap: { [key: number]: string } = {
    0: "Függőben",
    1: "Jóváhagyva",
    2: "Megérkezett",
    3: "Elutasítva",
  };

  const handleOrder = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Order/Get/MaintenanceManager/OrderById/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setOrders(result.data);
        console.log(result);
      } else {
        alert("Hiba: " + result.message);
      }
    } catch (error) {
      console.error(error);
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
      />
      <button onClick={handleOrder}>Lekérés</button>

      {order && order.orderItems && order.orderItems.length > 0 && (
        <div>
          <h3>Rendelés adatai:</h3>
          <p>
            <strong>Rendelés ID:</strong> {order.id}
          </p>
          <p>
            <strong>Felhasználó ID:</strong> {order.userId}
          </p>
          <p>
            <strong>Állapot:</strong> {orderStatusMap[order.orderStatus]}
          </p>
          <p>
            <strong>Létrehozva:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <h4>Tételek:</h4>
          <ul>
            {order.orderItems.map((item, index) => (
              <li key={index}>
                Eszköz: {item.equipmentName} (ID: {item.equipmentId}) –
                Mennyiség: {item.quantity} – Egységár: {item.equipmentPrice} Ft
                – Összesen: {item.equipmentPrice * item.quantity} Ft
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
