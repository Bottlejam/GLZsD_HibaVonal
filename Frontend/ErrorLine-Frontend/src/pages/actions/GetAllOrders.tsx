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
  const [editingStatuses, setEditingStatuses] = useState<{ [orderId: number]: number }>({});
  const token = localStorage.getItem("token");

  
const getStatusStyle = (status: number): React.CSSProperties => {
  switch (status) {
    case 0: return { color: "gray", fontWeight: "bold" };
    case 1: return { color: "blue", fontWeight: "bold" };
    case 2: return { color: "green", fontWeight: "bold" };
    case 3: return { color: "red", fontWeight: "bold" };
    default: return {};
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

  const cancelOrder = async (orderId: number) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/Order/MaintenanceManager/CancelOrder/${orderId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Hiba a rendelés törlésekor: " + (errorData?.message || "Ismeretlen hiba"));
        return;
      }

      toast.success("Rendelés sikeresen törölve.");
      fetchOrders();
    } catch (error) {
      toast.error("Hiba történt a rendelés törlésekor.");
      console.error(error);
    }
  };

  const changeOrderStatus = async (orderId: number, newStatus: number) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/Order/MaintenanceManager/ChangeOrderStatus/${orderId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStatus),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Hiba a státusz módosításakor: " + (errorData?.message || "Ismeretlen hiba"));
        return;
      }

      toast.success("Státusz frissítve.");
      setEditingStatuses((prev) => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });
      fetchOrders();
    } catch (error) {
      toast.error("Hiba történt a státusz módosításakor.");
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
          const selectedStatus = editingStatuses[order.id] ?? order.orderStatus;

          return (
            <div key={order.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px", paddingBottom: "10px" }}>
              <p><strong>Rendelés ID:</strong> {order.id}</p>
              <p><strong>Felhasználó:</strong> {user ? user.username : <em>(Felhasználó nem elérhető)</em>}</p>
              <p><strong>Létrehozva:</strong> {new Date(order.createdAt).toLocaleString()}</p>
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
                          {item.equipmentName} — Darabár: {item.equipmentPrice} Ft — Mennyiség: {item.quantity} — Összesen: {totalPrice} Ft
                        </li>
                      );
                    })}
                  </ul>
                )}

                <p>
                  <strong>Rendelés összértéke: </strong>
                  {order.orderItems.reduce((sum, item) => sum + item.equipmentPrice * item.quantity, 0)} Ft
                </p>
              </div>

              {/* Státusz módosítása */}
              <div style={{ marginTop: "10px" }}>
                <label><strong>Státusz:</strong></label>{" "}
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setEditingStatuses((prev) => ({
                      ...prev,
                      [order.id]: parseInt(e.target.value),
                    }))
                  }
                >
                  {Object.entries(orderStatusMap).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>

                {selectedStatus !== order.orderStatus && (
                  <button
                    onClick={() => changeOrderStatus(order.id, selectedStatus)}
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Mentés
                  </button>
                )}
              </div>

              {/* Mégse gomb függőben státusz esetén */}
              {order.orderStatus === 0 && (
                <button
                  onClick={() => cancelOrder(order.id)}
                  style={{
                    marginTop: "10px",
                    color: "white",
                    backgroundColor: "red",
                    border: "none",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Mégse
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default GetAllOrders;