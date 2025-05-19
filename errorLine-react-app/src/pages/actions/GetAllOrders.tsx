import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../api";

interface EquipmentDto {
  name: string;
  quantity: number;
}

interface OrderItemDto {
  equipment: EquipmentDto;
  quantity: number;
}

interface OrderDto {
  id: number;
  status: string;
  orderItems: OrderItemDto[];
  dormitory: {
    name: string;
  };
}

const GetAllOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/User/MaintenanceWorker&Manager/Get/Allorders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const ordersData: OrderDto[] = response.data.data;
        setOrders(ordersData);
        setError(null);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Hiba történt a rendelések lekérésekor."
        );
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Összes rendelés a kollégiumban</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && orders.length === 0 && <p>Nincs rendelés.</p>}
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <strong>Rendelés #{order.id}</strong> – Állapot: {order.status} –
            Kollégium: {order.dormitory.name}
            <ul>
              {order.orderItems.map((item, index) => (
                <li key={index}>
                  {item.equipment.name} – {item.quantity} db
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllOrders;
