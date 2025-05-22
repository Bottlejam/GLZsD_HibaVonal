import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface Equipment {
  id: number;
  name: string;
}

interface OrderCreateDto {
  equipmentId: number;
  quantity: number;
}

const EquipmentSearchSelect: React.FC<{
  equipments: Equipment[];
  onSelect: (id: number) => void;
  selectedId: number | null;
}> = ({ equipments, onSelect, selectedId }) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Equipment[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setFiltered(equipments);
    } else {
      const lower = query.toLowerCase();
      setFiltered(equipments.filter(eq => eq.name.toLowerCase().includes(lower)));
    }
  }, [query, equipments]);

  // Ha van kiválasztott id, beállítjuk az inputba a nevet
  useEffect(() => {
    if (selectedId !== null) {
      const selectedEquip = equipments.find(eq => eq.id === selectedId);
      if (selectedEquip) setQuery(selectedEquip.name);
    } else {
      setQuery("");
    }
  }, [selectedId, equipments]);

  const handleSelect = (equipment: Equipment) => {
    setQuery(equipment.name);
    setShowDropdown(false);
    onSelect(equipment.id);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)} 
        placeholder="Keresés eszköz..."
      />
      {showDropdown && filtered.length > 0 && (
        <ul className="spreadsheet">
          {filtered.map(eq => (
            <li className="row"
              key={eq.id}
              onClick={() => handleSelect(eq)}
              style={{ padding: "8px", cursor: "pointer" }}
              onMouseDown={e => e.preventDefault()} 
            >
              <span className="cell">{eq.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CreateOrderForm: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<OrderCreateDto[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Equipment/Admin/Get/AllEquipments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          toast.error("Hiba az eszközök lekérésekor: " + errorText);
          return;
        }
        const result = await response.json();
        setEquipments(result.data ?? []);
      } catch (error) {
        console.error(error);
        toast.error("Nem sikerült lekérni az eszközöket.");
      }
    };
    if (token) fetchEquipments();
  }, [token]);

  const addItem = () => {
    if (selectedEquipmentId === null) {
      toast.error("Válassz ki egy eszközt!");
      return;
    }
    if (quantity <= 0) {
      toast.error("Adj meg egy érvényes mennyiséget!");
      return;
    }
    setOrderItems(prev => [...prev, { equipmentId: selectedEquipmentId, quantity }]);
    setSelectedEquipmentId(null);
    setQuantity(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      toast.error("Adj hozzá legalább egy rendelési tételt!");
      return;
    }
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
    } catch {
      toast.error("Hálózati hiba történt.");
    }
  };

  return (
    <div>
      <h2>Rendelés lista létrehozása</h2>
      <form onSubmit={handleSubmit}>
        <label>Eszköz keresése és kiválasztása:</label>
        <EquipmentSearchSelect
          equipments={equipments}
          onSelect={setSelectedEquipmentId}
          selectedId={selectedEquipmentId}
        />

        <div style={{ marginTop: "10px" }}>
          <label>Mennyiség (db):</label>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            min={0}
            style={{ width: "100px", marginLeft: "10px" }}
          />
        </div>

        <button type="button" onClick={addItem} style={{ marginTop: "10px" }}>
          Rendelés hozzáadása a listához
        </button>
        <button type="submit" style={{ marginLeft: "10px" }}>
          Lista küldése
        </button>
      </form>

      <h3>Aktuális rendelési tételek:</h3>
      <ul>
        {orderItems.map((item, idx) => {
          const equip = equipments.find(eq => eq.id === item.equipmentId);
          return (
            <li key={idx}>
              {equip ? equip.name : `Ismeretlen eszköz (ID: ${item.equipmentId})`} — Mennyiség: {item.quantity}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CreateOrderForm;