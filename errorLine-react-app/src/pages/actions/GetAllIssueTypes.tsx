import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

interface IssueType {
  id: number;
  name: string;
}

const GetAllIssueTypes: React.FC = () => {
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchIssueTypes = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/IssueReport/Admin/Get/AllIssueTypes`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Hiba történt a hibatípusok lekérésekkor");
        }

        const result = await response.json();
        setIssueTypes(result.data);
      } catch (err: any) {
        setError(err.message || "Ismeretlen hiba történt.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssueTypes();
  }, []);

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Hibatípusok listája</h2>
      <ul>
        {issueTypes.map((IssueType) => (
          <li key={IssueType.id}>
            {IssueType.name} ({IssueType.id})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllIssueTypes;
