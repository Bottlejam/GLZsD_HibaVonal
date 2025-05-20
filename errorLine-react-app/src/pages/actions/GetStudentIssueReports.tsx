import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface IssueReportDto {
  id: number;
  description: string;
  issueType: {
    name: string;
  };
  location: {
    name: string;
    dormitory: {
      name: string;
    };
  };
  reporter: {
    name: string;
    email: string;
  };
  notes: {
    content: string;
  }[];
}

const GetStudentIssueReports: React.FC = () => {
  const [reports, setReports] = useState<IssueReportDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/IssueReport/Student/Get/MyReports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          setReports(result.data);
        } else {
          setError(result.message || "Hiba történt a jelentések lekérésekor.");
        }
      } catch (err) {
        setError("Hálózati vagy egyéb hiba történt.");
      }
    };

    fetchReports();
  }, [token]);

  return (
    <div>
      <h3>Saját hibajelentések</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {reports.length === 0 && !error && <p>Nincs hibajelentésed.</p>}

      {reports.map((report) => (
        <div
          key={report.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>ID:</strong> {report.id}
          </p>
          <p>
            <strong>Leírás:</strong> {report.description}
          </p>
          <p>
            <strong>Helyszín:</strong> {report.location.dormitory.name} /{" "}
            {report.location.name}
          </p>
          <p>
            <strong>Hibatípus:</strong> {report.issueType.name}
          </p>
          <p>
            <strong>Beküldő:</strong> {report.reporter.name} (
            {report.reporter.email})
          </p>
          {report.notes.length > 0 && (
            <div>
              <strong>Megjegyzések:</strong>
              <ul>
                {report.notes.map((note, index) => (
                  <li key={index}>{note.content}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GetStudentIssueReports;
