import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface OrderCreateDto {
  equipmentId: number;
  quantity: number;
}

const CreateOrderForm: React.FC = () => {
  const [equipmentId, setEquipmentId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<OrderCreateDto[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const addItem = () => {
    const newItem: OrderCreateDto = {
      equipmentId,
      quantity,
    };
    setOrderItems((prevItems) => [...prevItems, newItem]);
    setEquipmentId(0);
    setQuantity(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/Order/Create/Order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: orderItems }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Rendelés sikeresen létrehozva!");
        setOrderItems([]);
      } else {
        toast.error(result.message || "Hiba történt a rendelés létrehozásakor.");
      }
    } catch (err) {
      toast.error("Hálózati hiba történt.");
    }
  };

  return (
    <div>
      <h2>Rendelés lista létrehozása</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Eszköz ID:</label>
          <input
            type="number"
            value={equipmentId}
            onChange={(e) => setEquipmentId(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Mennyiség:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>
        <button type="button" onClick={addItem}>
          Rendelés hozzáadása a listához
        </button>
        <button type="submit">Lista küldése</button>
      </form>

      <h3>Aktuális rendelési tételek:</h3>
      <ul>
        {orderItems.map((item, idx) => (
          <li key={idx}>
            Equipment ID: {item.equipmentId}, Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateOrderForm;
