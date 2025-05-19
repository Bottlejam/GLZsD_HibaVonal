import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface AdminUser {
  id: number;
  username: string;
  email: string;
}

const AdminUsersList: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/User/SystemAdmin/Get/AllAdminUsers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setAdmins(result.data);
          setError(null);
        } else if (response.status === 401 || response.status === 403) {
          setError(
            "Nincs jogosultság vagy lejárt a token. Kérlek jelentkezz be újra."
          );
          setAdmins([]);
        } else {
          setError("Hiba történt az admin felhasználók lekérésekor.");
          setAdmins([]);
        }
      } catch (error) {
        setError("Hálózati hiba történt.");
        setAdmins([]);
      }
    };

    fetchAdmins();
  }, [token]);

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h2>Admin felhasználók listája</h2>
      <ul>
        {admins.map((admin) => (
          <li key={admin.id}>
            {admin.username} - {admin.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsersList;
