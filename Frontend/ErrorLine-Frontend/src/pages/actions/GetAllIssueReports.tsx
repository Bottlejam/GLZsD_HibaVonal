import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

interface Worker {
  id: number;
  username: string;
}

interface IssueReportDto {
  id: number;
  date: string;
  description: string;
  reporter: { username: string };
  issueType: { name: string };
  location: { name: string };
  issueStatus: number;
  notes: { text: string }[];
  assignedWorker?: { username: string } | null;
  selectedStatus?: number; // új mező: kiválasztott státusz
}

interface AssignWorkerModalProps {
  onClose: () => void;
  onAssign: (workerId: number) => void;
}

const AssignWorkerModal: React.FC<AssignWorkerModalProps> = ({ onClose, onAssign }) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/User/MaintenanceManager/Get/AllMaintenanceWorkersInDormitory`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` || "" },
    })
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data.data);
        setFilteredWorkers(data.data);
      })
      .catch(() => toast.error("Nem sikerült betölteni a karbantartókat"));
  }, [token]);

  useEffect(() => {
    setFilteredWorkers(
      workers.filter((w) => w.username.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, workers]);

  return (
    <div>
      <div>
        <h3>Karbantartó hozzárendelése</h3>
        <input type="text" placeholder="Keresés..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
        <ul className="spreadsheet">
          {filteredWorkers.length === 0 && <li>Nincs találat</li>}
          {filteredWorkers.map((worker) => (
            <li key={worker.id} className="row">
              <button
                onClick={() => {
                  onAssign(worker.id);
                  onClose();
                }}
              >
                <span className="cell">{worker.username}</span>
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onClose} style={{ marginTop: 10 }}>Mégse</button>
      </div>
    </div>
  );
};

const GetAllIssueReports: React.FC = () => {
  const [issueReports, setIssueReports] = useState<IssueReportDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssignModalForId, setShowAssignModalForId] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  const issueStatusMap: Record<number, string> = {
    0: "Új",
    1: "Folyamatban",
    2: "Elkészült",
    3: "Lezárva",
    4: "Jóváhagyva",
  };

  useEffect(() => {
    const fetchIssueReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/IssueReport/MaintenanceManager/Get/AllIssueReports`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Hiba történt az adatok lekérésekor");
        }

        const data = await response.json();
        setIssueReports(data.data.map((issue: IssueReportDto) => ({
          ...issue,
          selectedStatus: issue.issueStatus,
        })));
        toast.success("Hibajelentések sikeresen betöltve.");
      } catch (err: any) {
        setError(err.message || "Ismeretlen hiba történt.");
        toast.error(err.message || "Ismeretlen hiba történt.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssueReports();
  }, [token]);

  const handleAssignWorker = async (issueId: number, workerId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/IssueReport/MaintenanceManager/AssignWorkerForIssue/${issueId}/${workerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ issueId, workerId }),
      });

      if (!response.ok) throw new Error("Hozzárendelés sikertelen");

      toast.success("Karbantartó sikeresen hozzárendelve");
      setIssueReports((prev) =>
        prev.map((issue) =>
          issue.id === issueId
            ? { ...issue, assignedWorker: { username: "Karbantartó" } }
            : issue
        )
      );
    } catch (error: any) {
      toast.error(error.message);
    }
    setShowAssignModalForId(null);
  };

  const handleStatusChange = async (issueId: number, newStatus: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/IssueReport/MaintenanceManager/ChangeIssueStatus/${issueId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStatus),
      });

      if (!response.ok) throw new Error("Állapot módosítás sikertelen");

      toast.success("Állapot sikeresen módosítva");
      setIssueReports((prev) =>
        prev.map((issue) =>
          issue.id === issueId
            ? { ...issue, issueStatus: newStatus, selectedStatus: newStatus }
            : issue
        )
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Hibajelentések listája</h2>
      {issueReports.length === 0 && <p>Nincs megjeleníthető hibajelentés.</p>}
      <ul className="spreadsheet">
        {issueReports.map((issue) => (
          <li key={issue.id} style={{ marginBottom: 20 }}>
            <li className="row">
            <p><strong>ID:</strong> <span className="cell">{issue.id}</span></p>
            <p><strong>Dátum:</strong> <span className="cell">{issue.date}</span></p>
            <p><strong>Leírás:</strong> <span className="cell">{issue.description}</span></p>
            <p><strong>Jelentő:</strong> <span className="cell">{issue.reporter?.username}</span></p>
            <p><strong>Hiba típusa:</strong> <span className="cell">{issue.issueType?.name}</span></p>
            <p><strong>Helyszín:</strong> <span className="cell">{issue.location?.name}</span></p>
            <p><strong>Állapot:</strong> <span className="cell">{issueStatusMap[issue.issueStatus] ?? "Ismeretlen"}</span></p>
            <p><strong>Karbantartó:</strong> <span className="cell">{issue.assignedWorker?.username ?? "Nincs hozzárendelve"}</span></p>
</li>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
              {!issue.assignedWorker && (
                <button onClick={() => setShowAssignModalForId(issue.id)}>Hozzárendelés</button>
              )}

              {issue.assignedWorker && (
                <>
                  <select
                    value={issue.selectedStatus}
                    onChange={(e) => {
                      const newStatus = Number(e.target.value);
                      setIssueReports((prev) =>
                        prev.map((i) =>
                          i.id === issue.id ? { ...i, selectedStatus: newStatus } : i
                        )
                      );
                    }}
                  >
                    {Object.entries(issueStatusMap).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() =>
                      handleStatusChange(issue.id, issue.selectedStatus ?? issue.issueStatus)
                    }
                    disabled={issue.selectedStatus === issue.issueStatus}
                  >
                    Módosítás
                  </button>
                </>
              )}
            </div>

            {showAssignModalForId === issue.id && (
              <AssignWorkerModal
                onAssign={(workerId) => handleAssignWorker(issue.id, workerId)}
                onClose={() => setShowAssignModalForId(null)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllIssueReports;