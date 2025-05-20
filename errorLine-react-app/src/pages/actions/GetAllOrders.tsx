import React, { useState, useEffect } from "react";
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

const GetAllOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = localStorage.getItem("token");

  const orderStatusMap: { [key: number]: string } = {
    0: "Függőben",
    1: "Jóváhagyva",
    2: "Megérkezett",
    3: "Elutasítva",
  };

  const handleOrder = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Order/Get/Allorders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Hiba: " + errorText);
        return;
      }

      const result = await response.json();
      setOrders(result.data);
    } catch (error) {
      console.error("Hiba a rendelések lekérésekor:", error);
    }
  };

  useEffect(() => {
    handleOrder();
  }, []);

  return (
    <div>
      <h2>Összes rendelés</h2>
      {orders.length === 0 ? (
        <p>Nincs rendelés.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ marginBottom: "1rem" }}>
            <p>
              <strong>Rendelés ID:</strong> {order.id}
            </p>
            <p>
              <strong>Felhasználó ID:</strong> {order.userId}
            </p>
            <p>
              <strong>Státusz:</strong> {orderStatusMap[order.orderStatus]}
            </p>
            <p>
              <strong>Létrehozva:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default GetAllOrders;
