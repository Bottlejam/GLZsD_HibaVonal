import React, { useState } from "react";
import API_BASE_URL from "../api";
import toast, { Toaster } from "react-hot-toast";

interface LocationDto {
  name: string;
}

interface IssueTypeDto {
  name: string;
}

interface UserDto {
  username: string;
}

interface IssueReportDto {
  id: number;
  description: string;
  location: LocationDto;
  issueType: IssueTypeDto;
  reporter: UserDto;
}

const GetIssueReportById: React.FC = () => {
  const [issueId, setIssueId] = useState<number | "">("");
  const [issueReport, setIssueReport] = useState<IssueReportDto | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleFetch = async () => {
    setMessage(null);
    setError(null);
    setIssueReport(null);

    if (!issueId) {
      setError("Kérlek, add meg a hibajelentés ID-ját!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/IssueReport/MaintenanceManager/Get/IssueById/${issueId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setIssueReport(result.data);
        toast.success("Hibajelentés sikeresen lekérve.");
      } else {
        toast.error(result.message || "Hiba történt a lekérés során.");
      }
    } catch (err) {
      toast.error("Ismeretlen hiba történt.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h3>Hibajelentés lekérdezése ID alapján</h3>
      <input
        type="number"
        placeholder="Hibajelentés ID"
        value={issueId}
        onChange={(e) => setIssueId(Number(e.target.value))}
      />
      <button onClick={handleFetch}>Lekérés</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {issueReport && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Hibajelentés adatai:</h4>
          <p>
            <strong>ID:</strong> {issueReport.id}
          </p>
          <p>
            <strong>Leírás:</strong> {issueReport.description}
          </p>
          <p>
            <strong>Helyszín:</strong> {issueReport.location.name}
          </p>
          <p>
            <strong>Típus:</strong> {issueReport.issueType.name}
          </p>
          <p>
            <strong>Jelentő:</strong> {issueReport.reporter.username}
          </p>
        </div>
      )}
    </div>
  );
};

export default GetIssueReportById;
