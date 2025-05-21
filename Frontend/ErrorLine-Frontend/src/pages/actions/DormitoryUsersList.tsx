import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface DormUser {
  id: number;
  username: string;
  email: string;
}

const DormitoryUsersList: React.FC = () => {
  const [users, setUsers] = useState<DormUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/User/Admin/Get/AllUsersInDormitory`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setUsers(result.data);
          setError(null);
        } else if (response.status === 401 || response.status === 403) {
          setError(
            "Nincs jogosultság vagy lejárt a token. Kérlek jelentkezz be újra."
          );
          setUsers([]);
        } else {
          setError("Hiba történt a felhasználók lekérésekor.");
          setUsers([]);
        }
      } catch (error) {
        setError("Hálózati hiba történt.");
        setUsers([]);
      }
    };

    fetchUsers();
  }, [token]);

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h2>Kollégiumi felhasználók listája</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DormitoryUsersList;
