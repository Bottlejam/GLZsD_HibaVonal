import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";


interface Dormitory {
  name: string;
}

interface AdminUser {
  id: number;
  username: string;
  email: string;
  dormitory?: Dormitory;  // opcionális, ha nem mindig van
}

const AdminUsersList: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [error] = useState<string | null>(null);
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
        } else if (response.status === 401 || response.status === 403) {
          toast.error("Nincs jogosultság vagy lejárt a token. Kérlek jelentkezz be újra.");
          
        } else {
          toast.error("Hiba történt az admin felhasználók lekérésekor.");
          setAdmins([]);
        }
      } catch (error) {
        toast.error("Hálózati hiba történt.");
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
    <ul className="spreadsheet">
  {admins.map((admin) => (
    <li key={admin.id} className="row">
      Felhasználó név: <span className="cell">{admin.username}</span> - email cím:<span className="cell">{admin.email} -{" "}</span>
      kollégium: <span className="cell">{admin.dormitory?.name ?? "Nincs hozzárendelt kollégium"}</span>
    </li>
  ))}
</ul>
    </div>
  );
};

export default AdminUsersList;
