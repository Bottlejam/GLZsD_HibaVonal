import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface MaintenanceWorker {
  id: number;
  username: string;
  email: string;
  // további mezők, ha vannak
}

const MaintenanceWorkersList: React.FC = () => {
  const [workers, setWorkers] = useState<MaintenanceWorker[]>([]);
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
        } else if (response.status === 401 || response.status === 403) {
          toast.error(
            "Nincs jogosultság vagy lejárt a token. Kérlek jelentkezz be újra."
          );
          setWorkers([]);
        } else {
          toast.error("Hiba történt a karbantartók lekérésekor.");
          setWorkers([]);
        }
      } catch (error) {
        toast.error("Hálózati hiba történt.");
        setWorkers([]);
      }
    };

    fetchWorkers();
  }, [token]);

  return (
    <div>
      <h2>Karbantartók listája a kollégiumban</h2>
      <ul className="spreadsheet">
        {workers.map((worker) => (
          <li key={worker.id} className="row">
           Felhasználónév: <span className="cell">{worker.username}</span> - Email:<span className="cell">{worker.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaintenanceWorkersList;
