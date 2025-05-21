import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface CreateEquipmentDto {
  name: string;
  stock: number;
  price: number;
  locationId: number;
}

interface Location {
  id: number;
  name: string;
}

const CreateEquipment: React.FC = () => {
  const [formData, setFormData] = useState<CreateEquipmentDto>({
    name: "",
    stock: 0,
    price: 0,
    locationId: 0,
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [locationInput, setLocationInput] = useState(""); // a szöveg, amit a user beír
  const [showDropdown, setShowDropdown] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Helyszínek betöltése az API-ról
    const fetchLocations = async () => {
      
   try {
    const res = await fetch(`${API_BASE_URL}/api/Location/Admin&Student/Get/AllLocations`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await res.json();
    console.log("Kapott válasz:", result); // <- EZT tedd bele!

    // Most nézd meg itt, hogyan néz ki:
    // Ha pl. { data: [ ...helyszínek... ] } akkor így használd:
    setLocations(result.data);
    setFilteredLocations(result.data);

  } catch (err) {
    toast.error("Hiba a helyszínek betöltésekor");
  }
      
    };

    fetchLocations();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "locationInput") {
      setLocationInput(value);
      setShowDropdown(true);

      // Szűrés kis/nagybetűre érzéketlenül
      const filtered = locations.filter((loc) =>
        loc.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFormData({
        ...formData,
        [name]:
          name === "stock" || name === "price" || name === "locationId"
            ? Number(value)
            : value,
      });
    }
  };

  const handleSelectLocation = (loc: Location) => {
    setFormData({
      ...formData,
      locationId: loc.id,
    });
    setLocationInput(loc.name);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.locationId) {
      toast.error("Kérlek válassz helyszínt a listából!");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Equipment/Admin/Create/Equipment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Eszköz sikeresen létrehozva.");
        setFormData({
          name: "",
          stock: 0,
          price: 0,
          locationId: 0,
        });
        setLocationInput("");
      } else {
        toast.error(result.message || "Hiba történt az eszköz létrehozásakor.");
      }
    } catch (err) {
      toast.error("Hálózati hiba történt.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div style={{ maxWidth: 400, marginLeft: 0, marginRight: "auto" }}>
      <h2>Új eszköz létrehozása</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label>Név:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Készlet:</label>
        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            style={{ paddingRight: "30px" }}
          />
          <span
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#666",
              fontWeight: "bold",
            }}
          >
            db
          </span>
        </div>

        <label>Ár:</label>
        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            style={{ paddingRight: "30px" }}
          />
          <span
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#666",
              fontWeight: "bold",
            }}
          >
            Ft
          </span>
        </div>

        <label>Helyszín:</label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            name="locationInput"
            value={locationInput}
            onChange={handleChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // kicsit később zárja, hogy kattintani lehessen
            placeholder="Keresés helyszínre..."
            required
            autoComplete="off"
          />
          {showDropdown && filteredLocations.length > 0 && (
            <ul
              style={{
                position: "absolute",
                zIndex: 1000,
                backgroundColor: "white",
                border: "1px solid #ccc",
                width: "100%",
                maxHeight: 150,
                overflowY: "auto",
                margin: 0,
                padding: 0,
                listStyle: "none",
              }}
            >
              {filteredLocations.map((loc) => (
                <li
                  key={loc.id}
                  onMouseDown={() => handleSelectLocation(loc)} // onMouseDown, mert onClick elvész onBlur miatt
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  {loc.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Mentés..." : "Létrehozás"}
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateEquipment;