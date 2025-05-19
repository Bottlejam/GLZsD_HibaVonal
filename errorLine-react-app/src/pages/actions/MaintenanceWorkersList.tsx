import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface MaintenanceWorker {
  id: number;
  username: string;
  email: string;
  // további mezők, ha vannak
}

const MaintenanceWorkersList: React.FC = () => {
  const [workers, setWorkers] = useState<MaintenanceWorker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/User/MaintenanceManager/Get/AllMaintenanceWorkersInDormitory`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setWorkers(result.data);
          setError(null);
        } else if (response.status === 401 || response.status === 403) {
          setError(
            "Nincs jogosultság vagy lejárt a token. Kérlek jelentkezz be újra."
          );
          setWorkers([]);
        } else {
          setError("Hiba történt a karbantartók lekérésekor.");
          setWorkers([]);
        }
      } catch (error) {
        setError("Hálózati hiba történt.");
        setWorkers([]);
      }
    };

    fetchWorkers();
  }, [token]);

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h2>Karbantartók listája a kollégiumban</h2>
      <ul>
        {workers.map((worker) => (
          <li key={worker.id}>
            {worker.username} - {worker.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaintenanceWorkersList;
