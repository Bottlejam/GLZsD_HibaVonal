import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface User {
  id: number;
  username: string;
}

interface OrderItem {
  equipmentId: number;
  equipmentName: string;
  quantity: number;
  equipmentPrice: number;
}

interface Order {
  id: number;
  user: User | null;
  orderItems: OrderItem[];
  orderStatus: number;
  createdAt: string;
}

const GetAllOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = localStorage.getItem("token");

  const getStatusStyle = (status: number): React.CSSProperties => {
    switch (status) {
      case 0:
        return { color: "gray", fontWeight: "bold" };
      case 1:
        return { color: "blue", fontWeight: "bold" };
      case 2:
        return { color: "green", fontWeight: "bold" };
      case 3:
        return { color: "red", fontWeight: "bold" };
      default:
        return {};
    }
  };

  const orderStatusMap: { [key: number]: string } = {
    0: "Függőben",
    1: "Jóváhagyva",
    2: "Megérkezett",
    3: "Elutasítva",
  };

  const fetchOrders = async () => {
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
        toast.error("Hiba: " + errorText);
        return;
      }

      const result = await response.json();
      setOrders(result.data);
    } catch (error) {
      toast.error("Hiba a rendelések lekérésekor.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div>
      <h2>Összes rendelés</h2>
      {orders.length === 0 ? (
        <p>Nincs rendelés.</p>
      ) : (
        orders.map((order) => {
          const user = order.user;

          return (
            <div
              key={order.id}
              style={{
                borderBottom: "1px solid #ccc",
                marginBottom: "10px",
                paddingBottom: "10px",
              }}
            >
              <p>
                <strong>Rendelés ID:</strong> {order.id}
              </p>
              <p>
                <strong>Felhasználó:</strong>{" "}
                {user ? user.username : <em>(Felhasználó nem elérhető)</em>}
              </p>
              <p>
                <strong>Létrehozva:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Státusz:</strong>{" "}
                <span style={getStatusStyle(order.orderStatus)}>
                  {orderStatusMap[order.orderStatus]}
                </span>
              </p>
              <div style={{ marginLeft: "20px" }}>
                <strong>Rendelés tételek:</strong>
                {order.orderItems.length === 0 ? (
                  <p>Nem található rendelési tétel.</p>
                ) : (
                  <ul>
                    {order.orderItems.map((item) => {
                      const totalPrice = item.equipmentPrice * item.quantity;
                      return (
                        <li key={item.equipmentId}>
                          {item.equipmentName} — Darabár: {item.equipmentPrice} Ft — Mennyiség:{" "}
                          {item.quantity} — Összesen: {totalPrice} Ft
                        </li>
                      );
                    })}
                  </ul>
                )}

                <p>
                  <strong>Rendelés összértéke: </strong>
                  {order.orderItems.reduce(
                    (sum, item) => sum + item.equipmentPrice * item.quantity,
                    0
                  )}{" "}
                  Ft
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GetAllOrders;