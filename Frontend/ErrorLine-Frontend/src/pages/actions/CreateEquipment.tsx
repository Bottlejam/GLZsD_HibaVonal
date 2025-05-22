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
  const [locationInput, setLocationInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/Location/Admin&Student/Get/AllLocations`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const result = await res.json();
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
    <div>
      <h2>Új eszköz létrehozása</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Név */}
        <label htmlFor="name">Név:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ marginBottom: 15, width: "100%", padding: 8, fontSize: 16 }}
        />

        {/* Készlet */}
        <label htmlFor="stock">Készlet:</label>
        <div style={{ position: "relative", marginBottom: 15 }}>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            style={{
              paddingRight: 50,
              paddingLeft: 8,
              paddingTop: 8,
              paddingBottom: 8,
              fontSize: 16,
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: 30,
              top: "38.2%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            db
          </span>
        </div>

        {/* Ár */}
        <label htmlFor="price">Ár:</label>
        <div style={{ position: "relative", marginBottom: 15 }}>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            style={{
              paddingRight: 50,
              paddingLeft: 8,
              paddingTop: 8,
              paddingBottom: 8,
              fontSize: 16,
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: 30,
              top: "38.2%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Ft
          </span>
        </div>

        {/* Helyszín */}
        <label htmlFor="locationInput">Helyszín:</label>
        <div style={{ position: "relative", marginBottom: 20 }}>
          <input
            type="text"
            id="locationInput"
            name="locationInput"
            value={locationInput}
            onChange={handleChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="Keresés helyszínre..."
            required
            autoComplete="off"
            style={{ width: "100%", padding: 8, fontSize: 16, boxSizing: "border-box" }}
          />
          {showDropdown && filteredLocations.length > 0 && (
            <ul className="spreadsheet"
            >
              {filteredLocations.map((loc) => (
                <li className="row"
                  key={loc.id}
                  onMouseDown={() => handleSelectLocation(loc)}
                  
                >
                  <span className="cell">{loc.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Mentés..." : "Létrehozás"}
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateEquipment;