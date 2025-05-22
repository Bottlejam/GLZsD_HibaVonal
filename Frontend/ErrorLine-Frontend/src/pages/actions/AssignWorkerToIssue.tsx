import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface UserDto {
  id: number;
  username: string;
}

const AssignWorkerToIssue: React.FC = () => {
  const [issueId, setIssueId] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [workers, setWorkers] = useState<UserDto[]>([]);
  const [message, setMessage] = useState<string | null>(null);
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
        const result = await response.json();
        if (response.ok) {
          setWorkers(result.data);
        } else if (response.status === 401 || response.status === 403) {
          // Jogosultság hiány esetén ne navigáljunk ki, csak toast
          toast.error("Nincs jogosultság a karbantartók betöltéséhez.");
        } else {
          toast.error("Nem sikerült betölteni a karbantartókat.");
        }
      } catch {
        toast.error("Hálózati hiba történt.");
      }
    };

    fetchWorkers();
  }, [token]);

  const handleAssign = async () => {
    setError(null);
    setMessage(null);

    if (!issueId || !selectedWorkerId) {
      setError("Tölts ki minden mezőt.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/MaintenanceManager/AssignWorkerForIssue/${issueId}/${selectedWorkerId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      console.log("Response status:", response.status);
      console.log("Fetched workers data:", result);
      if (response.ok) {
        setMessage("Sikeres hozzárendelés.");
        setIssueId("");
        setSelectedWorkerId("");
      } else {
        setError(result.message || "Hiba a hozzárendelés során.");
      }
    } catch {
      setError("Hálózati hiba történt.");
    }
  };

  return (
    <div>
      <h3>Dolgozó hozzárendelése hibajelentéshez</h3>
      <input
        type="number"
        placeholder="Hibajelentés ID"
        value={issueId}
        onChange={(e) => setIssueId(e.target.value)}
      />

      <select
        value={selectedWorkerId}
        onChange={(e) => setSelectedWorkerId(e.target.value)}
      >
        <option value="">-- Válassz karbantartót --</option>
        {workers.map((worker) => (
          <option key={worker.id} value={worker.id}>
            {worker.username}
          </option>
        ))}
      </select>

      <br />
      <button onClick={handleAssign}>Hozzárendelés</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AssignWorkerToIssue;
