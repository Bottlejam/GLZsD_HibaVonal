import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast, { Toaster } from "react-hot-toast";

interface Dormitory {
  id: number;
  name: string;
  address: string;
  // További mezők, ha vannak
}

const GetDormitoryById: React.FC = () => {
  const [dormitoryId, setDormitoryId] = useState<number | "">("");
  const [dormitory, setDormitory] = useState<Dormitory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token"); // ha kell auth

  const fetchDormitory = async () => {
    if (!dormitoryId) {
      setError("Kérlek, adj meg egy érvényes kollégium ID-t.");
      setDormitory(null);
      return;
    }

    setLoading(true);
    setError(null);

 
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Dormitory/SystemAdmin/Get/DormitoryById/${dormitoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setDormitory(result.data);
        toast.success("Kollégium sikeresen lekérve.");
      } else {
        toast.error(result.message || "Hiba történt a lekéréskor.");
        setDormitory(null);
      }
    } catch (err) {
      toast.error("Hálózati hiba történt.");
      setDormitory(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Kollégium lekérése ID alapján</h2>
      <input
        type="number"
        placeholder="Kollégium ID"
        value={dormitoryId}
        onChange={(e) => setDormitoryId(Number(e.target.value))}
        min={1}
      />
      <button onClick={fetchDormitory} disabled={loading}>
        Lekérés
      </button>

      {loading && <p>Betöltés...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {dormitory && (
        <div style={{ marginTop: "1rem" }}>
          <h3>{dormitory.name}</h3>
          <p>
            <strong>Cím:</strong> {dormitory.address}
          </p>
          {/* Itt jöhetnek még további mezők */}
        </div>
      )}
    </div>
  );
};

export default GetDormitoryById;
